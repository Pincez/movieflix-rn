import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";

const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Poster";

type Movie = {
  tmdb_id?: number; id?: number;
  poster?: string; poster_path?: string;
  title?: string; name?: string;
  year?: number | string; first_air_date?: string; release_date?: string;
  rating?: number; vote_average?: number;
  type?: "movie" | "tv"; media_type?: "movie" | "tv";
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = imgError ? PLACEHOLDER : movie.poster || movie.poster_path || PLACEHOLDER;
  const title = movie.title || movie.name || "Untitled";
  const year = movie.year || movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0] || "N/A";
  const rating = movie.rating ?? movie.vote_average ?? 0;
  const isTV = movie.type === "tv" || movie.media_type === "tv";
  const id = movie.tmdb_id ?? movie.id;

  const onPress = () => {
    Haptics.selectionAsync();
    router.push(`/${isTV ? "tv" : "movie"}/${id}`);
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <View
        style={{
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "#E2E8F0",
          aspectRatio: 2 / 3,
          shadowColor: "#0F172A",
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Image
          source={{ uri: posterUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
          onError={() => setImgError(true)}
        />

        {/* Rating chip - bottom left */}
        {rating ? (
          <View
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
              paddingHorizontal: 6,
              paddingVertical: 3,
              borderRadius: 6,
              gap: 3,
            }}
          >
            <Ionicons name="star" size={10} color="#FACC15" />
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </Text>
          </View>
        ) : null}

        {/* TV badge - top left */}
        {isTV ? (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#8B5CF6",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700", letterSpacing: 0.5 }}>TV</Text>
          </View>
        ) : null}
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ color: "#0F172A", fontSize: 13, fontWeight: "600" }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{year}</Text>
      </View>
    </Pressable>
  );
}
