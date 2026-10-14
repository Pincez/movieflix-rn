import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator, useWindowDimensions, StatusBar as RNStatusBar } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as ScreenOrientation from "expo-screen-orientation";
import { api, MediaType, StreamResult } from "../../src/services/api";
import {
  getLocalVideoUri,
  useDownloadsStore,
  loadAllDownloads,
} from "../../src/services/downloads";

async function fetchStream(
  type: MediaType,
  id: string,
  quality: string,
  hash?: string,
  fileId?: string,
  season?: number,
  episode?: number,
): Promise<StreamResult> {
  if (fileId && hash) return api.streamTorrentFile(hash, fileId, quality);
  if (type === "tv") return api.streamTV(id, season ?? 1, episode ?? 1, quality, hash);
  return api.streamMovie(id, quality, hash);
}

export default function WatchScreen() {
  const params = useLocalSearchParams<{
    id: string;
    type?: MediaType;
    quality?: string;
    hash?: string;
    file_id?: string;
    season?: string;
    episode?: string;
    localId?: string;
  }>();

  const id = params.id;
  const type: MediaType = (params.type as MediaType) || "movie";
  const season = params.season ? Number(params.season) : 1;
  const episode = params.episode ? Number(params.episode) : 1;
  const quality = params.quality || "1080p";

  const { width } = useWindowDimensions();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [checkingLocal, setCheckingLocal] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const items = useDownloadsStore((s) => s.items);
  const setItems = useDownloadsStore((s) => s.setItems);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } catch (e) {
          console.warn("orientation lock failed", e);
        }
      })();
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      RNStatusBar.setHidden(true, "fade");
      return () => {
        RNStatusBar.setHidden(false, "fade");
      };
    }, []),
  );

  useEffect(() => {
    (async () => {
      try {
        if (items.length === 0) {
          const list = await loadAllDownloads();
          setItems(list);
        }

        if (params.localId) {
          const match = items.find((x) => x.id === params.localId);
          if (match?.localUri) {
            setLocalUri(match.localUri);
            setCheckingLocal(false);
            return;
          }
        }

        if (params.hash) {
          const uri = await getLocalVideoUri(
            params.hash,
            params.file_id ? Number(params.file_id) : undefined,
          );
          if (uri) {
            setLocalUri(uri);
            setCheckingLocal(false);
            return;
          }
        }

        const anyLocal = items.find(
          (x) =>
            x.tmdbId === Number(id) &&
            x.mediaType === type &&
            x.status === "completed" &&
            (type === "movie" || (x.season === season && x.episode === episode)),
        );
        if (anyLocal?.localUri) {
          setLocalUri(anyLocal.localUri);
          setCheckingLocal(false);
          return;
        }
      } catch (e) {
        console.warn("local check failed", e);
      }
      setCheckingLocal(false);
    })();
  }, [params.localId, params.hash, params.file_id, id, type, season, episode]);

  const streamQuery = useQuery({
    queryKey: ["stream", type, id, quality, params.hash, params.file_id, season, episode],
    queryFn: () => fetchStream(type, id, quality, params.hash, params.file_id, season, episode),
    enabled: !!id && !localUri,
    staleTime: 0,
    retry: 0,
  });

  const streamUrl = localUri || streamQuery.data?.streamUrl;
  const isOffline = !!localUri;
  const errorMsg = (streamQuery.error as any)?.message || streamQuery.data?.error;

  const player = useVideoPlayer(streamUrl || null, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 1;
    p.play();
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!player) return;
    const timeSub = player.addListener("timeUpdate", (payload) => {
      setCurrentTime(payload.currentTime);
    });
    const statusSub = player.addListener("statusChange", (payload) => {
      if (payload.status === "readyToPlay") {
        setDuration(player.duration || 0);
      }
    });
    return () => {
      try { timeSub?.remove(); } catch {}
      try { statusSub?.remove(); } catch {}
    };
  }, [player]);

  useEffect(() => {
    if (!streamUrl) return;
    try {
      player.replaceAsync(streamUrl);
      player.play();
    } catch (e) {
      console.warn("player replace failed", e);
    }
  }, [streamUrl, player]);

  const titleLabel = type === "tv"
    ? `S${season}E${episode}`
    : streamQuery.data?.filename || "Now Playing";

  const isLoading = checkingLocal || (!localUri && streamQuery.isLoading);

  const togglePlayPause = useCallback(() => {
    if (!player) return;
    try {
      if (player.playing) player.pause();
      else player.play();
    } catch {}
  }, [player]);

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* ─── VideoView is ALWAYS mounted when we have a URL ───
          Wrapping it in a conditional causes the OS surface to be
          recreated on every state change, which is what caused the
          glitches and sometimes froze seeking. Now it lives from
          mount to unmount of the screen. */}
      <VideoView
        player={player}
        style={{ flex: 1, opacity: streamUrl ? 1 : 0 }}
        nativeControls
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
        showSubtitles={true}
      />

      {/* ─── Loading / error overlays sit on top of the video ─── */}
      {isLoading ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute", inset: 0,
            alignItems: "center", justifyContent: "center",
            backgroundColor: "#000",
          }}
        >
          <ActivityIndicator color="#fff" size="large" />
          <Text style={{ color: "#fff", marginTop: 12 }}>
            {checkingLocal ? "Checking downloads…" : "Fetching stream…"}
          </Text>
        </View>
      ) : !streamUrl ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute", inset: 0,
            alignItems: "center", justifyContent: "center",
            paddingHorizontal: 24, backgroundColor: "#000",
          }}
        >
          <Ionicons name="videocam-off-outline" size={56} color="#64748B" />
          <Text style={{ color: "#94A3B8", marginTop: 16, textAlign: "center", fontSize: 16 }}>
            Not available yet
          </Text>
          {errorMsg ? (
            <Text style={{ color: "#475569", marginTop: 12, fontSize: 12, textAlign: "center" }}>
              {errorMsg}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* ─── Top-left: close ─── */}
      <Pressable
        onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/"))}
        hitSlop={20}
        style={{
          position: "absolute",
          top: 24, left: 24,
          width: 44, height: 44, borderRadius: 22,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Ionicons name="close" size={26} color="#fff" />
      </Pressable>

      {/* ─── Top-right: title chip + OFFLINE badge ─── */}
      <View
        style={{
          position: "absolute",
          top: 24, right: 24,
          flexDirection: "row", alignItems: "center",
          zIndex: 100, maxWidth: width - 140,
        }}
      >
        {isOffline ? (
          <View
            style={{
              backgroundColor: "#10B981",
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
              flexDirection: "row", alignItems: "center", marginRight: 8,
            }}
          >
            <Ionicons name="cloud-offline" size={12} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800", marginLeft: 4 }}>
              OFFLINE
            </Text>
          </View>
        ) : null}
        <Text
          style={{
            color: "#fff", fontWeight: "700", fontSize: 13,
            backgroundColor: "rgba(0,0,0,0.55)",
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
          }}
          numberOfLines={1}
        >
          {titleLabel}
        </Text>
      </View>

      {/* ─── Time chip bottom-left ─── */}
      {streamUrl && duration > 0 ? (
        <View
          style={{
            position: "absolute",
            bottom: 28, left: 28,
            backgroundColor: "rgba(0,0,0,0.55)",
            paddingHorizontal: 10, paddingVertical: 4,
            borderRadius: 6,
            zIndex: 100,
          }}
          pointerEvents="none"
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
            {fmt(currentTime)} / {fmt(duration)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
