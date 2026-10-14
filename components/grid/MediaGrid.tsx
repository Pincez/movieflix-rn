import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Animated, useWindowDimensions, type ListRenderItemInfo, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "../MovieCard";
import { pickList, MediaItem } from "../../src/services/api";

const H_PADDING = 12;
const GAP = 10;
const COLUMNS = 3;
const MAX_PAGES = 40; // safety cap

type FetchPage = (page: number, tmdbStart?: number | null) => Promise<any>;

type MediaGridProps = {
  fetchPage: FetchPage;
  queryKey: string;
  emptyText?: string;
  columns?: number;
  cardAspectRatio?: number;
};

function MediaGridInner({ fetchPage, queryKey, emptyText = "Nothing found", columns = 3, cardAspectRatio = 2 / 3 }: MediaGridProps) {
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadingRef = useRef(false);
  const onEndReachedRef = useRef(false);
  const nextTmdbPageRef = useRef<number | null>(null);
  const seenIdsRef = useRef(new Set<string>());

  const cardWidth = (width - H_PADDING * 2 - GAP * (columns - 1)) / columns;

  const load = useCallback(
    async (p: number, replace = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        if (p === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const data = await fetchPage(p, nextTmdbPageRef.current);
        const raw = pickList(data);
        const list = raw.map((item: any) => ({
          ...item,
          id: item.tmdb_id ?? item.id,
          tmdb_id: item.tmdb_id ?? item.id,
          title: item.title || item.name || item.original_name || item.original_title,
          type: item.type ?? item.media_type ?? (queryKey === "tv" ? "tv" : "movie"),
        }));

        console.log(
          `[MediaGrid:${queryKey}] page=${p} items=${list.length} total_pages=${data?.total_pages ?? "none"} total_results=${data?.total_results ?? "none"}`,
        );

        // Dedupe against what we already have
        let newOnes = list;
        if (p > 1) {
          newOnes = list.filter((item: any) => {
            const key = String(item.tmdb_id ?? item.id);
            if (seenIdsRef.current.has(key)) return false;
            seenIdsRef.current.add(key);
            return true;
          });
        } else {
          seenIdsRef.current = new Set();
          list.forEach((item: any) => seenIdsRef.current.add(String(item.tmdb_id ?? item.id)));
        }

        // Decide whether we have more.
        // The backend often sends total_pages: 1 as a placeholder even when
        // more pages exist. So only trust total_pages when it's greater than 1.
        const apiTotal = data?.total_pages ?? data?.totalPages ?? null;
        let stillMore: boolean;
        if (typeof apiTotal === "number" && apiTotal > 1) {
          stillMore = p < apiTotal;
        } else {
          // Fallback: keep going while pages are full and yield fresh items
          stillMore = list.length >= 15 && newOnes.length > 0 && p < MAX_PAGES;
        }

        setHasMore(stillMore);
        setItems((prev) => (replace || p === 1 ? list : [...prev, ...newOnes]));
        setPage(p);
      } catch (e: any) {
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        loadingRef.current = false;
      }
    },
    [fetchPage, queryKey],
  );

  useEffect(() => {
    load(1, true);
  }, [load]);

  const handleEndReached = useCallback(() => {
    if (loadingRef.current) return;
    if (!hasMore) return;
    if (onEndReachedRef.current) return;
    onEndReachedRef.current = true;
    load(page + 1).finally(() => {
      onEndReachedRef.current = false;
    });
  }, [load, page, hasMore]);

  const onRefresh = useCallback(() => {
    // reset TMDB cursor so refresh starts truly from scratch
    nextTmdbPageRef.current = null;
    setRefreshing(true);
    setHasMore(true);
    setItems([]);
    seenIdsRef.current = new Set();
    load(1, true);
  }, [load]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<MediaItem>) => {
      const isLastInRow = (index + 1) % columns === 0;
      return (
        <View style={{ width: cardWidth, marginRight: isLastInRow ? 0 : GAP }}>
          <AnimatedCard item={item} index={index} />
        </View>
      );
    },
    [cardWidth, columns],
  );

  const keyExtractor = useCallback(
    (item: any, i: number) => String(item.tmdb_id ?? item.id ?? i),
    [],
  );

  const ItemSeparator = useCallback(() => <View style={{ height: GAP }} />, []);

  if (loading && items.length === 0) {
    return (
      <View style={{ paddingHorizontal: H_PADDING, flexDirection: "row", flexWrap: "wrap" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} width={cardWidth} />
        ))}
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={{ paddingHorizontal: 24, paddingTop: 60, alignItems: "center" }}>
        <Ionicons name="cloud-offline-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: "#64748B", marginTop: 12, textAlign: "center" }}>{error}</Text>
        <Pressable
          onPress={() => load(1, true)}
          style={({ pressed }) => ({
            marginTop: 16,
            backgroundColor: "#3B82F6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={{ paddingHorizontal: 24, paddingTop: 60, alignItems: "center" }}>
        <Ionicons name="film-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: "#64748B", marginTop: 12 }}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={columns}
      columnWrapperStyle={{ paddingHorizontal: H_PADDING }}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={{ paddingBottom: 40 }}
      onEndReached={handleEndReached}
      // MEMO_APPEND_SAFETY — prevents visible flash on Android
      onEndReachedThreshold={0.8}
      onRefresh={onRefresh}
      refreshing={refreshing}
      removeClippedSubviews={Platform.OS === 'android'}
      initialNumToRender={12}
      maxToRenderPerBatch={9}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      ListFooterComponent={
        loadingMore ? (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <ActivityIndicator color="#3B82F6" />
            <Text style={{ color: "#94A3B8", fontSize: 12, marginTop: 6 }}>Loading more…</Text>
          </View>
        ) : !hasMore && items.length > 12 ? (
          <Text style={{ textAlign: "center", color: "#94A3B8", fontSize: 12, paddingVertical: 20 }}>
            You've reached the end
          </Text>
        ) : null
      }
    />
  );
}

const AnimatedCard = memo(function AnimatedCard({ item, index }: { item: MediaItem; index: number }) {
  // Animate ONCE on mount, never re-animate when index changes
  const animatedRef = useRef(false);
  const shouldAnimate = !animatedRef.current && index < 9;
  const opacity = useRef(new Animated.Value(shouldAnimate ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(shouldAnimate ? 20 : 0)).current;

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    if (!shouldAnimate) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 240, delay: Math.min(index, 6) * 25, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 240, delay: Math.min(index, 6) * 25, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, index, shouldAnimate]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <MovieCard movie={item} />
    </Animated.View>
  );
});

const SkeletonCard = memo(function SkeletonCard({ width }: { width: number }) {
  return (
    <View style={{ width, marginRight: GAP, marginBottom: GAP }}>
      <View style={{ aspectRatio: 2 / 3, backgroundColor: "#E2E8F0", borderRadius: 14 }} />
      <View style={{ height: 12, marginTop: 8, borderRadius: 4, backgroundColor: "#E2E8F0", width: "80%" }} />
      <View style={{ height: 10, marginTop: 4, borderRadius: 4, backgroundColor: "#F1F5F9", width: "50%" }} />
    </View>
  );
});

export default memo(MediaGridInner);
