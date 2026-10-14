import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import MovieCard from "./MovieCard";

type Movie = { tmdb_id?: number; id?: number; [k: string]: any };

const CARD_WIDTH = 130;
const GAP = 12;
const CARD_STRIDE = CARD_WIDTH + GAP;

export default function MovieRow({
  title,
  icon,
  movies = [],
  autoScroll = true,
  scrollInterval = 4500,
  categoryKey,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  movies?: Movie[];
  autoScroll?: boolean;
  scrollInterval?: number;
  categoryKey?: string; // route to /category/[key]
}) {
  const listRef = useRef<FlatList<Movie>>(null);
  const [index, setIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userPausedRef = useRef(false);

  const maxIndex = Math.max(0, movies.length - 1);

  const stepForward = useCallback(() => {
    setIndex((cur) => {
      if (cur >= maxIndex) {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
        return 0;
      }
      const next = cur + 1;
      listRef.current?.scrollToOffset({ offset: next * CARD_STRIDE, animated: true });
      return next;
    });
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoScrolling || movies.length <= 2) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (userPausedRef.current) return;
      stepForward();
    }, scrollInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoScrolling, movies.length, scrollInterval, stepForward]);

  const onScrollBeginDrag = () => {
    userPausedRef.current = true;
  };
  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / CARD_STRIDE);
    setIndex(Math.max(0, Math.min(newIndex, maxIndex)));
    setTimeout(() => {
      userPausedRef.current = false;
    }, 3000);
  };

  const toggleAuto = () => {
    Haptics.selectionAsync();
    setIsAutoScrolling((v) => !v);
  };

  const openCategory = () => {
    if (!categoryKey) return;
    Haptics.selectionAsync();
    router.push(`/category/${categoryKey}`);
  };

  if (!movies?.length) return null;

  return (
    <View style={{ marginBottom: 28 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon ? <Ionicons name={icon} size={18} color="#3B82F6" /> : null}
          <Text style={{ fontSize: 19, fontWeight: "700", color: "#0F172A", letterSpacing: -0.3 }}>
            {title}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {movies.length > 4 ? (
            <Pressable onPress={toggleAuto} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Ionicons
                name={isAutoScrolling ? "pause-circle-outline" : "play-circle-outline"}
                size={20}
                color="#94A3B8"
              />
            </Pressable>
          ) : null}

          {categoryKey ? (
            <Pressable
              onPress={openCategory}
              hitSlop={8}
              style={({ pressed }) => ({
                flexDirection: "row", alignItems: "center", gap: 2,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: "#3B82F6", fontSize: 13, fontWeight: "700" }}>View more</Text>
              <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        ref={listRef}
        horizontal
        data={movies}
        keyExtractor={(item, i) => String(item.tmdb_id ?? item.id ?? i)}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH, marginRight: GAP }}>
            <MovieCard movie={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        initialNumToRender={5}
        windowSize={5}
        snapToInterval={CARD_STRIDE}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({ length: CARD_STRIDE, offset: CARD_STRIDE * i, index: i })}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
      />

      {movies.length > 4 ? (
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 4, marginTop: 10 }}>
          {movies.slice(0, Math.min(movies.length, 12)).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index % 12 ? 16 : 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: i === index % 12 ? "#3B82F6" : "#CBD5E1",
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
