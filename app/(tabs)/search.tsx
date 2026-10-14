import { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { api, pickList, MediaItem } from "../../src/services/api";

const PLACEHOLDER = "https://via.placeholder.com/80x120?text=?";
const DEBOUNCE_MS = 350;
const RECENT_KEY = "movieflix:recentSearches";
const MAX_RECENT = 8;

type Filter = "all" | "movie" | "tv";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [recent, setRecent] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Load suggestions + recent searches once
  useEffect(() => {
    (async () => {
      try {
        const [trendRes, recentRaw] = await Promise.all([
          api.trending(),
          AsyncStorage.getItem(RECENT_KEY),
        ]);
        setSuggestions(pickList(trendRes).slice(0, 20));
        if (recentRaw) setRecent(JSON.parse(recentRaw));
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    })();
  }, []);

  // Save a search to recent (dedup, cap at MAX_RECENT)
  const rememberSearch = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    const updated = [trimmed, ...recent.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(updated);
    try {
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setBusy(false);
      return;
    }

    setBusy(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.search(query.trim());
        setResults(pickList(data));
      } catch {
        setResults([]);
      } finally {
        setBusy(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const clear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const runRecent = (q: string) => {
    Haptics.selectionAsync();
    setQuery(q);
  };

  const clearRecent = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setRecent([]);
    try {
      await AsyncStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  const openItem = (item: MediaItem) => {
    Haptics.selectionAsync();
    Keyboard.dismiss();
    // Persist this search when the user finds something
    if (query.trim()) rememberSearch(query);
    const isTV = item.type === "tv" || item.media_type === "tv";
    const id = item.tmdb_id ?? item.id;
    router.push(`/${isTV ? "tv" : "movie"}/${id}`);
  };

  // Filter results
  const filtered = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((r) => {
      const t = r.type || r.media_type || "movie";
      return t === filter;
    });
  }, [results, filter]);

  // Counts for filter chips
  const counts = useMemo(() => {
    let movies = 0, tv = 0;
    for (const r of results) {
      const t = r.type || r.media_type || "movie";
      if (t === "tv") tv++; else movies++;
    }
    return { all: results.length, movie: movies, tv };
  }, [results]);

  const showingSuggestions = !query.trim();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 56 }}>
      {/* Header + search bar */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#0F172A", letterSpacing: -0.4, marginBottom: 12 }}>
          Search
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            ref={inputRef}
            style={{ flex: 1, marginLeft: 10, color: "#0F172A", fontSize: 15, paddingVertical: 0 }}
            placeholder="Movies, series…"
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => rememberSearch(query)}
          />
          {query.length > 0 ? (
            <Pressable onPress={clear} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter chips (only when there are results) */}
        {!showingSuggestions && results.length > 0 ? (
          <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
            <FilterChip
              label={`All (${counts.all})`}
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <FilterChip
              label={`Movies (${counts.movie})`}
              active={filter === "movie"}
              onPress={() => setFilter("movie")}
            />
            <FilterChip
              label={`Series (${counts.tv})`}
              active={filter === "tv"}
              onPress={() => setFilter("tv")}
            />
          </View>
        ) : null}
      </View>

      {/* Body */}
      {showingSuggestions ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {recent.length > 0 ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 14 }}>Recent</Text>
                <Pressable onPress={clearRecent} hitSlop={8}>
                  <Text style={{ color: "#64748B", fontSize: 12 }}>Clear</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {recent.map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => runRecent(r)}
                    style={({ pressed }) => ({
                      flexDirection: "row", alignItems: "center", gap: 6,
                      backgroundColor: "#fff",
                      borderWidth: 1, borderColor: "#E2E8F0",
                      paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
                      opacity: pressed ? 0.75 : 1,
                    })}
                  >
                    <Ionicons name="time-outline" size={13} color="#94A3B8" />
                    <Text style={{ color: "#334155", fontSize: 13 }}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* Trending row */}
          <View style={{ paddingHorizontal: 16, paddingTop: recent.length > 0 ? 8 : 16, paddingBottom: 8 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 14, marginBottom: 8 }}>
              Trending Now
            </Text>
          </View>

          {loadingSuggestions ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <ActivityIndicator color="#3B82F6" />
            </View>
          ) : (
            <FlatList
              data={suggestions}
              horizontal
              keyExtractor={(item, i) => String(item.tmdb_id ?? item.id ?? i)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    const isTV = item.type === "tv" || item.media_type === "tv";
                    router.push(`/${isTV ? "tv" : "movie"}/${item.tmdb_id ?? item.id}`);
                  }}
                  style={({ pressed }) => ({ width: 120, opacity: pressed ? 0.85 : 1 })}
                >
                  <View style={{ aspectRatio: 2 / 3, borderRadius: 12, overflow: "hidden", backgroundColor: "#E2E8F0" }}>
                    <Image
                      source={{ uri: item.poster || item.poster_path || PLACEHOLDER }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                  <Text style={{ color: "#0F172A", fontSize: 12, fontWeight: "600", marginTop: 6 }} numberOfLines={1}>
                    {item.title || item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => String(item.tmdb_id ?? item.id ?? idx)}
          contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          renderItem={({ item }) => <ResultRow item={item} onPress={() => openItem(item)} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            !busy ? (
              <View style={{ paddingTop: 60, alignItems: "center", paddingHorizontal: 32 }}>
                <Ionicons name="search-outline" size={42} color="#CBD5E1" />
                <Text style={{ color: "#64748B", marginTop: 12, fontSize: 15, textAlign: "center" }}>
                  No results for "{query}"
                </Text>
                <Text style={{ color: "#94A3B8", marginTop: 6, fontSize: 13, textAlign: "center" }}>
                  Try a different title or check the spelling.
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            busy ? (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <ActivityIndicator color="#3B82F6" />
                <Text style={{ color: "#94A3B8", marginTop: 8, fontSize: 12 }}>Searching…</Text>
              </View>
            ) : (
              <Text style={{ color: "#64748B", fontSize: 12, fontWeight: "600", marginBottom: 8, letterSpacing: 0.3 }}>
                {filtered.length} RESULT{filtered.length === 1 ? "" : "S"}
              </Text>
            )
          }
        />
      )}
    </View>
  );
}

/* ---------- Filter chip ---------- */
function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => ({
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        backgroundColor: active ? "#3B82F6" : "#fff",
        borderWidth: 1.5,
        borderColor: active ? "#3B82F6" : "#E2E8F0",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text style={{ color: active ? "#fff" : "#334155", fontSize: 12, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Result row ---------- */
function ResultRow({ item, onPress }: { item: MediaItem; onPress: () => void }) {
  const isTV = item.type === "tv" || item.media_type === "tv";
  const title = item.title || item.name || "Untitled";
  const year = item.year || item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0];
  const rating = item.rating ?? item.vote_average;
  const poster = item.poster || item.poster_path || PLACEHOLDER;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View style={{ width: 60, height: 90, borderRadius: 8, overflow: "hidden", backgroundColor: "#E2E8F0" }}>
        <Image source={{ uri: poster }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={150} />
        {isTV ? (
          <View style={{ position: "absolute", top: 4, left: 4, backgroundColor: "#8B5CF6", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 }}>
            <Text style={{ color: "#fff", fontSize: 8, fontWeight: "800" }}>TV</Text>
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: "#0F172A", fontSize: 15, fontWeight: "700" }} numberOfLines={2}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 }}>
          {rating ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={{ color: "#475569", fontSize: 12, fontWeight: "600" }}>
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </Text>
            </View>
          ) : null}
          {year ? <Text style={{ color: "#64748B", fontSize: 12 }}>{year}</Text> : null}
        </View>
        {item.overview ? (
          <Text style={{ color: "#94A3B8", fontSize: 11, marginTop: 6, lineHeight: 15 }} numberOfLines={2}>
            {item.overview}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </Pressable>
  );
}
