import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { create } from "zustand";
import { API_URL } from "./api";
import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";

export interface DownloadItem {
  id: string;
  hash: string;
  fileId: number;
  torrentId: number;
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  poster?: string;
  quality: string;
  sizeMb: number;
  localUri: string;
  downloadedAt: number;
  status: "queued" | "downloading" | "completed" | "failed";
  progress: number;
  error?: string;
}

const BASE_DIR = `${FileSystem.documentDirectory}movieflix/`;
const VIDEO_DIR = `${BASE_DIR}videos/`;
const META_DIR = `${BASE_DIR}meta/`;

async function ensureDirs() {
  const info1 = await FileSystem.getInfoAsync(BASE_DIR);
  if (!info1.exists) await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });
  const info2 = await FileSystem.getInfoAsync(VIDEO_DIR);
  if (!info2.exists) await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true });
  const info3 = await FileSystem.getInfoAsync(META_DIR);
  if (!info3.exists) await FileSystem.makeDirectoryAsync(META_DIR, { intermediates: true });
}

function metaPath(id: string) { return `${META_DIR}${id}.json`; }
function videoPath(id: string, ext: string = "mkv") { return `${VIDEO_DIR}${id}.${ext}`; }

type DownloadsState = {
  items: DownloadItem[];
  loaded: boolean;
  preparing: boolean;
  activeTransfers: number;
  setItems: (items: DownloadItem[]) => void;
  upsert: (item: DownloadItem) => void;
  remove: (id: string) => void;
  updateProgress: (id: string, progress: number, status?: DownloadItem["status"]) => void;
  setPreparing: (v: boolean) => void;
  setActiveTransfers: (n: number) => void;
};

export const useDownloadsStore = create<DownloadsState>((set) => ({
  items: [],
  loaded: false,
  preparing: false,
  activeTransfers: 0,
  setItems: (items) => set({ items, loaded: true }),
  upsert: (item) =>
    set((s) => {
      const idx = s.items.findIndex((x) => x.id === item.id);
      if (idx === -1) return { items: [item, ...s.items] };
      const copy = [...s.items];
      copy[idx] = item;
      return { items: copy };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
  updateProgress: (id, progress, status) =>
    set((s) => ({
      items: s.items.map((x) =>
        x.id === id ? { ...x, progress, status: status || x.status } : x,
      ),
    })),
  setPreparing: (v) => set({ preparing: v }),
  setActiveTransfers: (n) => set({ activeTransfers: n }),
}));

const MAX_TRANSFERS = 3;
let activeTransfers = 0;
const transferWaiters: Array<() => void> = [];
const activeDownloadResumables = new Map<string, FileSystem.DownloadResumable>();
const cancelledIds = new Set<string>();

async function acquireTransferSlot(): Promise<void> {
  if (activeTransfers < MAX_TRANSFERS) {
    activeTransfers++;
    useDownloadsStore.getState().setActiveTransfers(activeTransfers);
    return;
  }
  await new Promise<void>((resolve) => transferWaiters.push(resolve));
  activeTransfers++;
  useDownloadsStore.getState().setActiveTransfers(activeTransfers);
}

function releaseTransferSlot(): void {
  activeTransfers = Math.max(0, activeTransfers - 1);
  useDownloadsStore.getState().setActiveTransfers(activeTransfers);
  const next = transferWaiters.shift();
  if (next) next();
}

let prepareChain: Promise<unknown> = Promise.resolve();
const inFlightPrepares = new Map<string, Promise<any>>();

function enqueuePrepare(key: string, run: () => Promise<any>): Promise<any> {
  const existing = inFlightPrepares.get(key);
  if (existing) return existing;
  const chained = prepareChain.then(run).finally(() => { inFlightPrepares.delete(key); });
  prepareChain = chained.catch(() => undefined);
  inFlightPrepares.set(key, chained);
  return chained;
}

async function saveMeta(item: DownloadItem) {
  await ensureDirs();
  await FileSystem.writeAsStringAsync(metaPath(item.id), JSON.stringify(item));
}

async function loadMeta(id: string): Promise<DownloadItem | null> {
  try {
    const info = await FileSystem.getInfoAsync(metaPath(id));
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(metaPath(id));
    return JSON.parse(raw) as DownloadItem;
  } catch { return null; }
}

async function deleteMeta(id: string) {
  try { await FileSystem.deleteAsync(metaPath(id), { idempotent: true }); } catch {}
}

export async function loadAllDownloads(): Promise<DownloadItem[]> {
  if (IS_WEB) return [];
  await ensureDirs();
  try {
    const files = await FileSystem.readDirectoryAsync(META_DIR);
    const items: DownloadItem[] = [];
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      const id = f.replace(".json", "");
      const item = await loadMeta(id);
      if (!item) continue;
      if (item.status === "queued") { items.push(item); continue; }
      const videoInfo = await FileSystem.getInfoAsync(item.localUri);
      if (!videoInfo.exists) {
        if (item.status === "downloading") {
          const failed = { ...item, status: "failed" as const, error: "Download was interrupted. Please retry." };
          await saveMeta(failed); items.push(failed); continue;
        }
        await deleteMeta(id); continue;
      }
      items.push(item);
    }
    return items.sort((a, b) => b.downloadedAt - a.downloadedAt);
  } catch { return []; }
}

export async function pollDownloadStatus(torrentId: number): Promise<{
  completed: boolean;
  files: Array<{ id: number; name: string; size: number; size_mb: number; mimetype: string }>;
}> {
  const url = new URL(`${API_URL}/api/download/status`);
  url.searchParams.set("torrent_id", String(torrentId));
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Could not check download status (${res.status})`);
  }
  return { completed: !!data.completed, files: Array.isArray(data.files) ? data.files : [] };
}

export async function startDownload(opts: {
  hash: string; tmdbId: number; mediaType: "movie" | "tv"; quality: string;
  title: string; poster?: string; season?: number; episode?: number;
  fileId?: number; seasonPack?: boolean;
}): Promise<"queued" | "started"> {
  if (IS_WEB) throw new Error("Downloads are only available in the mobile app");
  const { hash, tmdbId, mediaType, quality, title, poster, season, episode, fileId, seasonPack } = opts;
  const store = useDownloadsStore.getState();
  const key = hash.toLowerCase();

  const prepare = async (): Promise<{ torrentId: number; files: any[] } | "queued"> => {
    const prepareUrl = new URL(`${API_URL}/api/download`);
    prepareUrl.searchParams.set("hash", hash);
    prepareUrl.searchParams.set("type", mediaType);
    prepareUrl.searchParams.set("tmdb_id", String(tmdbId));
    prepareUrl.searchParams.set("quality", quality);
    prepareUrl.searchParams.set("title", title);
    if (seasonPack) prepareUrl.searchParams.set("season_pack", "true");
    if (season != null) prepareUrl.searchParams.set("season", String(season));
    if (episode != null) prepareUrl.searchParams.set("episode", String(episode));

    const prepRes = await fetch(prepareUrl.toString());
    const prep = await prepRes.json();

    if (!prep.success && prep.status === "queued") {
      const tid = Number(prep.torrentId);
      if (!Number.isFinite(tid) || tid <= 0) throw new Error("Server queued without a valid torrent ID.");
      const queuedItem: DownloadItem = {
        id: `${hash}:pending:${fileId ?? "first"}`,
        hash, fileId: fileId ?? -1, torrentId: tid,
        tmdbId, mediaType, season, episode, title, poster, quality,
        sizeMb: 0, localUri: "", downloadedAt: Date.now(),
        status: "queued", progress: 0,
        error: "TorBox is preparing this download. It will start automatically.",
      };
      store.upsert(queuedItem);
      await saveMeta(queuedItem);
      return "queued";
    }

    if (!prep.success && typeof prep.error === "string" &&
        prep.error.toLowerCase().includes("torrent id could not be found")) {
      throw new Error("__RETRY_PREPARE__");
    }

    if (!prep.success) throw new Error(prep.error || `Prepare failed (${prepRes.status})`);
    const tid = Number(prep.torrentId);
    if (!Number.isFinite(tid) || tid <= 0) throw new Error("No valid torrent ID returned.");
    return { torrentId: tid, files: Array.isArray(prep.files) ? prep.files : [] };
  };

  let prepared: any = null;
  store.setPreparing(true);
  try {
    prepared = await enqueuePrepare(key, async () => {
      try { return await prepare(); }
      catch (e: any) {
        if (e.message === "__RETRY_PREPARE__") {
          await new Promise((r) => setTimeout(r, 30_000));
          return await prepare();
        }
        throw e;
      }
    });
  } finally {
    store.setPreparing(false);
  }

  if (prepared === "queued") return "queued";

  const file = fileId == null
    ? prepared.files.find((c: any) => (c.mimetype || "").includes("video")) || prepared.files[0]
    : prepared.files.find((c: any) => Number(c.id) === fileId);
  if (!file) throw new Error("Selected file not returned by backend.");

  await finishDownload({
    torrentId: prepared.torrentId, file,
    hash, tmdbId, mediaType, quality, title, poster, season, episode,
  });
  return "started";
}

let isResumingQueuedDownloads = false;

export async function resumeQueuedDownloads(): Promise<void> {
  if (isResumingQueuedDownloads) return;
  isResumingQueuedDownloads = true;
  try {
    const store = useDownloadsStore.getState();
    const queued = store.items.filter((x) => x.status === "queued" && x.torrentId > 0);
    for (const item of queued) {
      const status = await pollDownloadStatus(item.torrentId);
      if (status.completed && status.files.length > 0) {
        const file = item.fileId >= 0
          ? status.files.find((c) => Number(c.id) === item.fileId)
          : status.files.find((c) => (c.mimetype || "").includes("video")) || status.files[0];
        if (!file) continue;
        const completedId = `${item.hash}:${file.id}`;
        const alreadyDownloaded = store.items.some((d) => d.id === completedId && d.status === "completed");
        if (alreadyDownloaded) { await deleteMeta(item.id); store.remove(item.id); continue; }
        await deleteMeta(item.id);
        store.remove(item.id);
        await finishDownload({
          torrentId: item.torrentId, file,
          hash: item.hash, tmdbId: item.tmdbId, mediaType: item.mediaType,
          quality: item.quality, title: item.title, poster: item.poster,
          season: item.season, episode: item.episode,
        });
      }
    }
  } finally { isResumingQueuedDownloads = false; }
}

async function finishDownload(opts: {
  torrentId: number; file: { id: number; name: string; size_mb?: number; size?: number };
  hash: string; tmdbId: number; mediaType: "movie" | "tv";
  quality: string; title: string; poster?: string;
  season?: number; episode?: number;
}) {
  const { torrentId, file, hash, tmdbId, mediaType, quality, title, poster, season, episode } = opts;
  const store = useDownloadsStore.getState();
  const id = `${hash}:${file.id}`;
  await ensureDirs();

  const candidateExt = file.name?.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]{1,8}$/.test(candidateExt) ? candidateExt : "mkv";
  const localUri = videoPath(id, ext);

  const downloadItem: DownloadItem = {
    id, hash, fileId: file.id, torrentId, tmdbId, mediaType, season, episode,
    title, poster, quality,
    sizeMb: file.size_mb || Math.round((file.size || 0) / 1024 / 1024),
    localUri, downloadedAt: Date.now(),
    status: "downloading", progress: 0,
  };
  store.upsert(downloadItem);
  await saveMeta(downloadItem);

  await acquireTransferSlot();
  try {
    await FileSystem.deleteAsync(localUri, { idempotent: true });
    const fileUrl = new URL(`${API_URL}/api/download/file`);
    fileUrl.searchParams.set("torrent_id", String(torrentId));
    fileUrl.searchParams.set("file_id", String(file.id));
    const fileRes = await fetch(fileUrl.toString());
    const fileData = await fileRes.json();
    if (!fileRes.ok || !fileData.success || !fileData.downloadUrl) {
      throw new Error(fileData.error || `Could not get download URL (${fileRes.status})`);
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      fileData.downloadUrl, localUri, {},
      (progress) => {
        const total = progress.totalBytesExpectedToWrite || 1;
        const pct = Math.min(99, Math.round((progress.totalBytesWritten / total) * 100));
        store.updateProgress(id, pct, "downloading");
      },
    );
    activeDownloadResumables.set(id, downloadResumable);

    const result = await downloadResumable.downloadAsync();
    activeDownloadResumables.delete(id);

    if (cancelledIds.has(id)) { cancelledIds.delete(id); return; }
    if (!result || !result.uri) throw new Error("Download did not complete");
    if (result.status < 200 || result.status >= 300) throw new Error(`File download failed (${result.status})`);

    const done = { ...downloadItem, status: "completed" as const, progress: 100,
                   localUri: result.uri, downloadedAt: Date.now() };
    store.upsert(done);
    await saveMeta(done);
  } catch (err: any) {
    activeDownloadResumables.delete(id);
    if (cancelledIds.has(id)) { cancelledIds.delete(id); return; }
    const failed = { ...downloadItem, status: "failed" as const, error: err?.message || "Download failed" };
    store.upsert(failed);
    await saveMeta(failed);
    throw err;
  } finally { releaseTransferSlot(); }
}

export async function cancelDownload(id: string): Promise<void> {
  const store = useDownloadsStore.getState();
  const item = store.items.find((x) => x.id === id);
  cancelledIds.add(id);
  const resumable = activeDownloadResumables.get(id);
  if (resumable) {
    try { await resumable.pauseAsync(); } catch {}
    activeDownloadResumables.delete(id);
  }
  if (item?.localUri) {
    try { await FileSystem.deleteAsync(item.localUri, { idempotent: true }); } catch {}
  }
  await deleteMeta(id);
  store.remove(id);
}

export async function deleteDownload(id: string): Promise<void> {
  const store = useDownloadsStore.getState();
  const item = store.items.find((x) => x.id === id);
  if (item?.localUri) {
    try { await FileSystem.deleteAsync(item.localUri, { idempotent: true }); } catch {}
  }
  await deleteMeta(id);
  store.remove(id);
}

export async function exportDownload(id: string): Promise<void> {
  const store = useDownloadsStore.getState();
  const item = store.items.find((x) => x.id === id);
  if (!item) throw new Error("Download not found");
  if (item.status !== "completed") throw new Error("Download not complete yet");
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error("Sharing is not available on this device");
  await Sharing.shareAsync(item.localUri, { mimeType: "video/*", dialogTitle: "Export " + item.title, UTI: "public.movie" });
}

export async function getLocalVideoUri(hash: string, fileId?: number): Promise<string | null> {
  const store = useDownloadsStore.getState();
  const candidates = store.items.filter(
    (x) => x.hash.toLowerCase() === hash.toLowerCase() && x.status === "completed"
      && (fileId == null || x.fileId === fileId),
  );
  return candidates.length > 0 ? candidates[0].localUri : null;
}

export function findDownloadForTitle(
  tmdbId: number, mediaType: "movie" | "tv", season?: number, episode?: number,
): DownloadItem | null {
  const store = useDownloadsStore.getState();
  return store.items.find(
    (x) => x.tmdbId === tmdbId && x.mediaType === mediaType && x.status === "completed"
      && (season == null || x.season === season)
      && (episode == null || x.episode === episode),
  ) || null;
}
