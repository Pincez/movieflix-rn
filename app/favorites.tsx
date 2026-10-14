import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList, ActivityIndicator, Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { api, hydrateListItems, MediaItem } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";

const H_PADDING = 12;
const GAP = 10;
const COLS = 3;
const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Poster";

export default function FavoritesScreen() {
  const { currentUser, getAuthHeaders } = useAuth();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

  const q = useQuery({
    queryKey: ["favorites", currentUser?.id],
    queryFn: async () => {
      const res = await api.getFavorites(getAuthHeaders());
      const items = res?.favorites || [];
      if (items.length === 0) return [];
      return hydrateListItems(items);
    },
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Ionicons name="lock-closed-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: "#64748B", marginTop: 12, textAlign: "center" }}>Log in to see your favorites</Text>
        <Pressable onPress={() => router.push("/(auth)/login")} style={{ marginTop: 16, backgroundColor: "#3B82F6", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Log In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 56 }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 }}>
        <Pressable onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/profile"))} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A", marginLeft: 12 }}>Favorites</Text>
      </View>

      {q.isLoading ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator color="#EC4899" />
          <Text style={{ color: "#94A3B8", marginTop: 8, fontSize: 12 }}>Loading favorites…</Text>
        </View>
      ) : (q.data || []).length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <Ionicons name="heart-outline" size={48} color="#CBD5E1" />
          <Text style={{ color: "#64748B", marginTop: 12 }}>No favorites yet</Text>
          <Text style={{ color: "#94A3B8", marginTop: 4, fontSize: 12 }}>Tap the heart on any title to add it</Text>
        </View>
      ) : (
        <FlatList
          data={q.data}
          keyExtractor={(item: any, i) => String(item.tmdb_id ?? item.id ?? i)}
          numColumns={COLS}
          columnWrapperStyle={{ paddingHorizontal: H_PADDING, gap: GAP }}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => (
            <Card item={item} width={cardWidth} />
          )}
        />
      )}
    </View>
  );
}

function Card({ item, width }: { item: MediaItem; width: number }) {
  const isTV = item.type === "tv" || item.media_type === "tv";
  const id = item.tmdb_id ?? item.id;
  const title = item.title || item.name || "Untitled";
  const poster = item.poster || item.poster_path || PLACEHOLDER;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        router.push(`/${isTV ? "tv" : "movie"}/${id}`);
      }}
      style={({ pressed }) => ({ width, opacity: pressed ? 0.85 : 1 })}
    >
      <View style={{ aspectRatio: 2 / 3, borderRadius: 14, overflow: "hidden", backgroundColor: "#E2E8F0" }}>
        <Image source={{ uri: poster }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={150} />
      </View>
      <Text style={{ color: "#0F172A", fontWeight: "600", fontSize: 13, marginTop: 8 }} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}
