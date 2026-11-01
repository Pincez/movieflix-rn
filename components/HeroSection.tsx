import { useEffect, useRef } from "react";
import { View, Text, Pressable, useWindowDimensions, Animated, Easing } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function HeroSection({ movie }: { movie: any }) {
  const { height, width } = useWindowDimensions();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide, movie?.tmdb_id]);

  if (!movie) return null;

  const backdrop = movie.backdrop || movie.backdrop_path || movie.poster || movie.poster_path;
  const isTV = movie.type === "tv" || movie.media_type === "tv";
  const id = movie.tmdb_id ?? movie.id;
  const title = movie.title || movie.name || "Untitled";
  const year = movie.year || movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0];
  const rating = movie.rating ?? movie.vote_average;

  const open = () => {
    Haptics.selectionAsync();
    router.push(`/${isTV ? "tv" : "movie"}/${id}`);
  };

  return (
    <View style={{ height: height * 0.72, width, backgroundColor: "#0F172A" }}>
      {backdrop ? (
        <Image
          source={{ uri: backdrop }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          contentFit="cover"
          transition={400}
        />
      ) : null}

      {/* Gradient overlays */}
      <LinearGradient
        colors={["rgba(15,23,42,0.25)", "rgba(15,23,42,0.55)", "rgba(15,23,42,0.95)"]}
        locations={[0, 0.55, 1]}
        style={{ position: "absolute", inset: 0 }}
      />
      <LinearGradient
        colors={["transparent", "#F8FAFC"]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140 }}
      />

      {/* Content */}
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: slide }],
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 50,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {rating ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="star" size={13} color="#FACC15" />
              <Text style={{ color: "#F8FAFC", marginLeft: 4, fontSize: 13, fontWeight: "600" }}>
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </Text>
            </View>
          ) : null}
          {year ? <Text style={{ color: "#CBD5E1", fontSize: 13 }}>{year}</Text> : null}
          <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: "#3B82F6" }}>
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
              {isTV ? "TV SERIES" : "MOVIE"}
            </Text>
          </View>
        </View>

        <Text
          style={{ color: "#F8FAFC", fontSize: 34, fontWeight: "800", letterSpacing: -0.6, lineHeight: 40, marginBottom: 10 }}
          numberOfLines={2}
        >
          {title}
        </Text>

        {movie.overview ? (
          <Text
            style={{ color: "rgba(226,232,240,0.85)", fontSize: 14, lineHeight: 20, marginBottom: 18 }}
            numberOfLines={3}
          >
            {movie.overview}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={open}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: "#3B82F6",
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Watch Now</Text>
          </Pressable>
          <Pressable
            onPress={open}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
          >
            <Ionicons name="information-circle-outline" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Details</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
