import { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  startDownload,
  useDownloadsStore,
  resumeQueuedDownloads,
  exportDownload,
  deleteDownload,
} from "../../src/services/downloads";

type Props = {
  hash: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  quality: string;
  title: string;
  poster?: string;
  season?: number;
  episode?: number;
  fileId?: number;
  seasonPack?: boolean;
  sizeMb?: number;
};

export default function DownloadButton(props: Props) {
  const { hash, tmdbId, mediaType, quality, title, poster, season, episode, fileId, seasonPack } = props;
  const [busy, setBusy] = useState(false);

  const hasHash = !!hash && hash.length >= 32;

  // Subscribe to the store so this component re-renders when the download changes
  const items = useDownloadsStore((s) => s.items);
  const existing = hasHash
    ? items.find(
        (x) =>
          x.hash.toLowerCase() === hash.toLowerCase() &&
          (mediaType !== "tv" || (x.season === season && x.episode === episode)) &&
          (fileId == null || x.fileId === fileId),
      )
    : undefined;

  const status = existing?.status;
  const progress = existing?.progress ?? 0;

  // Auto-poll while queued, so the user doesn't have to tap again
  useEffect(() => {
    if (status !== "queued") return;

    let cancelled = false;
    const poll = async () => {
      try {
        await resumeQueuedDownloads();
      } catch {}
    };

    poll();
    const interval = setInterval(() => {
      if (!cancelled) poll();
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status]);


  const onPress = async () => {
    console.log("[DL:press]", { hash, tmdbId, mediaType, quality, season, episode, fileId, seasonPack, hasHash });
    if (!hasHash) return;
    Haptics.selectionAsync();

    // Already completed → offer export / delete
    if (status === "completed" && existing) {
      Alert.alert(
        "Already downloaded",
        `"${title}" is on your device.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Export",
            onPress: async () => {
              try {
                await exportDownload(existing.id);
              } catch (e: any) {
                Alert.alert("Export failed", e?.message || "Could not export.");
              }
            },
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteDownload(existing.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          },
        ],
      );
      return;
    }

    // Queued → tell user
    if (status === "queued" && existing) {
      setBusy(true);
      try {
        await resumeQueuedDownloads();
        const updated = useDownloadsStore.getState().items.find(
          (item) =>
            item.hash.toLowerCase() === hash.toLowerCase() &&
            item.mediaType === mediaType &&
            (mediaType !== "tv" || (item.season === season && item.episode === episode)) &&
            (fileId == null || item.fileId === fileId),
        );
        if (updated?.status === "failed") {
          throw new Error(updated.error || "The download failed.");
        }
        if (updated?.status === "completed" || updated?.status === "downloading") {
          Alert.alert("Download started", updated.status === "completed"
            ? "The file is downloaded and ready offline."
            : "The episode is now downloading. Check My Downloads for progress.");
        } else {
          Alert.alert(
            "Still preparing",
            "TorBox is still preparing this torrent. The app will check again automatically in My Downloads.",
          );
        }
      } catch (e: any) {
        Alert.alert("Download check failed", e?.message || "Could not check this download.");
      } finally {
        setBusy(false);
      }
      return;
    }

    // Downloading → show progress
    if (status === "downloading") {
      Alert.alert("Downloading…", `Progress: ${progress}%`);
      return;
    }

    // Otherwise: start fresh
    setBusy(true);
    try {
      // 15-second timeout so the spinner doesn't hang forever if the server stalls
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Server took too long. TorBox may be busy — try again in a minute.")), 15000)
      );
      await Promise.race([
        startDownload({
          hash, tmdbId, mediaType, quality, title, poster, season, episode, fileId, seasonPack,
        }),
        timeoutPromise,
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Download failed", e?.message || "Could not start download.");
    } finally {
      setBusy(false);
    }
  };

  // Disabled placeholder while hashes are still loading
  if (!hasHash) {
    return (
      <View
        style={{
          width: 52, height: 52, borderRadius: 12,
          flexShrink: 0,
          backgroundColor: "#F1F5F9",
          borderWidth: 1, borderColor: "#E2E8F0",
          alignItems: "center", justifyContent: "center",
          opacity: 0.6,
        }}
      >
        <Ionicons name="download-outline" size={22} color="#94A3B8" />
      </View>
    );
  }

  // Decide icon + color based on state
  let icon: keyof typeof Ionicons.glyphMap = "download-outline";
  let tint = "#0F172A";
  let bg = "#fff";
  let border = "#E2E8F0";

  if (busy) {
    icon = "download-outline";
  } else if (status === "completed") {
    icon = "checkmark-circle";
    tint = "#10B981";
    bg = "#ECFDF5";
    border = "#10B981";
  } else if (status === "queued") {
    icon = "time-outline";
    tint = "#F59E0B";
    bg = "#FFFBEB";
    border = "#F59E0B";
  } else if (status === "downloading") {
    icon = "cloud-download";
    tint = "#3B82F6";
    bg = "#EFF6FF";
    border = "#3B82F6";
  } else if (status === "failed") {
    icon = "alert-circle";
    tint = "#DC2626";
    bg = "#FEF2F2";
    border = "#DC2626";
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, backgroundColor: bg, borderWidth: 1, borderColor: border, alignItems: "center", justifyContent: "center", position: "relative", opacity: busy ? 0.7 : 1 }}
    >
      {busy ? (
        <ActivityIndicator color="#3B82F6" size="small" />
      ) : (
        <Ionicons name={icon} size={22} color={tint} />
      )}

      {/* Progress ring for downloads in flight */}
      {status === "downloading" ? (
        <View
          style={{
            position: "absolute", bottom: -6,
            backgroundColor: "#3B82F6",
            paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>{progress}%</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
