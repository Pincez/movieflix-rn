import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import {
  useDownloadsStore,
  loadAllDownloads,
  deleteDownload,
  exportDownload,
  resumeQueuedDownloads,
  cancelDownload,
  type DownloadItem,
} from "../src/services/downloads";

const H_PADDING = 16;
const GAP = 12;
const COLS = 2;
const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Poster";

export default function DownloadsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

  const { items, setItems } = useDownloadsStore();
  const [loading, setLoading] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [queueError, setQueueError] = useState<string | null>(null);
  const queuedCount = items.filter((x) => x.status === "queued").length;
  const [totalSize, setTotalSize] = useState(0);

  const refresh = useCallback(async () => {
    const list = await loadAllDownloads();
    setItems(list);
  }, [setItems]);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.sizeMb || 0), 0);
    setTotalSize(total);
  }, [items]);

  useEffect(() => {
    if (loading || queuedCount === 0) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        await resumeQueuedDownloads();
        await refresh();
        if (!cancelled) setQueueError(null);
      } catch (e: any) {
        if (!cancelled) {
          setQueueError(e?.message || "Could not check queued downloads.");
        }
      }
      if (!cancelled) timer = setTimeout(poll, 15_000);
    };

    timer = setTimeout(poll, 2_000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [loading, queuedCount, refresh]);

  const handleResume = async () => {
    setResuming(true);
    try {
      await resumeQueuedDownloads();
      await refresh();
      setQueueError(null);
    } catch (e: any) {
      setQueueError(e?.message || "Could not resume downloads. Please try again.");
    } finally {
      setResuming(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear all downloads?",
      "This will delete every downloaded file from your device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            for (const item of items) {
              await deleteDownload(item.id);
            }
            await refresh();
          },
        },
      ],
    );
  };

  const handleDelete = (item: DownloadItem) => {
    if (item.status === "completed") {
      Alert.alert(
        "Delete download?",
        `"" will be removed from your device.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteDownload(item.id);
              await refresh();
            },
          },
        ],
      );
      return;
    }
    if (item.status === "downloading") {
      (async () => {
        await cancelDownload(item.id);
        await refresh();
      })();
      return;
    }
    (async () => {
      await deleteDownload(item.id);
      await refresh();
    })();
  };

  const handleExport = async (item: DownloadItem) => {
    Haptics.selectionAsync();
    try {
      await exportDownload(item.id);
    } catch (e: any) {
      Alert.alert("Export failed", e?.message || "Could not export this file.");
    }
  };

  const handlePlay = (item: DownloadItem) => {
    Haptics.selectionAsync();
    if (item.mediaType === "tv") {
      router.push(
        `/watch/${item.tmdbId}?type=tv&season=${item.season ?? 1}&episode=${item.episode ?? 1}&localId=${encodeURIComponent(item.id)}`,
      );
    } else {
      router.push(`/watch/${item.tmdbId}?type=movie&localId=${encodeURIComponent(item.id)}`);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 56 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: H_PADDING, marginBottom: 16 }}>
        <Pressable
          onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/profile"))}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A", marginLeft: 12 }}>
            My Downloads
          </Text>
          {items.length > 0 && (
            <Text style={{ fontSize: 11, color: "#64748B", marginLeft: 12, marginTop: 2 }}>
              {totalSize.toFixed(0)} MB used · {items.length} file{items.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {items.length > 0 ? (
          <Pressable
            onPress={handleClearAll}
            android_ripple={{ color: "rgba(220,38,38,0.1)" }}
            style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              backgroundColor: "#FEF2F2", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Ionicons name="trash-outline" size={14} color="#DC2626" />
            <Text style={{ color: "#DC2626", fontWeight: "700", fontSize: 12 }}>
              Clear All
            </Text>
          </Pressable>
        ) : null}

        {queuedCount > 0 ? (
          <Pressable
            onPress={handleResume}
            disabled={resuming}
            style={{
              flexDirection: "row", alignItems: "center", gap: 4,
              backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
            }}
          >
            {resuming ? <ActivityIndicator color="#3B82F6" size="small" /> : <Ionicons name="refresh" size={14} color="#3B82F6" />}
            <Text style={{ color: "#3B82F6", fontWeight: "700", fontSize: 12 }}>
              {queuedCount} queued
            </Text>
          </Pressable>
        ) : null}
      </View>

      {queueError ? (
        <Text style={{ color: "#DC2626", fontSize: 12, marginHorizontal: H_PADDING, marginBottom: 12 }}>
          {queueError}
        </Text>
      ) : null}

      {items.length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 60, paddingHorizontal: 24 }}>
          <Ionicons name="cloud-download-outline" size={56} color="#CBD5E1" />
          <Text style={{ color: "#0F172A", marginTop: 16, fontWeight: "700", fontSize: 16 }}>
            No downloads yet
          </Text>
          <Text style={{ color: "#94A3B8", marginTop: 6, fontSize: 13, textAlign: "center" }}>
            Download any movie or TV episode to watch offline.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          numColumns={COLS}
          columnWrapperStyle={{ paddingHorizontal: H_PADDING, gap: GAP }}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => (
            <DownloadCard
              item={item}
              width={cardWidth}
              onPlay={() => handlePlay(item)}
              onDelete={() => handleDelete(item)}
              onExport={() => handleExport(item)}
            />
          )}
        />
      )}
    </View>
  );
}

function DownloadCard({
  item,
  width,
  onPlay,
  onDelete,
  onExport,
}: {
  item: DownloadItem;
  width: number;
  onPlay: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  const isCompleted = item.status === "completed";
  const isQueued = item.status === "queued";
  const isDownloading = item.status === "downloading";
  const isFailed = item.status === "failed";

  return (
    <View style={{ width }}>
      <Pressable onPress={isCompleted ? onPlay : undefined} disabled={!isCompleted}>
        <View
          style={{
            aspectRatio: 2 / 3,
            borderRadius: 14,
            overflow: "hidden",
            backgroundColor: "#E2E8F0",
          }}
        >
          <Image
            source={{ uri: item.poster || PLACEHOLDER }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={150}
          />

          {/* Status badges */}
          {isCompleted ? (
            <View
              style={{
                position: "absolute", top: 8, right: 8,
                backgroundColor: "rgba(16,185,129,0.9)",
                paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
                flexDirection: "row", alignItems: "center", gap: 3,
              }}
            >
              <Ionicons name="checkmark-circle" size={12} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>SAVED</Text>
            </View>
          ) : null}

          {isQueued ? (
            <View
              style={{
                position: "absolute", inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <ActivityIndicator color="#F59E0B" />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700", marginTop: 8 }}>Queued</Text>
              <Text style={{ color: "#CBD5E1", fontSize: 10, marginTop: 4 }}>Tap refresh above</Text>
            </View>
          ) : null}

          {isDownloading ? (
            <View
              style={{
                position: "absolute", inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{item.progress}%</Text>
            </View>
          ) : null}

          {isFailed ? (
            <View
              style={{
                position: "absolute", inset: 0,
                backgroundColor: "rgba(220,38,38,0.7)",
                alignItems: "center", justifyContent: "center",
                padding: 8,
              }}
            >
              <Ionicons name="alert-circle" size={22} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 10, textAlign: "center", marginTop: 4 }} numberOfLines={3}>
                {item.error || "Failed"}
              </Text>
            </View>
          ) : null}

          {/* Play overlay */}
          {isCompleted ? (
            <View
              style={{
                position: "absolute", bottom: 8, right: 8,
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: "#3B82F6",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={16} color="#fff" />
            </View>
          ) : null}
        </View>

        <Text style={{ color: "#0F172A", fontSize: 13, fontWeight: "700", marginTop: 8 }} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, gap: 6 }}>
          <Text style={{ color: "#64748B", fontSize: 11 }}>{item.quality}</Text>
          <Text style={{ color: "#94A3B8", fontSize: 11 }}>•</Text>
          <Text style={{ color: "#64748B", fontSize: 11 }}>{item.sizeMb} MB</Text>
        </View>
      </Pressable>

      {isCompleted ? (
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Pressable
            onPress={onExport}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#EFF6FF", paddingVertical: 8, borderRadius: 8,
              marginRight: 6 }}
          >
            <Ionicons name="share-outline" size={14} color="#3B82F6" />
            <Text style={{ color: "#3B82F6", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
              Export
            </Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ width: 36, height: 36, borderRadius: 8,
              backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </Pressable>
        </View>
      ) : null}

      {isFailed || isQueued || isDownloading ? (
        <Pressable
          onPress={onDelete}
          android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center",
            marginTop: 8, paddingVertical: 8, borderRadius: 8,
            backgroundColor: "#FEF2F2" }}
        >
          <Ionicons name="trash-outline" size={14} color="#DC2626" />
          <Text style={{ color: "#DC2626", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
            {isQueued ? "Cancel" : "Remove"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
