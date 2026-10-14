import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import {
  api,
  MediaType,
  QualityGroup,
  MovieHash,
  groupHashesByQuality,
} from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";
import TrailerPlayer from "../TrailerPlayer";
import DownloadButton from "../download/DownloadButton";

const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Poster";

function sortByScore(list: MovieHash[]): MovieHash[] {
  return [...list].sort((a, b) => {
    const aScore = (a.is_cached ? 1000 : 0) + (a.seeders || 0);
    const bScore = (b.is_cached ? 1000 : 0) + (b.seeders || 0);
    return bScore - aScore;
  });
}

export default function MediaDetail({ type = "movie" }: { type?: MediaType }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, getAuthHeaders } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const detail = useQuery({
    queryKey: ["detail", type, id],
    queryFn: () => api.detail(type, id),
    enabled: !!id,
  });

  const hashes = useQuery({
    queryKey: ["movie-hashes", id],
    queryFn: () => api.movieHashes(id!),
    enabled: !!id && type === "movie",
    retry: 0,
  });

  const similar = useQuery({
    queryKey: ["movie-similar", id],
    queryFn: () => api.movieSimilar(id!),
    enabled: !!id && type === "movie",
    retry: 0,
  });

  const videos = useQuery({
    queryKey: ["movie-videos", id],
    queryFn: () => api.movieVideos(id!),
    enabled: !!id && type === "movie",
    retry: 0,
  });

  const wlQuery = useQuery({
    queryKey: ["check-watchlist", id, currentUser?.id],
    queryFn: async () => {
      const res = await api.getWatchlist(getAuthHeaders());
      return (res?.watchlist || []).some((it: any) => String(it.content_id) === String(id));
    },
    enabled: !!currentUser && !!id,
    staleTime: 0,
  });

  const fvQuery = useQuery({
    queryKey: ["check-favorites", id, currentUser?.id],
    queryFn: async () => {
      const res = await api.getFavorites(getAuthHeaders());
      return (res?.favorites || []).some((it: any) => String(it.content_id) === String(id));
    },
    enabled: !!currentUser && !!id,
    staleTime: 0,
  });

  const inWatchlist = !!wlQuery.data;
  const inFavorites = !!fvQuery.data;

  const item = detail.data as any;

  const qualityGroups: QualityGroup[] = useMemo(
    () => groupHashesByQuality(hashes.data || []),
    [hashes.data],
  );

  const bestGroup = useMemo(
    () => qualityGroups.find((g) => g.playableHashes > 0) || qualityGroups[0],
    [qualityGroups],
  );

  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const activeQuality = selectedQuality || bestGroup?.quality || null;

  const trailer = useMemo(() => {
    const list = videos.data?.videos || [];
    return (
      list.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
      list.find((v: any) => v.site === "YouTube") ||
      null
    );
  }, [videos.data]);

  const openPlayer = (hash?: MovieHash, quality?: string) => {
    Haptics.selectionAsync();
    const q = quality || activeQuality || "1080p";
    const hashParam = hash ? `&hash=${hash.hash}` : "";
    router.push(`/watch/${id}?type=movie&quality=${q}${hashParam}`);
  };

  const openTrailer = () => {
    if (!trailer?.key) return;
    Haptics.selectionAsync();
    setTrailerOpen(true);
  };

  const toggleWatchlist = async () => {
    if (!currentUser) { router.push("/(auth)/login"); return; }
    Haptics.selectionAsync();
    try {
      if (inWatchlist) {
        await api.removeFromWatchlist(Number(id), type, getAuthHeaders());
      } else {
        await api.addToWatchlist(Number(id), type, getAuthHeaders());
      }
      wlQuery.refetch();
    } catch (e) {
      console.warn("watchlist failed", e);
    }
  };

  const toggleFavorites = async () => {
    if (!currentUser) { router.push("/(auth)/login"); return; }
    Haptics.selectionAsync();
    try {
      if (inFavorites) {
        await api.removeFromFavorites(Number(id), type, getAuthHeaders());
      } else {
        await api.addToFavorites(Number(id), type, getAuthHeaders());
      }
      fvQuery.refetch();
    } catch (e) {
      console.warn("favorites failed", e);
    }
  };

  if (detail.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}>
        <Text style={{ color: "#64748B" }}>Movie not found</Text>
      </View>
    );
  }

  const title = item.title || item.name || "Untitled";
  const backdrop = item.backdrop || item.backdrop_path || item.poster || item.poster_path;
  const poster = item.poster || item.poster_path || PLACEHOLDER;
  const year = item.year || item.release_date?.split("-")[0] || "N/A";
  const rating = item.rating ?? item.vote_average ?? 0;
  const runtime = item.runtime;
  const genres = (item.genres || []).map((g: any) => (typeof g === "string" ? g : g.name)).filter(Boolean);

  const activeGroup = qualityGroups.find((g) => g.quality === activeQuality);
  const activeSorted = activeGroup ? sortByScore(activeGroup.hashes) : [];
  const activeTotalSize = activeSorted.reduce((sum, h) => sum + (h.size_mb || 0), 0);

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Backdrop */}
        <View style={{ height: 340 }}>
          {backdrop ? (
            <Image source={{ uri: backdrop }} style={{ width: "100%", height: "100%", opacity: 0.6 }} contentFit="cover" transition={300} />
          ) : null}
          <LinearGradient
            colors={["rgba(15,23,42,0.4)", "rgba(15,23,42,0.85)", "#F8FAFC"]}
            locations={[0, 0.6, 1]}
            style={{ position: "absolute", inset: 0 }}
          />
          <Pressable
            onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/"))}
            style={{
              position: "absolute", top: 48, left: 16,
              width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          {trailer?.key ? (
            <Pressable
              onPress={openTrailer}
              style={{
                position: "absolute", bottom: 120, right: 24,
                flexDirection: "row", alignItems: "center", gap: 6,
                backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
              }}
            >
              <Ionicons name="play-circle" size={20} color="#EF4444" />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Trailer</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Poster + title */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, marginTop: -140 }}>
          <Image source={{ uri: poster }} style={{ width: 120, height: 180, borderRadius: 12, backgroundColor: "#E2E8F0" }} contentFit="cover" transition={200} />
          <View style={{ flex: 1, marginLeft: 16, paddingTop: 70 }}>
            <Text style={{ color: "#0F172A", fontSize: 22, fontWeight: "800", lineHeight: 28 }} numberOfLines={3}>
              {title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 14 }}>
              {rating ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={14} color="#FACC15" />
                  <Text style={{ color: "#0F172A", marginLeft: 4, fontWeight: "600" }}>
                    {typeof rating === "number" ? rating.toFixed(1) : rating}
                  </Text>
                </View>
              ) : null}
              <Text style={{ color: "#64748B" }}>{year}</Text>
              {runtime ? <Text style={{ color: "#64748B" }}>{runtime} min</Text> : null}
            </View>
          </View>
        </View>

        {/* Genres */}
        {genres.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginTop: 20 }}>
            {genres.map((g: string, i: number) => (
              <View key={i} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ color: "#334155", fontSize: 12, fontWeight: "600" }}>{g}</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}

        {/* Actions */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, marginTop: 22 }}>
          <Pressable
            onPress={() => openPlayer()}
            disabled={!activeQuality}
            style={({ pressed }) => ({
              flex: 1,
              marginRight: 8,
              backgroundColor: activeQuality ? "#3B82F6" : "#94A3B8",
              borderRadius: 12, paddingVertical: 14,
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Watch Now</Text>
          </Pressable>

          <Pressable onPress={toggleWatchlist} style={({ pressed }) => ({
            width: 52, height: 52, borderRadius: 12, marginRight: 8,
            backgroundColor: inWatchlist ? "#DBEAFE" : "#fff",
            borderWidth: 1, borderColor: inWatchlist ? "#3B82F6" : "#E2E8F0",
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}>
            <Ionicons
              name={inWatchlist ? "bookmark" : "bookmark-outline"}
              size={22}
              color={inWatchlist ? "#3B82F6" : "#0F172A"}
            />
          </Pressable>

          <Pressable onPress={toggleFavorites} style={({ pressed }) => ({
            width: 52, height: 52, borderRadius: 12,
            backgroundColor: inFavorites ? "#FCE7F3" : "#fff",
            borderWidth: 1, borderColor: inFavorites ? "#EC4899" : "#E2E8F0",
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}>
            <Ionicons
              name={inFavorites ? "heart" : "heart-outline"}
              size={22}
              color={inFavorites ? "#EC4899" : "#0F172A"}
            />
          </Pressable>
        </View>

        {/* Overview */}
        <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17, marginBottom: 10 }}>Overview</Text>
          <Text style={{ color: "#334155", lineHeight: 22, fontSize: 14 }}>
            {item.overview || "No overview available."}
          </Text>
        </View>

        {/* Sources */}
        <View style={{ paddingHorizontal: 16, marginTop: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17 }}>Available Sources</Text>
            {hashes.isLoading ? <ActivityIndicator color="#3B82F6" size="small" /> : null}
          </View>

          {qualityGroups.length === 0 && !hashes.isLoading ? (
            <View style={{ padding: 20, borderRadius: 14, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center" }}>
              <Ionicons name="cloud-offline-outline" size={32} color="#94A3B8" />
              <Text style={{ color: "#64748B", marginTop: 8, fontSize: 13, textAlign: "center" }}>No sources indexed yet.</Text>
            </View>
          ) : (
            <>
              {/* Horizontal quality chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 8, paddingBottom: 4 }}
                style={{ marginBottom: 16 }}
              >
                {qualityGroups.map((g) => {
                  const isActive = activeQuality === g.quality;
                  return (
                    <Pressable
                      key={g.quality}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedQuality(g.quality);
                      }}
                      style={({ pressed }) => ({
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: isActive ? "#3B82F6" : "#fff",
                        borderWidth: 1.5,
                        borderColor: isActive ? "#3B82F6" : "#E2E8F0",
                        opacity: pressed ? 0.8 : 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      })}
                    >
                      <Text style={{ color: isActive ? "#fff" : "#334155", fontWeight: "800", fontSize: 13 }}>
                        {g.quality.toUpperCase()}
                      </Text>
                      <View style={{
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 6,
                        backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                      }}>
                        <Text style={{ color: isActive ? "#fff" : "#64748B", fontSize: 10, fontWeight: "800" }}>
                          {g.hashes.length}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Sources for active quality */}
              {activeGroup ? (
                <View>
                  <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 0.3, marginBottom: 10 }}>
                    {activeGroup.quality.toUpperCase()} · {activeSorted.length} SOURCE{activeSorted.length > 1 ? "S" : ""} · {Math.round(activeTotalSize)} MB
                  </Text>
                  {activeSorted.map((h, i) => (
                    <SourceRow
                      key={h.hash || i}
                      hash={h}
                      isBest={i === 0}
                      onPlay={() => openPlayer(h, activeGroup.quality)}
                      movieTitle={title}
                      moviePoster={poster}
                      tmdbId={Number(id)}
                      mediaType="movie"
                      quality={activeGroup.quality}
                    />
                  ))}
                </View>
              ) : (
                <View style={{ padding: 20, borderRadius: 14, backgroundColor: "#F8FAFC", alignItems: "center" }}>
                  <Text style={{ color: "#64748B", fontSize: 13 }}>Pick a quality above</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Similar */}
        {similar.data?.results && similar.data.results.length > 0 ? (
          <View style={{ marginTop: 32 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17, paddingHorizontal: 16, marginBottom: 12 }}>Similar Movies</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {similar.data.results.slice(0, 12).map((s: any) => {
                const sid = s.tmdb_id ?? s.id;
                const sposter = s.poster || s.poster_path || PLACEHOLDER;
                return (
                  <Pressable
                    key={String(sid)}
                    onPress={() => { Haptics.selectionAsync(); router.push(`/movie/${sid}`); }}
                    style={({ pressed }) => ({ width: 110, opacity: pressed ? 0.75 : 1 })}
                  >
                    <Image source={{ uri: sposter }} style={{ width: 110, aspectRatio: 2 / 3, borderRadius: 10, backgroundColor: "#E2E8F0" }} contentFit="cover" transition={150} />
                    <Text style={{ color: "#0F172A", fontSize: 12, fontWeight: "600", marginTop: 6 }} numberOfLines={1}>
                      {s.title || s.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <TrailerPlayer
        visible={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoId={trailer?.key ?? null}
        title={trailer?.name}
        movieTitle={title}
      />
    </>
  );
}

/* ---------- SourceRow ---------- */
function SourceRow({
  hash: h,
  isBest,
  onPlay,
  movieTitle,
  moviePoster,
  tmdbId,
  mediaType,
  quality,
}: {
  hash: MovieHash;
  isBest: boolean;
  onPlay: () => void;
  movieTitle: string;
  moviePoster: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  quality: string;
}) {
  const seeders = h.seeders || 0;
  const cached = h.is_cached === 1;
  const sizeMb = Math.round(h.size_mb || 0);
  const shortHash = h.hash ? h.hash.slice(0, 16) + "…" : "unknown";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: isBest ? "#3B82F6" : "#E2E8F0",
      }}
    >
      <View style={{ flex: 1, marginRight: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
          {cached ? (
            <View style={{ backgroundColor: "#DBEAFE", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ color: "#1D4ED8", fontSize: 9, fontWeight: "800" }}>CACHED</Text>
            </View>
          ) : null}
          {seeders > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="people" size={11} color="#10B981" />
              <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "700" }}>{seeders}</Text>
            </View>
          ) : (
            <Text style={{ color: "#94A3B8", fontSize: 10, fontWeight: "700" }}>0 SEEDERS</Text>
          )}
          {isBest ? (
            <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ color: "#B45309", fontSize: 9, fontWeight: "800" }}>BEST</Text>
            </View>
          ) : null}
        </View>
        <Text style={{ color: "#64748B", fontSize: 11 }} numberOfLines={1}>
          {shortHash}{sizeMb ? ` · ${sizeMb} MB` : ""}
        </Text>
      </View>

      <Pressable
        onPress={onPlay}
        style={({ pressed }) => ({
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: "#3B82F6",
          alignItems: "center", justifyContent: "center",
          marginRight: 8,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Ionicons name="play" size={16} color="#fff" />
      </Pressable>

      <DownloadButton
        hash={h.hash}
        tmdbId={tmdbId}
        mediaType={mediaType}
        quality={quality}
        title={movieTitle}
        poster={moviePoster}
      />
    </View>
  );
}
