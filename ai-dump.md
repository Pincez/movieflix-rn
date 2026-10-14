# PROJECT DUMP: movieflix-rn
# Generated: Mon, Oct  5, 2026  3:12:17 AM

## FILE TREE
./.claude/settings.json
./.env
./.gitignore
./.npmrc
./0
./AGENTS.md
./ai-dump.md
./app.json
./app/(auth)/login.tsx
./app/(auth)/signup.tsx
./app/(tabs)/_layout.tsx
./app/(tabs)/index.tsx
./app/(tabs)/index.tsx.pre-cats-1790683837529
./app/(tabs)/movies.tsx
./app/(tabs)/movies.tsx.pre-approach1-1790690365186
./app/(tabs)/movies.tsx.pre-cols-1790684902057
./app/(tabs)/movies.tsx.pre-fetchpage-1790593431582
./app/(tabs)/profile.tsx
./app/(tabs)/profile.tsx.pre-dl-1790680803951
./app/(tabs)/profile.tsx.pre-name-1790692921467
./app/(tabs)/profile.tsx.pre-types-1790692754091
./app/(tabs)/search.tsx
./app/(tabs)/series.tsx
./app/(tabs)/series.tsx.pre-approach1-1790690365218
./app/(tabs)/series.tsx.pre-cols-1790684902169
./app/(tabs)/series.tsx.pre-fetchpage-1790593431659
./app/_layout.tsx
./app/_layout.tsx.pre-types-1790692754091
./app/category/[key].tsx
./app/category/[key].tsx.pre-approach1-1790690365171
./app/downloads.tsx
./app/favorites.tsx
./app/movie/[id].tsx
./app/tv/[id].tsx
./app/watch/[id].tsx
./app/watch/[id].tsx.pre-types-1790692754091
./app/watchlist.tsx
./assets/android-icon-background.png
./assets/android-icon-foreground.png
./assets/android-icon-monochrome.png
./assets/favicon.png
./assets/icon.png
./assets/splash-icon.png
./babel.config.js
./CLAUDE.md
./components/brand/Logo.tsx
./components/detail/MediaDetail.tsx
./components/detail/TVDetail.tsx
./components/detail/TVDetail.tsx.pre-dl-1790680646223
./components/detail/TVDetail.tsx.pre-dl-1790680739270
./components/download/DownloadButton.tsx
./components/grid/GenreFilter.tsx
./components/grid/MediaGrid.tsx
./components/grid/MediaGrid.tsx.pre-approach1-1790690365146
./components/grid/MediaGrid.tsx.pre-cols-1790684875899
./components/grid/MediaGrid.tsx.pre-fixes-1790692623697
./components/grid/MediaGrid.tsx.pre-getitem-1790691458862
./components/grid/MediaGrid.tsx.pre-perf-1790593266034
./components/HeroSection.tsx
./components/layout/AppHeader.tsx
./components/MovieCard.tsx
./components/MovieRow.tsx
./components/TrailerPlayer.tsx
./eas.json
./global.css
./index.ts
./index.ts.pre-types-1790692754091
./LICENSE
./metro.config.js
./metro.config.js.pre-types-1790692754091
./nativewind-env.d.ts
./package.json
./project-dump.txt
./src/context/AuthContext.tsx
./src/context/AuthContext.tsx.pre-types-1790692754091
./src/services/api.ts
./src/services/api-tv-addition.txt
./src/services/downloads.ts
./src/services/downloads.ts.pre-types-1790692754091
./src/utils/secureStore.ts
./tailwind.config.js
./tsconfig.json

## FILE CONTENTS

===== FILE: ./.claude/settings.json =====
{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


===== FILE: ./.env =====
EXPO_PUBLIC_API_URL=https://ap.pincez.xyz


===== FILE: ./AGENTS.md =====
# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.


===== FILE: ./ai-dump.md =====


===== FILE: ./app.json =====
{
  "expo": {
    "name": "movieflix-rn",
    "slug": "movieflix-rn",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "movieflix",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.pintone.movieflixrn"
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-image",
      "expo-video",
      "expo-secure-store",
      "expo-status-bar"
    ],
    "extra": {
      "router": {},
      "eas": {
        "projectId": "2054ba20-bbd5-4bb3-a458-ab8872b58c52"
      }
    }
  }
}


===== FILE: ./app/(auth)/login.tsx =====
import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/profile");
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F8FAFC" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="film" size={32} color="#fff" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 }}>Welcome back</Text>
          <Text style={{ color: "#64748B", marginTop: 4 }}>Log in to your MovieFlix account</Text>
        </View>

        <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 6 }}>Email</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 }}>
          <Ionicons name="mail-outline" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, marginLeft: 10, color: "#0F172A" }}
            placeholder="you@example.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 6 }}>Password</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, marginBottom: 8 }}>
          <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, marginLeft: 10, color: "#0F172A" }}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {error ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FEF2F2", padding: 10, borderRadius: 8, marginTop: 8 }}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={{ color: "#DC2626", fontSize: 13, flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={busy}
          style={({ pressed }) => ({
            backgroundColor: busy ? "#94A3B8" : "#3B82F6",
            borderRadius: 12, paddingVertical: 16, marginTop: 24,
            alignItems: "center", justifyContent: "center",
            flexDirection: "row", gap: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {busy ? <ActivityIndicator color="#fff" /> : null}
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{busy ? "Logging in…" : "Log In"}</Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: "#64748B" }}>Don't have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/signup")} hitSlop={8}>
            <Text style={{ color: "#3B82F6", fontWeight: "700" }}>Sign Up</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace("/(tabs)")} style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: "#94A3B8", fontSize: 13 }}>Continue as guest</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


===== FILE: ./app/(auth)/signup.tsx =====
import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../src/context/AuthContext";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError("Password must contain a letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain a number");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signup(email.trim(), password, displayName.trim() || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/profile");
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F8FAFC" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#8B5CF6", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="person-add" size={32} color="#fff" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 }}>Create account</Text>
          <Text style={{ color: "#64748B", marginTop: 4 }}>Join MovieFlix in seconds</Text>
        </View>

        <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 6 }}>Display Name (optional)</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 }}>
          <Ionicons name="person-outline" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, marginLeft: 10, color: "#0F172A" }}
            placeholder="Pintone"
            placeholderTextColor="#94A3B8"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 6 }}>Email</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 }}>
          <Ionicons name="mail-outline" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, marginLeft: 10, color: "#0F172A" }}
            placeholder="you@example.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 6 }}>Password</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, marginBottom: 8 }}>
          <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, marginLeft: 10, color: "#0F172A" }}
            placeholder="At least 8 characters"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {error ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FEF2F2", padding: 10, borderRadius: 8, marginTop: 8 }}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={{ color: "#DC2626", fontSize: 13, flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={busy}
          style={({ pressed }) => ({
            backgroundColor: busy ? "#94A3B8" : "#8B5CF6",
            borderRadius: 12, paddingVertical: 16, marginTop: 24,
            alignItems: "center", justifyContent: "center",
            flexDirection: "row", gap: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {busy ? <ActivityIndicator color="#fff" /> : null}
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{busy ? "Creating…" : "Create Account"}</Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: "#64748B" }}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")} hitSlop={8}>
            <Text style={{ color: "#8B5CF6", fontWeight: "700" }}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


===== FILE: ./app/(tabs)/_layout.tsx =====
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home",
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="movies" options={{ title: "Movies",
        tabBarIcon: ({ color, size }) => <Ionicons name="film" size={size} color={color} /> }} />
      <Tabs.Screen name="series" options={{ title: "Series",
        tabBarIcon: ({ color, size }) => <Ionicons name="tv" size={size} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: "Search",
        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile",
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}


===== FILE: ./app/(tabs)/index.tsx =====
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api, pickList, API_URL } from "../../src/services/api";
import HeroSection from "../../components/HeroSection";
import MovieRow from "../../components/MovieRow";
import AppHeader from "../../components/layout/AppHeader";

async function j(path: string) {
  const r = await fetch(`${API_URL}${path}`);
  return r.json();
}

export default function HomeScreen() {
  const trending = useQuery({ queryKey: ["trending"], queryFn: api.trending });
  const movies = useQuery({ queryKey: ["movies"], queryFn: () => api.movies(1) });
  const series = useQuery({ queryKey: ["series"], queryFn: () => api.series(1) });
  const popular = useQuery({ queryKey: ["home-popular"], queryFn: () => j("/api/movies?type=popular") });
  const topRated = useQuery({ queryKey: ["home-top-rated"], queryFn: () => j("/api/movies?type=top_rated") });
  const kdrama = useQuery({ queryKey: ["home-kdrama"], queryFn: () => j("/api/tv-shows?with_original_language=ko") });
  const animation = useQuery({ queryKey: ["home-animation"], queryFn: () => j("/api/movies?with_genres=16") });

  const allQueries = [trending, movies, series, popular, topRated, kdrama, animation];
  const loading = trending.isLoading || movies.isLoading;
  const onRefresh = () => allQueries.forEach((q) => q.refetch());

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: "#64748B", marginTop: 12 }}>Loading your entertainment…</Text>
      </View>
    );
  }

  const trendingList = pickList(trending.data);
  const moviesList = pickList(movies.data);
  const seriesList = pickList(series.data).map((s: any) => ({ ...s, type: "tv" }));
  const popularList = pickList(popular.data);
  const topRatedList = pickList(topRated.data);
  const kdramaList = pickList(kdrama.data).map((s: any) => ({ ...s, type: "tv" }));
  const animationList = pickList(animation.data);

  const heroPool = trendingList.length >= 2 ? trendingList
    : popularList.length >= 2 ? popularList
    : topRatedList.length >= 2 ? topRatedList
    : [...trendingList, ...popularList, ...topRatedList];

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <AppHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="#3B82F6" />}
      >
        <HeroSection movie={heroPool[0]} />

        {/* Small spacer so the first row header doesn't hug the hero */}
        <View style={{ height: 20 }} />

        <MovieRow title="Trending Now" icon="flame" movies={trendingList} categoryKey="trending" autoScroll scrollInterval={5000} />
        <MovieRow title="Popular Movies" icon="film" movies={popularList.length ? popularList : moviesList} categoryKey="popular-movies" autoScroll scrollInterval={4500} />
        <MovieRow title="Popular Series" icon="tv" movies={seriesList} categoryKey="popular-series" autoScroll scrollInterval={5000} />
        <MovieRow title="Korean Drama" icon="heart" movies={kdramaList} categoryKey="kdrama" autoScroll scrollInterval={5500} />
        <MovieRow title="Animation" icon="color-palette" movies={animationList} categoryKey="animation" autoScroll scrollInterval={5000} />
        <MovieRow title="Top Rated of All Time" icon="trophy" movies={topRatedList} categoryKey="top-rated" autoScroll={false} />
      </ScrollView>
    </View>
  );
}


===== FILE: ./app/(tabs)/movies.tsx =====
import { useState, useCallback } from "react";
import { View, Text } from "react-native";
import MediaGrid from "../../components/grid/MediaGrid";
import GenreFilter, { GenreChip } from "../../components/grid/GenreFilter";
import { API_URL } from "../../src/services/api";

const GENRES: GenreChip[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 16, name: "Animation" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 18, name: "Drama" },
  { id: 80, name: "Crime" },
  { id: 12, name: "Adventure" },
  { id: 14, name: "Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 10751, name: "Family" },
];

export default function MoviesScreen() {
  const [genre, setGenre] = useState<number | string | null>(null);

  const fetchPage = useCallback(async (page: number, tmdbStart?: number | null) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    if (tmdbStart) params.append("tmdbStart", String(tmdbStart));
    if (genre != null) params.append("with_genres", String(genre));
    const r = await fetch(`${API_URL}/api/movies?${params.toString()}`);
    return r.json();
  }, [genre]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ paddingTop: 56 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#0F172A",
            letterSpacing: -0.5,
            paddingHorizontal: 16,
            marginBottom: 14,
          }}
        >
          Movies
        </Text>

        <GenreFilter genres={GENRES} selectedId={genre} onSelect={setGenre} accent="#3B82F6" />

        <View style={{ height: 12 }} />
      </View>

      <View style={{ flex: 1 }}>
        <MediaGrid
          key={`movies-${genre ?? "all"}`}
          fetchPage={fetchPage}
          queryKey="movie"
          emptyText="No movies found"
         columns={2} />
      </View>
    </View>
  );
}


===== FILE: ./app/(tabs)/profile.tsx =====
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 56, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#0F172A", marginBottom: 24 }}>Profile</Text>

      {currentUser ? (
        <>
          <Text style={{ color: "#0F172A", fontSize: 18 }}>{currentUser.display_name || "User"}</Text>
          <Text style={{ color: "#64748B", marginBottom: 24 }}>{currentUser.email}</Text>

          <Pressable
            onPress={() => router.push("/favorites")}
            style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ color: "#0F172A" }}>My Favorites</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/watchlist")}
            style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ color: "#0F172A" }}>My Watchlist</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/downloads")}
            style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ color: "#0F172A" }}>My Downloads</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{ backgroundColor: "#EF4444", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginTop: 16 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "500" }}>Log Out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={{ color: "#64748B", marginBottom: 24 }}>Sign in to save favorites and watchlist.</Text>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={{ backgroundColor: "#3B82F6", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "500" }}>Log In</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(auth)/signup")}
            style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ color: "#0F172A", textAlign: "center", fontWeight: "500" }}>Sign Up</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}


===== FILE: ./app/(tabs)/search.tsx =====
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


===== FILE: ./app/(tabs)/series.tsx =====
import { useState, useCallback } from "react";
import { View, Text } from "react-native";
import MediaGrid from "../../components/grid/MediaGrid";
import GenreFilter, { GenreChip } from "../../components/grid/GenreFilter";
import { API_URL } from "../../src/services/api";

const TV_GENRES: GenreChip[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 16, name: "Animation" },
  { id: 18, name: "Drama" },
  { id: 80, name: "Crime" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 10764, name: "Reality" },
  { id: 10768, name: "War & Politics" },
];

export default function SeriesScreen() {
  const [genre, setGenre] = useState<number | string | null>(null);

  const fetchPage = useCallback(async (page: number, tmdbStart?: number | null) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    if (tmdbStart) params.append("tmdbStart", String(tmdbStart));
    if (genre != null) params.append("with_genres", String(genre));
    const r = await fetch(`${API_URL}/api/tv-shows?${params.toString()}`);
    return r.json();
  }, [genre]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ paddingTop: 56 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#0F172A",
            letterSpacing: -0.5,
            paddingHorizontal: 16,
            marginBottom: 14,
          }}
        >
          Series
        </Text>

        <GenreFilter genres={TV_GENRES} selectedId={genre} onSelect={setGenre} accent="#8B5CF6" />

        <View style={{ height: 12 }} />
      </View>

      <View style={{ flex: 1 }}>
        <MediaGrid
          key={`series-${genre ?? "all"}`}
          fetchPage={fetchPage}
          queryKey="tv"
          emptyText="No series found"
         columns={2} />
      </View>
    </View>
  );
}


===== FILE: ./app/_layout.tsx =====
// import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 0 } },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}


===== FILE: ./app/category/[key].tsx =====
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import MediaGrid from "../../components/grid/MediaGrid";
import { API_URL } from "../../src/services/api";

type CategoryDef = {
  title: string;
  endpoint: string; // path WITHOUT ?page= — we add it in fetchPage
};

const CATEGORIES: Record<string, CategoryDef> = {
  // Movies
  "trending":            { title: "Trending Now",        endpoint: "/api/trending" },
  "popular-movies":      { title: "Popular Movies",      endpoint: "/api/movies?type=popular&sort_by=popularity.desc" },
  "top-rated":           { title: "Top Rated Movies",    endpoint: "/api/movies?type=top_rated&sort_by=vote_average.desc" },
  "now-playing":         { title: "Now Playing",         endpoint: "/api/movies?type=now_playing" },
  "upcoming":            { title: "Coming Soon",         endpoint: "/api/movies?type=upcoming" },
  "animation":           { title: "Animation",           endpoint: "/api/movies?with_genres=16&sort_by=popularity.desc" },
  "action":              { title: "Action",              endpoint: "/api/movies?with_genres=28&sort_by=popularity.desc" },
  "comedy":              { title: "Comedy",              endpoint: "/api/movies?with_genres=35&sort_by=popularity.desc" },
  "horror":              { title: "Horror",              endpoint: "/api/movies?with_genres=27&sort_by=popularity.desc" },
  "romance":             { title: "Romance",             endpoint: "/api/movies?with_genres=10749&sort_by=popularity.desc" },
  "sci-fi":              { title: "Sci-Fi",              endpoint: "/api/movies?with_genres=878&sort_by=popularity.desc" },
  "thriller":            { title: "Thriller",            endpoint: "/api/movies?with_genres=53&sort_by=popularity.desc" },
  "drama":               { title: "Drama",               endpoint: "/api/movies?with_genres=18&sort_by=popularity.desc" },
  "african-movies":      { title: "African Movies",      endpoint: "/api/movies?with_origin_country=NG&sort_by=popularity.desc" },

  // TV
  "popular-series":      { title: "Popular Series",      endpoint: "/api/tv-shows?type=popular&sort_by=popularity.desc" },
  "top-rated-tv":        { title: "Top Rated Series",    endpoint: "/api/tv-shows?type=top_rated&sort_by=vote_average.desc" },
  "kdrama":              { title: "Korean Drama",        endpoint: "/api/tv-shows?with_original_language=ko&sort_by=popularity.desc" },
  "anime":               { title: "Anime",               endpoint: "/api/tv-shows?with_genres=16&with_original_language=ja&sort_by=popularity.desc" },
  "tv-comedy":           { title: "TV Comedy",           endpoint: "/api/tv-shows?with_genres=35&sort_by=popularity.desc" },
  "tv-drama":            { title: "TV Drama",            endpoint: "/api/tv-shows?with_genres=18&sort_by=popularity.desc" },
};

export default function CategoryScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const def = CATEGORIES[key || ""] || {
    title: "Category",
    endpoint: "/api/movies?type=popular",
  };

  const fetchPage = async (page: number, tmdbStart?: number | null) => {
    const sep = def.endpoint.includes("?") ? "&" : "?";
    const t = tmdbStart ? `&tmdbStart=${tmdbStart}` : "";
    const url = `${API_URL}${def.endpoint}${sep}page=${page}${t}`;
    console.log(`[category:${key}] fetching ${url}`);
    const r = await fetch(url);
    return r.json();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 56 }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 }}>
        <Pressable onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/"))} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A", marginLeft: 12 }}>
          {def.title}
        </Text>
      </View>

      <MediaGrid
        key={key}
        fetchPage={fetchPage}
        queryKey={key || "category"}
        emptyText="Nothing here yet"
        columns={2}
      />
    </View>
  );
}


===== FILE: ./app/downloads.tsx =====
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
import {
  useDownloadsStore,
  loadAllDownloads,
  deleteDownload,
  exportDownload,
  resumeQueuedDownloads,
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

  const handleResume = async () => {
    setResuming(true);
    try {
      await resumeQueuedDownloads();
      await refresh();
    } catch {}
    setResuming(false);
  };

  const handleDelete = (item: DownloadItem) => {
    Alert.alert(
      "Delete download?",
      `"${item.title}" will be removed from your device.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteDownload(item.id);
            await refresh();
          },
        },
      ],
    );
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

  const queuedCount = items.filter((x) => x.status === "queued").length;

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
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A", marginLeft: 12, flex: 1 }}>
          My Downloads
        </Text>

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
            style={({ pressed }) => ({
              flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#EFF6FF", paddingVertical: 8, borderRadius: 8,
              marginRight: 6, opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="share-outline" size={14} color="#3B82F6" />
            <Text style={{ color: "#3B82F6", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
              Export
            </Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 8,
              backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </Pressable>
        </View>
      ) : null}

      {isFailed || isQueued ? (
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => ({
            flexDirection: "row", alignItems: "center", justifyContent: "center",
            marginTop: 8, paddingVertical: 8, borderRadius: 8,
            backgroundColor: "#FEF2F2", opacity: pressed ? 0.85 : 1,
          })}
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


===== FILE: ./app/favorites.tsx =====
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


===== FILE: ./app/movie/[id].tsx =====
import MediaDetail from "../../components/detail/MediaDetail";
export default function MovieDetailScreen() {
  return <MediaDetail type="movie" />;
}


===== FILE: ./app/tv/[id].tsx =====
import TVDetail from "../../components/detail/TVDetail";
export default function TVDetailScreen() {
  return <TVDetail />;
}


===== FILE: ./app/watch/[id].tsx =====
import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, useWindowDimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api, MediaType, StreamResult } from "../../src/services/api";
import {
  getLocalVideoUri,
  useDownloadsStore,
  loadAllDownloads,
} from "../../src/services/downloads";

const QUALITIES = ["2160p", "1080p", "720p", "480p"] as const;

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

  const { width } = useWindowDimensions();
  const [quality, setQuality] = useState<string>(params.quality || "1080p");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [checkingLocal, setCheckingLocal] = useState(true);

  const items = useDownloadsStore((s) => s.items);
  const setItems = useDownloadsStore((s) => s.setItems);

  // 1. Check for offline file first
  useEffect(() => {
    (async () => {
      try {
        // If store is empty, load from disk
        if (items.length === 0) {
          const list = await loadAllDownloads();
          setItems(list);
        }

        // Priority 1: explicit localId passed by downloads screen
        if (params.localId) {
          const match = items.find((x) => x.id === params.localId);
          if (match?.localUri) {
            setLocalUri(match.localUri);
            setCheckingLocal(false);
            return;
          }
        }

        // Priority 2: match by hash + tmdbId
        if (params.hash) {
          const uri = await getLocalVideoUri(params.hash, params.file_id ? Number(params.file_id) : undefined);
          if (uri) {
            setLocalUri(uri);
            setCheckingLocal(false);
            return;
          }
        }

        // Priority 3: any completed download for this tmdbId
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

  // 2. If we're offline, skip the network query
  const streamQuery = useQuery({
    queryKey: ["stream", type, id, quality, params.hash, params.file_id, season, episode],
    queryFn: () => fetchStream(type, id, quality, params.hash, params.file_id, season, episode),
    enabled: !!id && !localUri,
    staleTime: 0,
    retry: 0,
  });

  // 3. Play from local if we have it, otherwise from network
  const streamUrl = localUri || streamQuery.data?.streamUrl;
  const isOffline = !!localUri;
  const errorMsg = (streamQuery.error as any)?.message || streamQuery.data?.error;

  const player = useVideoPlayer(streamUrl || null, (p) => {
    p.loop = false;
    p.play();
  });

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

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#000" }}>
        <Pressable onPress={() => (router.canGoBack?.() ? router.back() : router.replace("/"))} hitSlop={12}>
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <Text style={{ color: "#fff", marginLeft: 12, fontWeight: "600", flex: 1 }} numberOfLines={1}>
          {titleLabel}
        </Text>
        {isOffline ? (
          <View style={{ backgroundColor: "#10B981", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="cloud-offline" size={12} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>OFFLINE</Text>
          </View>
        ) : null}
      </View>

      <View style={{ width, height: width * (9 / 16), backgroundColor: "#000" }}>
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ color: "#fff", marginTop: 8 }}>{checkingLocal ? "Checking downloads…" : "Fetching stream…"}</Text>
          </View>
        ) : !streamUrl ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
            <Ionicons name="videocam-off-outline" size={48} color="#64748B" />
            <Text style={{ color: "#94A3B8", marginTop: 12, textAlign: "center", fontSize: 15 }}>
              Not available yet
            </Text>
            {errorMsg ? <Text style={{ color: "#475569", marginTop: 12, fontSize: 11, textAlign: "center" }}>{errorMsg}</Text> : null}
          </View>
        ) : (
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            nativeControls
          />
        )}
      </View>

      {!isOffline ? (
        <View style={{ flexDirection: "row", padding: 16, gap: 8 }}>
          {QUALITIES.map((q) => {
            const active = q === quality;
            return (
              <Pressable
                key={q}
                onPress={() => setQuality(q)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: active ? "#3B82F6" : "#1E293B",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>{q}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {streamQuery.data && streamUrl && !isOffline ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: "#94A3B8", fontSize: 12 }}>
            Quality: {streamQuery.data.quality || quality}
            {streamQuery.data.size ? ` · Size: ${streamQuery.data.size} MB` : ""}
            {streamQuery.data.seeders != null ? ` · Seeders: ${streamQuery.data.seeders}` : ""}
          </Text>
        </View>
      ) : null}
    </View>
  );
}


===== FILE: ./app/watchlist.tsx =====
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

export default function WatchlistScreen() {
  const { currentUser, getAuthHeaders } = useAuth();
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

  const q = useQuery({
    queryKey: ["watchlist", currentUser?.id],
    queryFn: async () => {
      const res = await api.getWatchlist(getAuthHeaders());
      const items = res?.watchlist || [];
      if (items.length === 0) return [];
      return hydrateListItems(items);
    },
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Ionicons name="lock-closed-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: "#64748B", marginTop: 12, textAlign: "center" }}>Log in to see your watchlist</Text>
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
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A", marginLeft: 12 }}>Watchlist</Text>
      </View>

      {q.isLoading ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator color="#3B82F6" />
          <Text style={{ color: "#94A3B8", marginTop: 8, fontSize: 12 }}>Loading watchlist…</Text>
        </View>
      ) : (q.data || []).length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <Ionicons name="bookmark-outline" size={48} color="#CBD5E1" />
          <Text style={{ color: "#64748B", marginTop: 12 }}>No watchlist yet</Text>
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


===== FILE: ./babel.config.js =====
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-worklets/plugin",
    ],
  };
};


===== FILE: ./CLAUDE.md =====
@AGENTS.md


===== FILE: ./components/brand/Logo.tsx =====
import { View, Text } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Path,
  Polygon,
  Circle,
  G,
} from "react-native-svg";

/**
 * PincezLogo — Self-contained logo with "PINCEZ TV" wordmark inside the badge.
 * Blue → purple → pink gradient to match the app theme.
 */
export default function PincezLogo({ height = 40 }: { height?: number }) {
  // aspect ratio 200 x 64
  const width = (height / 64) * 200;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Svg width={width} height={height} viewBox="0 0 200 64" fill="none">
        <Defs>
          {/* Main gradient for outlines / accents */}
          <SvgLinearGradient id="brandGrad" x1="0" y1="0" x2="200" y2="64" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="50%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#EC4899" />
          </SvgLinearGradient>

          {/* Badge background */}
          <SvgLinearGradient id="badgeBg" x1="0" y1="0" x2="200" y2="64" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#0B0E14" />
            <Stop offset="100%" stopColor="#1A1F2E" />
          </SvgLinearGradient>

          {/* Inner glow on the badge */}
          <SvgLinearGradient id="badgeGlow" x1="0" y1="0" x2="200" y2="64" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
            <Stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.22} />
            <Stop offset="100%" stopColor="#EC4899" stopOpacity={0.12} />
          </SvgLinearGradient>
        </Defs>

        {/* Outer badge - rounded rect */}
        <Rect
          x={2} y={2} width={196} height={60} rx={14}
          fill="url(#badgeBg)"
          stroke="url(#brandGrad)"
          strokeWidth={2}
        />

        {/* Inner subtle glow */}
        <Rect x={2} y={2} width={196} height={60} rx={14} fill="url(#badgeGlow)" />

        {/* ===== Left: Play triangle + P mark ===== */}
        <G>
          {/* Rounded square container for the P */}
          <Rect
            x={14} y={14} width={36} height={36} rx={9}
            fill="url(#brandGrad)"
            opacity={0.95}
          />

          {/* White play triangle (right half of the container) */}
          <Polygon
            points="26,24 26,40 38,32"
            fill="#FFFFFF"
            opacity={0.95}
          />

          {/* Overlaid "P" letterform (left bar) */}
          <Rect x={21} y={22} width={3.2} height={20} rx={1.2} fill="#FFFFFF" />

          {/* Scan lines inside the badge (subtle, matches your original) */}
          <Rect x={54} y={20} width={120} height={0.8} rx={0.4} fill="#FFFFFF" opacity={0.05} />
          <Rect x={54} y={31} width={120} height={0.8} rx={0.4} fill="#FFFFFF" opacity={0.05} />
          <Rect x={54} y={42} width={120} height={0.8} rx={0.4} fill="#FFFFFF" opacity={0.05} />

          {/* Small signal dot indicator */}
          <Circle cx={180} cy={32} r={2.6} fill="url(#brandGrad)" />
          <Circle cx={180} cy={32} r={5} fill="url(#brandGrad)" opacity={0.35} />
        </G>

        {/* ===== Right: PINCEZ / TV stacked wordmark (as SVG text via Path) =====
         *  We can't rely on <Text> from react-native-svg working identically across
         *  web + native, so we overlay RN <Text> absolutely — see below the SVG.
         */}
      </Svg>

      {/* Wordmark overlay (uses RN <Text> for crisp rendering everywhere) */}
      <View style={{ position: "absolute", left: width * 0.28, top: 0, bottom: 0, justifyContent: "center" }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: height * 0.34,
            fontWeight: "800",
            letterSpacing: height * 0.02,
            lineHeight: height * 0.36,
          }}
        >
          PINCEZ
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            style={{
              color: "#8B5CF6",
              fontSize: height * 0.2,
              fontWeight: "800",
              letterSpacing: height * 0.06,
              lineHeight: height * 0.22,
            }}
          >
            TV
          </Text>
          <View style={{ width: height * 0.4, height: 1.5, backgroundColor: "#3B82F6", borderRadius: 1 }} />
        </View>
      </View>
    </View>
  );
}


===== FILE: ./components/detail/MediaDetail.tsx =====
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
  const [expandedQuality, setExpandedQuality] = useState<string | null>(null);
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

  // List membership
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
        <View style={{ flexDirection: "row", paddingHorizontal: 16, marginTop: 22, gap: 10 }}>
          <Pressable
            onPress={() => openPlayer()}
            disabled={!activeQuality}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: activeQuality ? "#3B82F6" : "#94A3B8",
              borderRadius: 12, paddingVertical: 14,
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Watch Now</Text>
          </Pressable>

          {trailer?.key ? (
            <Pressable onPress={openTrailer} style={({ pressed }) => ({
              width: 52, height: 52, borderRadius: 12, backgroundColor: "#fff",
              borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}>
              <Ionicons name="logo-youtube" size={22} color="#EF4444" />
            </Pressable>
          ) : null}

          <Pressable onPress={toggleWatchlist} style={({ pressed }) => ({
            width: 52, height: 52, borderRadius: 12,
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
          <DownloadButton
            hash={(() => {
              // Pick the best-scored hash across all quality groups (cached + most seeders first)
              const all = qualityGroups.flatMap((g) => g.hashes);
              const sorted = sortByScore(all);
              return sorted[0]?.hash || "";
            })()}
            tmdbId={Number(id)}
            mediaType={type}
            quality={(() => {
              const all = qualityGroups.flatMap((g) => g.hashes);
              const sorted = sortByScore(all);
              return sorted[0]?.quality || activeQuality || "1080p";
            })()}
            title={title}
            poster={poster}
          />
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
            qualityGroups.map((group) => (
              <QualityRow
                key={group.quality}
                group={group}
                active={activeQuality === group.quality}
                expanded={expandedQuality === group.quality}
                onToggle={() => {
                  setSelectedQuality(group.quality);
                  setExpandedQuality((cur) => (cur === group.quality ? null : group.quality));
                }}
                onPlay={(hash) => openPlayer(hash, group.quality)}
              />
            ))
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

/* ---------- QualityRow ---------- */
function QualityRow({
  group,
  active,
  expanded,
  onToggle,
  onPlay,
}: {
  group: QualityGroup;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onPlay: (hash: MovieHash) => void;
}) {
  const hasPlayable = group.playableHashes > 0;
  const totalSize = group.hashes.reduce((s, h) => s + (h.size_mb || 0), 0);
  const bestHash = sortByScore(group.hashes)[0];

  return (
    <View style={{ marginBottom: 10 }}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          flexDirection: "row", alignItems: "center",
          padding: 14, borderRadius: 14,
          backgroundColor: active ? "#EFF6FF" : "#fff",
          borderWidth: 1.5, borderColor: active ? "#3B82F6" : "#E2E8F0",
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: active ? "#3B82F6" : "#F1F5F9" }}>
          <Text style={{ color: active ? "#fff" : "#334155", fontWeight: "800", fontSize: 13 }}>
            {group.quality.toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: "#0F172A", fontWeight: "600", fontSize: 13 }}>
            {group.totalHashes} source{group.totalHashes > 1 ? "s" : ""}
          </Text>
          <Text style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>
            {hasPlayable ? `${group.playableHashes} playable · ` : "Not ready · "}
            {Math.round(totalSize)} MB
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color="#64748B" />
      </Pressable>

      {expanded ? (
        <View style={{ marginTop: 8, paddingLeft: 4 }}>
          {group.hashes.map((h, i) => {
            const playable = h.seeders > 0 || h.is_cached === 1;
            return (
              <Pressable
                key={h.hash || i}
                onPress={() => playable && onPlay(h)}
                disabled={!playable}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center",
                  padding: 12, marginBottom: 6, borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: h.hash === bestHash?.hash ? "#3B82F6" : "#E2E8F0",
                  opacity: playable ? (pressed ? 0.85 : 1) : 0.5,
                })}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {h.is_cached === 1 ? (
                      <View style={{ backgroundColor: "#DBEAFE", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: "#1D4ED8", fontSize: 9, fontWeight: "800" }}>CACHED</Text>
                      </View>
                    ) : null}
                    {h.seeders > 0 ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Ionicons name="people" size={11} color="#10B981" />
                        <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "700" }}>{h.seeders}</Text>
                      </View>
                    ) : null}
                    {h.hash === bestHash?.hash ? (
                      <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: "#B45309", fontSize: 9, fontWeight: "800" }}>BEST</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={{ color: "#64748B", fontSize: 11, marginTop: 4 }} numberOfLines={1}>
                    {h.hash.slice(0, 16)}… · {h.size_mb ? `${Math.round(h.size_mb)} MB` : "size unknown"}
                  </Text>
                </View>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: playable ? "#3B82F6" : "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="play" size={16} color="#fff" />
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}


===== FILE: ./components/detail/TVDetail.tsx =====
import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { api, MovieHash } from "../../src/services/api";
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

export default function TVDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, getAuthHeaders } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [browsingEpisode, setBrowsingEpisode] = useState<{ episode_number: number; hashes: MovieHash[] } | null>(null);
  const [browsingPack, setBrowsingPack] = useState<{ season: number; packs: MovieHash[] } | null>(null);

  // Season pack episode picker
  const [packPicker, setPackPicker] = useState<{ hash: string; quality: string } | null>(null);
  const [packFiles, setPackFiles] = useState<MovieHash[]>([]);
  const [packLoading, setPackLoading] = useState(false);

  const detail = useQuery({
    queryKey: ["tv-detail", id],
    queryFn: () => api.detail("tv", id),
    enabled: !!id,
  });

  const videos = useQuery({
    queryKey: ["tv-videos", id],
    queryFn: () => api.tvVideos(id!),
    enabled: !!id,
    retry: 0,
  });

  const similar = useQuery({
    queryKey: ["tv-similar", id],
    queryFn: () => api.tvSimilar(id!),
    enabled: !!id,
    retry: 0,
  });

  const packsQuery = useQuery({
    queryKey: ["tv-packs", id],
    queryFn: () => api.tvSeasonPacks(id!),
    enabled: !!id,
    retry: 0,
  });

  const hashesQuery = useQuery({
    queryKey: ["tv-hashes", id],
    queryFn: () => api.tvEpisodeHashes(id!),
    enabled: !!id,
    retry: 0,
  });

  const item = detail.data as any;

  const trailer = useMemo(() => {
    const list = videos.data?.videos || [];
    return (
      list.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
      list.find((v: any) => v.site === "YouTube") ||
      null
    );
  }, [videos.data]);

  // ---- Packs indexed by season ----
  const packsBySeason = useMemo(() => {
    const map = new Map<number, MovieHash[]>();
    const seasons = packsQuery.data?.seasons || [];
    for (const s of seasons) {
      const seasonNum = s.season_number;
      const list: MovieHash[] = (s.packs || []).map((p: any) => ({
        id: p.id,
        hash: p.info_hash,
        info_hash: p.info_hash,
        quality: p.quality || "1080p",
        size_mb: p.size_mb || 0,
        seeders: p.seeders || 0,
        is_cached: p.is_cached || 0,
        episode_count: p.episode_count || 0,
        season_number: seasonNum,
        isSeasonPack: true,
      }));
      map.set(seasonNum, list);
    }
    return map;
  }, [packsQuery.data]);

  // ---- Episode hashes grouped by season → episode ----
  const episodesBySeason = useMemo(() => {
    const map = new Map<number, Map<number, MovieHash[]>>();
    for (const h of hashesQuery.data || []) {
      const s = h.season_number ?? 1;
      const e = h.episode_number ?? 1;
      if (!map.has(s)) map.set(s, new Map());
      const epMap = map.get(s)!;
      if (!epMap.has(e)) epMap.set(e, []);
      epMap.get(e)!.push(h);
    }
    return map;
  }, [hashesQuery.data]);

  // ---- Available seasons ----
  const seasonsList: number[] = useMemo(() => {
    const set = new Set<number>();
    for (const k of packsBySeason.keys()) set.add(k);
    for (const k of episodesBySeason.keys()) set.add(k);
    for (const s of (item?.seasons || [])) {
      if (s.season_number > 0) set.add(s.season_number);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [packsBySeason, episodesBySeason, item]);

  const activeSeason = selectedSeason ?? seasonsList[0] ?? 1;

  const openPlayer = (opts: { season: number; episode: number; hash?: string; quality?: string; file_id?: number | string }) => {
    Haptics.selectionAsync();
    const parts = [
      `type=tv`,
      `season=${opts.season}`,
      `episode=${opts.episode}`,
      `quality=${opts.quality || "1080p"}`,
    ];
    if (opts.hash) parts.push(`hash=${opts.hash}`);
    if (opts.file_id != null) parts.push(`file_id=${opts.file_id}`);
    router.push(`/watch/${id}?${parts.join("&")}`);
  };

  const openPackPicker = async (hash: string, quality: string) => {
    Haptics.selectionAsync();
    setPackPicker({ hash, quality });
    setPackLoading(true);
    try {
      const files = await api.torrentFiles(hash);
      const sorted = [...files].sort((a: any, b: any) => {
        const aMatch = a.name?.match(/[Ss](\d+)[Ee](\d+)/);
        const bMatch = b.name?.match(/[Ss](\d+)[Ee](\d+)/);
        const aEp = aMatch ? parseInt(aMatch[2]) : 0;
        const bEp = bMatch ? parseInt(bMatch[2]) : 0;
        return aEp - bEp;
      });
      setPackFiles(sorted);
    } catch {
      setPackFiles([]);
    } finally {
      setPackLoading(false);
    }
  };

  const openTrailer = () => {
    if (!trailer?.key) return;
    Haptics.selectionAsync();
    setTrailerOpen(true);
  };

  const toggleWatchlist = async () => {
    if (!currentUser) { router.push("/login"); return; }
    Haptics.selectionAsync();
    try { await api.toggleWatchlist(Number(id), false, "tv", getAuthHeaders()); } catch {}
  };
  const toggleFavorites = async () => {
    if (!currentUser) { router.push("/login"); return; }
    Haptics.selectionAsync();
    try { await api.toggleFavorites(Number(id), false, "tv", getAuthHeaders()); } catch {}
  };

  if (detail.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }
  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}>
        <Text style={{ color: "#64748B" }}>TV show not found</Text>
      </View>
    );
  }

  const title = item.title || item.name || "Untitled";
  const backdrop = item.backdrop || item.backdrop_path || item.poster || item.poster_path;
  const poster = item.poster || item.poster_path || PLACEHOLDER;
  const year = item.year || item.first_air_date?.split("-")[0] || "N/A";
  const rating = item.rating ?? item.vote_average ?? 0;
  const genres = (item.genres || []).map((g: any) => (typeof g === "string" ? g : g.name)).filter(Boolean);

  // Group packs by quality for the active season
  const packsForSeason = packsBySeason.get(activeSeason) || [];
  const packsByQuality = new Map<string, MovieHash[]>();
  for (const p of packsForSeason) {
    const q = p.quality || "1080p";
    if (!packsByQuality.has(q)) packsByQuality.set(q, []);
    packsByQuality.get(q)!.push(p);
  }
  const packQualities = Array.from(packsByQuality.keys()).sort((a, b) => {
    const order = ["2160p", "1080p", "720p", "480p"];
    return order.indexOf(a) - order.indexOf(b);
  });

  const episodesMap = episodesBySeason.get(activeSeason);
  const episodeGroups = episodesMap
    ? Array.from(episodesMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([epNum, hashes]) => ({ episode_number: epNum, hashes }))
    : [];

  const hasPacks = packsForSeason.length > 0;
  const hasEpisodes = episodeGroups.length > 0;

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Backdrop */}
        <View style={{ height: 340 }}>
          {backdrop ? (
            <Image source={{ uri: backdrop }} style={{ width: "100%", height: "100%", opacity: 0.6 }} contentFit="cover" />
          ) : null}
          <LinearGradient
            colors={["rgba(15,23,42,0.4)", "rgba(15,23,42,0.85)", "#F8FAFC"]}
            locations={[0, 0.6, 1]}
            style={{ position: "absolute", inset: 0 }}
          />
          <Pressable
            onPress={() => (router.canGoBack?.() ? router.back() : router.replace('/'))}
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
          <Image source={{ uri: poster }} style={{ width: 120, height: 180, borderRadius: 12, backgroundColor: "#E2E8F0" }} contentFit="cover" />
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
              {seasonsList.length ? <Text style={{ color: "#64748B" }}>{seasonsList.length} seasons</Text> : null}
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
        <View style={{ flexDirection: "row", paddingHorizontal: 16, marginTop: 22, gap: 10 }}>
          <Pressable
            onPress={() => {
              const bestPack = sortByScore(packsForSeason)[0];
              const bestEp = episodeGroups[0]?.hashes ? sortByScore(episodeGroups[0].hashes)[0] : undefined;
              const src = bestPack || bestEp;
              if (bestPack) {
                openPackPicker(bestPack.hash, bestPack.quality);
              } else if (bestEp) {
                openPlayer({
                  season: activeSeason,
                  episode: episodeGroups[0].episode_number,
                  hash: bestEp.hash,
                  quality: bestEp.quality,
                });
              }
            }}
            style={({ pressed }) => ({
              flex: 1, backgroundColor: "#8B5CF6", borderRadius: 12, paddingVertical: 14,
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Play S{activeSeason}E1</Text>
          </Pressable>

          {trailer?.key ? (
            <Pressable onPress={openTrailer} style={({ pressed }) => ({
              width: 52, height: 52, borderRadius: 12, backgroundColor: "#fff",
              borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}>
              <Ionicons name="logo-youtube" size={22} color="#EF4444" />
            </Pressable>
          ) : null}

          <Pressable onPress={toggleWatchlist} style={({ pressed }) => ({
            width: 52, height: 52, borderRadius: 12, backgroundColor: "#fff",
            borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}>
            <Ionicons name="bookmark-outline" size={22} color="#0F172A" />
          </Pressable>

          <Pressable onPress={toggleFavorites} style={({ pressed }) => ({
            width: 52, height: 52, borderRadius: 12, backgroundColor: "#fff",
            borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}>
            <Ionicons name="heart-outline" size={22} color="#0F172A" />
          </Pressable>

          {(() => {
            const bestPack = packsForSeason[0];
            const firstEp = episodeGroups[0];
            const downloadTarget = bestPack
              ? { hash: bestPack.hash, quality: bestPack.quality, episode: 1 }
              : firstEp && firstEp.hashes.length > 0
                ? { hash: firstEp.hashes[0].hash, quality: firstEp.hashes[0].quality, episode: firstEp.episode_number }
                : null;
            if (!downloadTarget) return null;
            return (
              <DownloadButton
                hash={downloadTarget.hash}
                tmdbId={Number(id)}
                mediaType="tv"
                quality={downloadTarget.quality}
                title={title}
                poster={poster}
                season={activeSeason}
                episode={downloadTarget.episode}
              />
            );
          })()}
        </View>

        {/* Overview */}
        <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17, marginBottom: 10 }}>Overview</Text>
          <Text style={{ color: "#334155", lineHeight: 22, fontSize: 14 }}>
            {item.overview || "No overview available."}
          </Text>
        </View>

        {/* Seasons picker */}
        {seasonsList.length > 0 ? (
          <View style={{ marginTop: 32 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17, paddingHorizontal: 16, marginBottom: 12 }}>
              Seasons
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {seasonsList.map((s) => {
                const active = s === activeSeason;
                const hasPack = (packsBySeason.get(s) || []).length > 0;
                const hasEp = episodesBySeason.has(s);
                return (
                  <Pressable
                    key={s}
                    onPress={() => { Haptics.selectionAsync(); setSelectedSeason(s); }}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
                      backgroundColor: active ? "#8B5CF6" : "#fff",
                      borderWidth: 1.5, borderColor: active ? "#8B5CF6" : "#E2E8F0",
                      flexDirection: "row", alignItems: "center", gap: 6,
                    }}
                  >
                    <Text style={{ color: active ? "#fff" : "#334155", fontWeight: "800", fontSize: 13 }}>
                      S{s}
                    </Text>
                    {hasPack ? <Ionicons name="albums" size={13} color={active ? "#fff" : "#8B5CF6"} /> : null}
                    {!hasPack && hasEp ? <Ionicons name="film" size={13} color={active ? "#fff" : "#8B5CF6"} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* Season content */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17 }}>Available Sources</Text>
            <Text style={{ color: "#64748B", fontSize: 12 }}>
              Season {activeSeason} · {hasPacks ? `${packQualities.length} qualities` : hasEpisodes ? `${episodeGroups.length} episodes` : "none"}
            </Text>
          </View>

          {packsQuery.isLoading || hashesQuery.isLoading ? (
            <ActivityIndicator color="#8B5CF6" />
          ) : !hasPacks && !hasEpisodes ? (
            <View style={{ padding: 20, backgroundColor: "#F1F5F9", borderRadius: 14, alignItems: "center" }}>
              <Ionicons name="cloud-offline-outline" size={32} color="#94A3B8" />
              <Text style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>No sources yet</Text>
              <Text style={{ color: "#94A3B8", marginTop: 4, fontSize: 11 }}>This season is being prepared</Text>
            </View>
          ) : hasPacks ? (
            <>
              <View style={{
                padding: 12, borderRadius: 12, marginBottom: 12,
                backgroundColor: "#F5F3FF", borderWidth: 1, borderColor: "#DDD6FE",
                flexDirection: "row", alignItems: "center", gap: 8,
              }}>
                <Ionicons name="albums" size={18} color="#8B5CF6" />
                <Text style={{ color: "#5B21B6", fontWeight: "700", fontSize: 12 }}>
                  Full Season Pack · {packsForSeason[0]?.episode_count || 0} episodes
                </Text>
              </View>

              {packQualities.map((quality) => {
                const packs = sortByScore(packsByQuality.get(quality) || []);
                const best = packs[0];
                const playable = best && (best.seeders > 0 || best.is_cached === 1);
                const totalSeeders = packs.reduce((s, p) => s + (p.seeders || 0), 0);
                return (
                  <View
                    key={quality}
                    style={{
                      marginBottom: 10, padding: 14, borderRadius: 14,
                      backgroundColor: "#fff", borderWidth: 1.5,
                      borderColor: playable ? "#A78BFA" : "#E2E8F0",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#8B5CF6" }}>
                            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{quality.toUpperCase()}</Text>
                          </View>
                          {best?.is_cached === 1 ? (
                            <View style={{ backgroundColor: "#DBEAFE", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ color: "#1D4ED8", fontSize: 9, fontWeight: "800" }}>CACHED</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={{ color: "#64748B", fontSize: 11 }}>
                          {packs.length} source{packs.length > 1 ? "s" : ""} · {totalSeeders} seeders
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                      <Pressable
                        onPress={() => playable && openPackPicker(best.hash, quality)}
                        disabled={!playable}
                        style={({ pressed }) => ({
                          flex: 1,
                          backgroundColor: playable ? "#8B5CF6" : "#CBD5E1",
                          borderRadius: 10, paddingVertical: 11,
                          flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                          opacity: pressed ? 0.85 : 1,
                        })}
                      >
                        <Ionicons name="list" size={16} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Choose Episode</Text>
                      </Pressable>

                      {packs.length > 1 ? (
                        <Pressable
                          onPress={() => { Haptics.selectionAsync(); setBrowsingPack({ season: activeSeason, packs }); }}
                          style={({ pressed }) => ({
                            paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10,
                            backgroundColor: "#F1F5F9",
                            flexDirection: "row", alignItems: "center", gap: 6,
                            opacity: pressed ? 0.75 : 1,
                          })}
                        >
                          <Ionicons name="layers" size={14} color="#64748B" />
                          <Text style={{ color: "#475569", fontWeight: "700", fontSize: 12 }}>
                            {packs.length}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            <>
              {episodeGroups.map((ep) => {
                const best = sortByScore(ep.hashes)[0];
                const playable = best && (best.seeders > 0 || best.is_cached === 1);
                return (
                  <View
                    key={ep.episode_number}
                    style={{
                      marginBottom: 10, padding: 14, borderRadius: 14,
                      backgroundColor: "#fff",
                      borderWidth: 1.5,
                      borderColor: playable ? "#A78BFA" : "#E2E8F0",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 }}>
                      <View style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ color: "#6D28D9", fontWeight: "800", fontSize: 11 }}>
                          S{String(activeSeason).padStart(2, "0")}E{String(ep.episode_number).padStart(2, "0")}
                        </Text>
                      </View>
                      <Text style={{ color: "#64748B", fontSize: 11, flex: 1 }} numberOfLines={1}>
                        {ep.hashes.length} source{ep.hashes.length > 1 ? "s" : ""}
                        {best?.quality ? ` · ${best.quality}` : ""}
                        {best?.seeders ? ` · ${best.seeders} seeders` : ""}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Pressable
                        onPress={() => playable && openPlayer({
                          season: activeSeason,
                          episode: ep.episode_number,
                          hash: best.hash,
                          quality: best.quality,
                        })}
                        disabled={!playable}
                        style={({ pressed }) => ({
                          flex: 1, backgroundColor: playable ? "#8B5CF6" : "#CBD5E1",
                          borderRadius: 10, paddingVertical: 10,
                          flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                          opacity: pressed ? 0.85 : 1,
                        })}
                      >
                        <Ionicons name="play" size={14} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                          {playable ? "Play Best" : "Not Ready"}
                        </Text>
                      </Pressable>

                      {ep.hashes.length > 1 ? (
                        <Pressable
                          onPress={() => { Haptics.selectionAsync(); setBrowsingEpisode(ep); }}
                          style={({ pressed }) => ({
                            paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
                            backgroundColor: "#F1F5F9",
                            flexDirection: "row", alignItems: "center", gap: 6,
                            opacity: pressed ? 0.75 : 1,
                          })}
                        >
                          <Ionicons name="layers" size={14} color="#64748B" />
                          <Text style={{ color: "#475569", fontWeight: "700", fontSize: 12 }}>
                            {ep.hashes.length}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Similar */}
        {similar.data?.results && similar.data.results.length > 0 ? (
          <View style={{ marginTop: 32 }}>
            <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 17, paddingHorizontal: 16, marginBottom: 12 }}>
              Similar Shows
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {similar.data.results.slice(0, 12).map((s: any) => {
                const sid = s.tmdb_id ?? s.id;
                const sposter = s.poster || s.poster_path || PLACEHOLDER;
                return (
                  <Pressable
                    key={String(sid)}
                    onPress={() => { Haptics.selectionAsync(); router.push(`/tv/${sid}`); }}
                    style={({ pressed }) => ({ width: 110, opacity: pressed ? 0.75 : 1 })}
                  >
                    <Image
                      source={{ uri: sposter }}
                      style={{ width: 110, aspectRatio: 2 / 3, borderRadius: 10, backgroundColor: "#E2E8F0" }}
                      contentFit="cover"
                    />
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

      {/* Source browser bottom sheet */}
      {(browsingPack || browsingEpisode) ? (
        <SourceBrowser
          title={
            browsingPack
              ? `Season ${browsingPack.season} · ${browsingPack.packs.length} sources`
              : `S${String(activeSeason).padStart(2, "0")}E${String(browsingEpisode!.episode_number).padStart(2, "0")} · ${browsingEpisode!.hashes.length} sources`
          }
          hashes={browsingPack ? browsingPack.packs : browsingEpisode!.hashes}
          onClose={() => { setBrowsingPack(null); setBrowsingEpisode(null); }}
          onPlay={(hash) => {
            if (browsingPack) {
              // For pack, open the episode picker
              openPackPicker(hash.hash, hash.quality);
            } else {
              openPlayer({
                season: activeSeason,
                episode: browsingEpisode!.episode_number,
                hash: hash.hash,
                quality: hash.quality,
              });
            }
            setBrowsingPack(null);
            setBrowsingEpisode(null);
          }}
        />
      ) : null}

      {/* Episode picker bottom sheet for season packs */}
      {packPicker ? (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setPackPicker(null)} />
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "75%",
              paddingBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }}>
              <View>
                <Text style={{ fontWeight: "800", color: "#0F172A", fontSize: 15 }}>
                  Season {activeSeason} · {packPicker.quality}
                </Text>
                <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
                  {packFiles.length} episodes
                </Text>
              </View>
              <Pressable onPress={() => setPackPicker(null)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#64748B" />
              </Pressable>
            </View>

            {packLoading ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <ActivityIndicator color="#8B5CF6" />
                <Text style={{ color: "#64748B", marginTop: 8 }}>Loading episodes…</Text>
              </View>
            ) : packFiles.length === 0 ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ color: "#64748B" }}>No episodes found in this pack</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
                {packFiles.map((file: any) => {
                  const match = file.name?.match(/[Ss](\d+)[Ee](\d+)/);
                  const epLabel = match
                    ? `S${match[1].padStart(2, "0")}E${match[2].padStart(2, "0")}`
                    : `Episode`;
                  const titleMatch = file.name?.match(/[Ee]\d+\.(.+?)\.(1080p|720p|2160p|480p)/);
                  const epTitle = titleMatch ? titleMatch[1].replace(/\./g, " ") : "";

                  return (
                    <Pressable
                      key={file.id}
                      onPress={() => {
                        setPackPicker(null);
                        openPlayer({
                          season: activeSeason,
                          episode: match ? parseInt(match[2]) : 1,
                          hash: packPicker.hash,
                          quality: packPicker.quality,
                          file_id: file.id,
                        });
                      }}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: "#F8FAFC",
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                        opacity: pressed ? 0.85 : 1,
                      })}
                    >
                      <View style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ color: "#6D28D9", fontWeight: "800", fontSize: 12 }}>{epLabel}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ color: "#0F172A", fontWeight: "600", fontSize: 13 }} numberOfLines={1}>
                          {epTitle || `Episode ${match ? match[2] : ""}`}
                        </Text>
                        <Text style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>
                          {file.size_mb ? `${file.size_mb} MB` : ""}
                          {file.mimetype ? ` · ${file.mimetype.replace("video/", "").toUpperCase()}` : ""}
                        </Text>
                      </View>
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#8B5CF6", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="play" size={16} color="#fff" />
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      ) : null}

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

/* ---------- Source browser for browsing multiple hashes ---------- */
function SourceBrowser({
  title,
  hashes,
  onClose,
  onPlay,
}: {
  title: string;
  hashes: MovieHash[];
  onClose: () => void;
  onPlay: (hash: MovieHash) => void;
}) {
  const sorted = sortByScore(hashes);
  return (
    <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />
      <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "70%", paddingBottom: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }}>
          <Text style={{ fontWeight: "800", color: "#0F172A", fontSize: 15 }}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={22} color="#64748B" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
          {sorted.map((h, i) => {
            const playable = h.seeders > 0 || h.is_cached === 1;
            return (
              <View
                key={h.hash || i}
                style={{
                  padding: 12, borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 1.5,
                  borderColor: i === 0 && playable ? "#10B981" : "#E2E8F0",
                  opacity: playable ? 1 : 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: "#EDE9FE" }}>
                      <Text style={{ color: "#6D28D9", fontWeight: "800", fontSize: 11 }}>{h.quality.toUpperCase()}</Text>
                    </View>
                    {h.is_cached === 1 ? (
                      <View style={{ backgroundColor: "#DBEAFE", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: "#1D4ED8", fontSize: 9, fontWeight: "800" }}>CACHED</Text>
                      </View>
                    ) : null}
                    {h.seeders > 0 ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Ionicons name="people" size={11} color="#10B981" />
                        <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "700" }}>{h.seeders}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={{ color: "#64748B", fontSize: 11, marginTop: 6 }} numberOfLines={1}>
                    {h.hash.slice(0, 20)}…
                    {h.size_mb ? ` · ${Math.round(h.size_mb)} MB` : ""}
                    {h.episode_count ? ` · ${h.episode_count} eps` : ""}
                  </Text>
                </View>
                <Pressable
                  onPress={() => playable && onPlay(h)}
                  disabled={!playable}
                  style={({ pressed }) => ({
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: playable ? "#8B5CF6" : "#E2E8F0",
                    alignItems: "center", justifyContent: "center",
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Ionicons name="play" size={16} color="#fff" />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}


===== FILE: ./components/download/DownloadButton.tsx =====
import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  startDownload,
  useDownloadsStore,
  findDownloadForTitle,
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
  sizeMb?: number;
};

export default function DownloadButton(props: Props) {
  const { hash, tmdbId, mediaType, quality, title, poster, season, episode } = props;
  const [busy, setBusy] = useState(false);

  // Hide entirely when we don't have a valid hash
  if (!hash || hash.length < 32) return null;

  // Subscribe to the store so this component re-renders when the download changes
  const items = useDownloadsStore((s) => s.items);
  const existing = items.find(
    (x) =>
      x.hash.toLowerCase() === hash.toLowerCase() &&
      (mediaType !== "tv" || (x.season === season && x.episode === episode)),
  );

  const status = existing?.status;
  const progress = existing?.progress ?? 0;

  const onPress = async () => {
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
    if (status === "queued") {
      Alert.alert(
        "Still preparing",
        "TorBox is fetching this torrent. Check again in a few minutes from My Downloads.",
      );
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
      await startDownload({
        hash, tmdbId, mediaType, quality, title, poster, season, episode,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Download failed", e?.message || "Could not start download.");
    } finally {
      setBusy(false);
    }
  };

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
      style={({ pressed }) => ({
        width: 52, height: 52, borderRadius: 12,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        alignItems: "center", justifyContent: "center",
        opacity: pressed ? 0.75 : 1,
        position: "relative",
      })}
    >
      {busy ? (
        <ActivityIndicator color="#3B82F6" />
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


===== FILE: ./components/grid/GenreFilter.tsx =====
import { ScrollView, Text, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";

export type GenreChip = { id: number | string; name: string };

export default function GenreFilter({
  genres,
  selectedId,
  onSelect,
  accent = "#3B82F6",
}: {
  genres: GenreChip[];
  selectedId: number | string | null;
  onSelect: (id: number | string | null) => void;
  accent?: string;
}) {
  return (
    <View style={{ height: 48 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
          alignItems: "center",
          height: 48,
        }}
      >
        <Chip
          label="All"
          active={selectedId == null}
          onPress={() => {
            Haptics.selectionAsync();
            onSelect(null);
          }}
          accent={accent}
        />
        {genres.map((g) => (
          <Chip
            key={String(g.id)}
            label={g.name}
            active={selectedId === g.id}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(selectedId === g.id ? null : g.id);
            }}
            accent={accent}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  accent,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accent: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: active ? accent : "#fff",
        borderWidth: 1.5,
        borderColor: active ? accent : "#E2E8F0",
        opacity: pressed ? 0.7 : 1,
        shadowColor: active ? accent : "transparent",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      })}
    >
      <Text
        style={{
          color: active ? "#fff" : "#334155",
          fontWeight: "700",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}


===== FILE: ./components/grid/MediaGrid.tsx =====
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


===== FILE: ./components/HeroSection.tsx =====
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
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: "#3B82F6",
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Watch Now</Text>
          </Pressable>
          <Pressable
            onPress={open}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="information-circle-outline" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Details</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}


===== FILE: ./components/layout/AppHeader.tsx =====
import { View, Pressable, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import PincezLogo from "../brand/Logo";

export default function AppHeader() {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 44,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width,
      }}
    >
      <Pressable
        onPress={() => router.push("/")}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <PincezLogo height={44} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/search")}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.35)",
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Ionicons name="search" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}


===== FILE: ./components/MovieCard.tsx =====
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


===== FILE: ./components/MovieRow.tsx =====
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


===== FILE: ./components/TrailerPlayer.tsx =====
import { View, Text, Pressable, Modal, useWindowDimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

export default function TrailerPlayer({
  videoId,
  title,
  movieTitle,
  visible,
  onClose,
}: {
  videoId: string | null;
  title?: string;
  movieTitle?: string;
  visible: boolean;
  onClose: () => void;
}) {
  const { width } = useWindowDimensions();
  const height = (width * 9) / 16;

  const isWeb = Platform.OS === "web";

  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : "";

  const html = videoId
    ? `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  * { margin:0; padding:0; box-sizing:border-box; background:#000; }
  html, body { width:100%; height:100%; overflow:hidden; }
  iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:0; }
</style>
</head>
<body>
<iframe
  src="${embedSrc}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>
</body>
</html>`
    : "";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center" }}
      >
        <Pressable onPress={(e) => e.stopPropagation?.()} style={{ width: "100%" }}>
          <Pressable
            onPress={onClose}
            style={{
              position: "absolute",
              top: -56,
              right: 16,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>

          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }} numberOfLines={1}>
              {title || "Official Trailer"}
            </Text>
            {movieTitle ? (
              <Text style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }} numberOfLines={1}>
                {movieTitle}
              </Text>
            ) : null}
          </View>

          <View style={{ width, height, backgroundColor: "#000" }}>
            {videoId ? (
              isWeb ? (
                // Web: native browser iframe (react-native-webview doesn't work here)
                <iframe
                  width="100%"
                  height="100%"
                  src={embedSrc}
                  title={title || "Trailer"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: "none" }}
                />
              ) : (
                // Native (iOS/Android): WebView
                <WebView
                  source={{ html }}
                  style={{ flex: 1, backgroundColor: "#000" }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled
                  domStorageEnabled
                  originWhitelist={["*"]}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
              )
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#94A3B8" }}>No trailer available</Text>
              </View>
            )}
          </View>

          <Text style={{ color: "#64748B", textAlign: "center", fontSize: 11, marginTop: 16 }}>
            Tap outside the player to close
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}


===== FILE: ./eas.json =====
{
  "cli": {
    "version": ">= 24.10.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}


===== FILE: ./global.css =====
@tailwind base;
@tailwind components;
@tailwind utilities;


===== FILE: ./index.ts =====
import 'expo-router/entry';


===== FILE: ./metro.config.js =====
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = config;


===== FILE: ./nativewind-env.d.ts =====
/// <reference types="nativewind/types" />

// NOTE: This file should not be edited and should be committed with your source code. It is generated by NativeWind.

===== FILE: ./package.json =====
{
  "name": "movieflix-rn",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@expo/metro-runtime": "~57.0.16",
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@tanstack/react-query": "^5.103.1",
    "axios": "^1.20.0",
    "expo": "~57.0.24",
    "expo-constants": "~57.0.19",
    "expo-file-system": "~57.0.7",
    "expo-haptics": "~57.0.3",
    "expo-image": "~57.0.5",
    "expo-linear-gradient": "~57.0.2",
    "expo-linking": "~57.0.10",
    "expo-router": "~57.0.22",
    "expo-secure-store": "~57.0.4",
    "expo-sharing": "~57.0.21",
    "expo-status-bar": "~57.0.1",
    "expo-video": "~57.0.4",
    "nativewind": "^4.2.7",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-native": "0.86.3",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "^0.21.2",
    "react-native-webview": "13.16.1",
    "react-native-worklets": "0.10.1",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "babel-preset-expo": "^57.0.12",
    "prettier-plugin-tailwindcss": "^0.8.1",
    "tailwindcss": "^3.4.17",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "private": true
}


===== FILE: ./src/context/AuthContext.tsx =====
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Store as SecureStore } from '../utils/secureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/api';

export interface AuthUser {
  id: string | number;
  email: string;
  display_name: string;
  is_admin?: number;
}

type AuthCtx = {
  currentUser: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
};

const AuthContext = createContext<AuthCtx | null>(null);

const TOKEN_KEY = 'movieflix_token';
const USER_KEY = 'movieflix_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (t && u) {
          setToken(t);
          setCurrentUser(JSON.parse(u));

          // Validate with /api/auth/me
          try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${t}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.user) {
                setCurrentUser(data.user);
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
              }
            } else if (res.status === 401) {
              // Token expired — clear
              await SecureStore.deleteItemAsync(TOKEN_KEY);
              await AsyncStorage.removeItem(USER_KEY);
              setToken(null);
              setCurrentUser(null);
            }
          } catch {
            // Network error — keep local session
          }
        }
      } catch (e) {
        console.warn('auth restore failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (t: string, u: AuthUser) => {
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setCurrentUser(u);
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
    await persist(data.token, data.user);
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Signup failed');
    // Signup doesn't return a token — log in right after
    await login(email, password);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setToken(null);
    setCurrentUser(null);
  };

  const getAuthHeaders = (): Record<string, string> =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, signup, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}


===== FILE: ./src/services/api.ts =====
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ap.pincez.xyz';

export { API_URL };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as any)?.error || `Request failed: ${res.status}`);
  return data as T;
}

// ============================================================
// Types
// ============================================================
export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id?: number;
  tmdb_id?: number;
  title?: string;
  name?: string;
  poster?: string;
  poster_path?: string;
  backdrop?: string;
  backdrop_path?: string;
  overview?: string;
  rating?: number;
  vote_average?: number;
  year?: string | number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Array<{
    season_number: number;
    episode_count?: number;
    name?: string;
    air_date?: string;
    poster_path?: string;
  }>;
  genres?: Array<{ id: number; name: string } | string>;
  media_type?: MediaType;
  type?: MediaType;
  [key: string]: any;
}

export interface MovieHash {
  id?: number;
  hash: string;
  info_hash?: string;
  quality: string;
  size_mb: number;
  seeders: number;
  is_cached: number;
  source?: string;
  isSeasonPack?: boolean;
  episode_count?: number;
  season?: number;
  season_number?: number;
  episode_number?: number;
  filename?: string;
  created_at?: string;
  // Extra fields for torrent files
  name?: string;
  mimetype?: string;
  size?: number;
  isTorrentFile?: boolean;
}

export interface SeasonPack {
  season_number: number;
  packs: Array<{
    id?: number;
    info_hash: string;
    quality: string;
    size_mb: number;
    seeders: number;
    is_cached: number;
    episode_count: number;
  }>;
}

export interface Episode {
  episode_number: number;
  season_number: number;
  name?: string;
  title?: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
}

export interface QualityGroup {
  quality: string;
  hashes: MovieHash[];
  totalHashes: number;
  playableHashes: number;
}

export interface StreamResult {
  success: boolean;
  streamUrl?: string;
  quality?: string;
  size?: number;
  fileSize?: number;
  seeders?: number;
  filename?: string;
  hash?: string;
  torrentId?: number;
  status?: string;
  message?: string;
  error?: string;
  expiresIn?: number;
  expiresAt?: string;
  isProxied?: boolean;
  mediaInfo?: {
    audioCodec?: string;
    videoCodec?: string;
    container?: string;
    audioCompatible?: boolean;
    videoCompatible?: boolean;
    fullyCompatible?: boolean;
  } | null;
  warning?: { type?: string; codec?: string; message?: string; suggestion?: string } | null;
}

// ============================================================
// Helpers
// ============================================================
export function pickList<T = MediaItem>(res: any): T[] {
  if (!res) return [];
  return (
    res.results ||
    res.movies ||
    res.tv_shows ||
    res.items ||
    (Array.isArray(res) ? res : [])
  );
}

export function groupHashesByQuality(hashes: MovieHash[]): QualityGroup[] {
  const map = new Map<string, MovieHash[]>();
  for (const h of hashes) {
    const key = h.quality || 'unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(h);
  }
  const groups: QualityGroup[] = [];
  for (const [quality, list] of map.entries()) {
    groups.push({
      quality,
      hashes: list,
      totalHashes: list.length,
      playableHashes: list.filter((h) => h.seeders > 0 || h.is_cached === 1).length,
    });
  }
  const order = ['2160p', '1080p', '720p', '480p', '360p'];
  groups.sort((a, b) => {
    const ai = order.indexOf(a.quality);
    const bi = order.indexOf(b.quality);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  return groups;
}

export function sortHashesByScore(hashes: MovieHash[]): MovieHash[] {
  return [...hashes].sort((a, b) => {
    const aScore = (a.is_cached ? 1000 : 0) + (a.seeders || 0);
    const bScore = (b.is_cached ? 1000 : 0) + (b.seeders || 0);
    return bScore - aScore;
  });
}

// ============================================================
// API
// ============================================================

export interface ListItem {
  content_id: number;
  content_type: MediaType;
  season_number?: number | null;
  episode_number?: number | null;
  added_at?: string;
}

export async function hydrateListItems(items: ListItem[]): Promise<MediaItem[]> {
  // For each item, fetch /api/movie/{id} or /api/tv/{id}
  const results = await Promise.all(
    items.map(async (it) => {
      try {
        const segment = it.content_type === 'tv' ? 'tv' : 'movie';
        const res = await request<any>(`/api/${segment}/${it.content_id}`);
        const payload = res?.movie || res?.tv_show || res?.data || res;
        if (!payload) return null;
        return {
          ...payload,
          id: payload.tmdb_id ?? payload.id ?? it.content_id,
          tmdb_id: payload.tmdb_id ?? payload.id ?? it.content_id,
          type: it.content_type,
        } as MediaItem;
      } catch {
        return null;
      }
    }),
  );
  return results.filter(Boolean) as MediaItem[];
}

export const api = {
  // ---------------- Home / lists ----------------
  trending: () => request<{ success: boolean; results: MediaItem[] }>('/api/trending'),
  movies: (page = 1) =>
    request<{ success: boolean; movies: MediaItem[]; total_pages?: number }>(
      `/api/movies?page=${page}&type=popular`,
    ),
  series: (page = 1) =>
    request<{ success: boolean; tv_shows: MediaItem[]; total_pages?: number }>(
      `/api/tv-shows?page=${page}&type=popular`,
    ),
  search: (q: string, page = 1) =>
    request<{ success: boolean; results: MediaItem[] }>(
      `/api/search?q=${encodeURIComponent(q)}&page=${page}`,
    ),

  // ---------------- Detail ----------------
  detail: async (type: MediaType, id: string | number): Promise<MediaItem> => {
    const segment = type === 'tv' ? 'tv' : 'movie';
    const res = await request<any>(`/api/${segment}/${id}`);
    const payload = res?.movie || res?.tv_show || res?.data || res;
    if (payload && typeof payload === 'object' && (payload.id || payload.tmdb_id)) {
      return payload;
    }
    throw new Error('Detail not available');
  },

  // ---------------- Movie hashes ----------------
  movieHashes: async (tmdbId: number | string): Promise<MovieHash[]> => {
    const res = await request<{ success: boolean; hashes: any[] }>(
      `/api/admin/movie/hashes-legacy/${tmdbId}`,
    );
    return (res?.hashes || []).map((h) => ({
      id: h.id,
      hash: h.info_hash || h.hash,
      info_hash: h.info_hash,
      quality: h.quality || '1080p',
      size_mb: h.size_mb || 0,
      seeders: h.seeders || 0,
      is_cached: h.is_cached || 0,
      source: 'd1',
    }));
  },

  // ---------------- TV season packs ----------------
  tvSeasonPacks: (tmdbId: number | string) =>
    request<{ success: boolean; tmdb_id: number; seasons: SeasonPack[]; total_packs?: number }>(
      `/api/tv/season-packs/${tmdbId}`,
    ),

  tvSeasonEpisodes: async (tmdbId: number | string, season: number): Promise<Episode[]> => {
    const res = await request<{ episodes?: Episode[] }>(
      `/api/tv/${tmdbId}/season/${season}`,
    );
    return res?.episodes || [];
  },

  tvEpisodeHashes: async (tmdbId: number | string): Promise<MovieHash[]> => {
    try {
      const res = await request<{ success: boolean; hashes: any[] }>(
        `/api/admin/tv/hashes?tmdb_id=${tmdbId}&limit=500`,
      );
      const raw = res?.hashes || [];
      return raw.map((h: any) => ({
        id: h.id,
        hash: h.info_hash || h.hash,
        info_hash: h.info_hash,
        quality: h.quality || '1080p',
        size_mb: h.size_mb || 0,
        seeders: h.seeders || 0,
        is_cached: h.is_cached || 0,
        season: h.season_number,
        season_number: h.season_number,
        episode_number: h.episode_number,
        episode_count: h.episode_count,
        filename: h.filename,
        source: 'd1',
      }));
    } catch {
      return [];
    }
  },

  // ---------------- Torrent files (season packs unzipped) ----------------
  torrentFiles: async (hash: string): Promise<MovieHash[]> => {
    try {
      const res = await request<{ success: boolean; files: any[]; name?: string; size?: number }>(
        `/api/torrent/files?hash=${encodeURIComponent(hash)}`,
      );
      return (res?.files || []).map((f: any) => ({
        id: f.id,
        hash, // parent hash
        quality: '',
        size_mb: f.size_mb || 0,
        seeders: 0,
        is_cached: 1,
        name: f.name,
        mimetype: f.mimetype,
        size: f.size,
        isTorrentFile: true,
      } as MovieHash));
    } catch {
      return [];
    }
  },

  // ---------------- Credits / similar / videos ----------------
  movieCredits: (id: number | string) =>
    request<{ cast?: any[]; crew?: any[] }>(`/api/movie/${id}/credits`),
  movieSimilar: (id: number | string) =>
    request<{ results?: MediaItem[] }>(`/api/movie/${id}/similar`),
  movieVideos: (id: number | string) =>
    request<{ videos?: any[] }>(`/api/movie/${id}/videos`),
  tvCredits: (id: number | string) =>
    request<{ cast?: any[]; crew?: any[] }>(`/api/tv/${id}/credits`),
  tvSimilar: (id: number | string) =>
    request<{ results?: MediaItem[] }>(`/api/tv/${id}/similar`),
  tvVideos: (id: number | string) =>
    request<{ videos?: any[] }>(`/api/tv/${id}/videos`),

  // ---------------- Streaming ----------------
  streamMovie: async (id: number | string, quality = '1080p', hash?: string): Promise<StreamResult> => {
    if (hash) {
      try {
        const res = await request<StreamResult>(`/api/stream/hash?hash=${hash}&type=movie&force=true`);
        if (res?.streamUrl) return res;
      } catch (e) {
        console.warn('hash stream failed, falling back', e);
      }
    }
    return request<StreamResult>(`/api/stream/movie/${id}?quality=${quality}`);
  },

  streamTV: async (
    id: number | string,
    season: number,
    episode: number,
    quality = '1080p',
    hash?: string,
  ): Promise<StreamResult> => {
    if (hash) {
      try {
        const res = await request<StreamResult>(`/api/stream/hash?hash=${hash}&type=tv&force=true`);
        if (res?.streamUrl) return res;
      } catch (e) {
        console.warn('hash stream failed, falling back', e);
      }
    }
    return request<StreamResult>(
      `/api/stream/tv/${id}/season/${season}/episode/${episode}?quality=${quality}`,
    );
  },

  // Stream a specific file inside a season pack
  streamTorrentFile: (
    hash: string,
    fileId: number | string,
    quality = '1080p',
  ) =>
    request<StreamResult>(
      `/api/stream/hash?hash=${encodeURIComponent(hash)}&type=tv&force=true&file_id=${fileId}&quality=${quality}`,
    ),

  // ---------------- User lists ----------------
  watchlist: (headers: Record<string, string>) =>
    request<{ success: boolean; watchlist: MediaItem[] }>('/api/watchlist', { headers }),
  favorites: (headers: Record<string, string>) =>
    request<{ success: boolean; favorites: MediaItem[] }>('/api/favorites', { headers }),
  toggleWatchlist: (
    contentId: number,
    inList: boolean,
    contentType: MediaType,
    headers: Record<string, string>,
  ) =>
    request<{ success: boolean }>(`/api/watchlist`, {
      method: inList ? 'DELETE' : 'POST',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),
  toggleFavorites: (
    contentId: number,
    inList: boolean,
    contentType: MediaType,
    headers: Record<string, string>,
  ) =>
    request<{ success: boolean }>(`/api/favorites`, {
      method: inList ? 'DELETE' : 'POST',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),
  // ---------------- Lists ----------------
  getWatchlist: (headers: Record<string, string>) =>
    request<{ success: boolean; watchlist: ListItem[] }>('/api/watchlist', { headers }),

  getFavorites: (headers: Record<string, string>) =>
    request<{ success: boolean; favorites: ListItem[] }>('/api/favorites', { headers }),

  addToWatchlist: (contentId: number, contentType: MediaType, headers: Record<string, string>) =>
    request<{ success: boolean }>('/api/watchlist', {
      method: 'POST',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),

  removeFromWatchlist: (contentId: number, contentType: MediaType, headers: Record<string, string>) =>
    request<{ success: boolean }>('/api/watchlist', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),

  addToFavorites: (contentId: number, contentType: MediaType, headers: Record<string, string>) =>
    request<{ success: boolean }>('/api/favorites', {
      method: 'POST',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),

  removeFromFavorites: (contentId: number, contentType: MediaType, headers: Record<string, string>) =>
    request<{ success: boolean }>('/api/favorites', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ contentId, contentType }),
    }),
};




===== FILE: ./src/services/downloads.ts =====
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { create } from "zustand";
import { API_URL } from "./api";
import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";

// ============================================================
// Types
// ============================================================
export interface DownloadItem {
  id: string;              // `${hash}:${fileId}`
  hash: string;
  fileId: number;
  torrentId: number;
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  poster?: string;
  quality: string;
  sizeMb: number;
  localUri: string;        // file:///.../Downloads/<id>.mkv
  downloadedAt: number;
  status: "queued" | "downloading" | "completed" | "failed";
  progress: number;        // 0–100
  error?: string;
}

// ============================================================
// Paths
// ============================================================
const BASE_DIR = `${FileSystem.documentDirectory}movieflix/`;
const VIDEO_DIR = `${BASE_DIR}videos/`;
const META_DIR = `${BASE_DIR}meta/`;

async function ensureDirs() {
  const info1 = await FileSystem.getInfoAsync(BASE_DIR);
  if (!info1.exists) await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });

  const info2 = await FileSystem.getInfoAsync(VIDEO_DIR);
  if (!info2.exists) await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true });

  const info3 = await FileSystem.getInfoAsync(META_DIR);
  if (!info3.exists) await FileSystem.makeDirectoryAsync(META_DIR, { intermediates: true });
}

function metaPath(id: string) { return `${META_DIR}${id}.json`; }
function videoPath(id: string, ext: string = "mkv") { return `${VIDEO_DIR}${id}.${ext}`; }

// ============================================================
// Zustand store
// ============================================================
type DownloadsState = {
  items: DownloadItem[];
  loaded: boolean;
  setItems: (items: DownloadItem[]) => void;
  upsert: (item: DownloadItem) => void;
  remove: (id: string) => void;
  updateProgress: (id: string, progress: number, status?: DownloadItem["status"]) => void;
};

export const useDownloadsStore = create<DownloadsState>((set) => ({
  items: [],
  loaded: false,
  setItems: (items) => set({ items, loaded: true }),
  upsert: (item) =>
    set((s) => {
      const idx = s.items.findIndex((x) => x.id === item.id);
      if (idx === -1) return { items: [item, ...s.items] };
      const copy = [...s.items];
      copy[idx] = item;
      return { items: copy };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
  updateProgress: (id, progress, status) =>
    set((s) => ({
      items: s.items.map((x) =>
        x.id === id ? { ...x, progress, status: status || x.status } : x,
      ),
    })),
}));

// ============================================================
// Metadata helpers
// ============================================================
async function saveMeta(item: DownloadItem) {
  await ensureDirs();
  await FileSystem.writeAsStringAsync(metaPath(item.id), JSON.stringify(item));
}

async function loadMeta(id: string): Promise<DownloadItem | null> {
  try {
    const info = await FileSystem.getInfoAsync(metaPath(id));
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(metaPath(id));
    return JSON.parse(raw) as DownloadItem;
  } catch {
    return null;
  }
}

async function deleteMeta(id: string) {
  try {
    await FileSystem.deleteAsync(metaPath(id), { idempotent: true });
  } catch {}
}

// ============================================================
// List all downloads
// ============================================================
export async function loadAllDownloads(): Promise<DownloadItem[]> {
  await ensureDirs();
  try {
    const files = await FileSystem.readDirectoryAsync(META_DIR);
    const items: DownloadItem[] = [];
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      const id = f.replace(".json", "");
      const item = await loadMeta(id);
      if (!item) continue;

      // Verify file still exists
      const videoInfo = await FileSystem.getInfoAsync(item.localUri);
      if (!videoInfo.exists) {
        // Cleanup orphaned metadata
        await deleteMeta(id);
        continue;
      }
      items.push(item);
    }
    return items.sort((a, b) => b.downloadedAt - a.downloadedAt);
  } catch {
    return [];
  }
}

// ============================================================
// Download status polling
// ============================================================
export async function pollDownloadStatus(torrentId: number): Promise<{
  completed: boolean;
  files: Array<{ id: number; name: string; size: number; size_mb: number; mimetype: string }>;
}> {
  try {
    const res = await fetch(`${API_URL}/api/download/status?torrent_id=${torrentId}`);
    const data = await res.json();
    return {
      completed: !!data.completed,
      files: data.files || [],
    };
  } catch {
    return { completed: false, files: [] };
  }
}

// ============================================================
// Start a download (queue on TorBox, get file URL, save locally)
// ============================================================
export async function startDownload(opts: {
  hash: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  quality: string;
  title: string;
  poster?: string;
  season?: number;
  episode?: number;
}): Promise<void> {
  if (IS_WEB) {
    throw new Error("Downloads are only available in the mobile app");
  }
  const { hash, tmdbId, mediaType, quality, title, poster, season, episode } = opts;
  const store = useDownloadsStore.getState();

  // 1. Ask backend to prepare (TorBox queue)
  const prepareUrl = new URL(`${API_URL}/api/download`);
  prepareUrl.searchParams.set("hash", hash);
  prepareUrl.searchParams.set("type", mediaType);
  prepareUrl.searchParams.set("tmdb_id", String(tmdbId));
  prepareUrl.searchParams.set("quality", quality);
  if (season != null) prepareUrl.searchParams.set("season", String(season));
  if (episode != null) prepareUrl.searchParams.set("episode", String(episode));

  const prepRes = await fetch(prepareUrl.toString());
  const prep = await prepRes.json();

  // TorBox doesn't have it yet — return with queued state
  if (!prep.success && prep.status === "queued") {
    const tempId = `${hash}:pending`;
    store.upsert({
      id: tempId,
      hash,
      fileId: -1,
      torrentId: prep.torrentId,
      tmdbId,
      mediaType,
      season,
      episode,
      title,
      poster,
      quality,
      sizeMb: 0,
      localUri: "",
      downloadedAt: Date.now(),
      status: "queued",
      progress: 0,
      error: "TorBox is preparing this download. Check back in a few minutes.",
    });
    return;
  }

  // Ready immediately
  if (prep.success && Array.isArray(prep.files) && prep.files.length > 0) {
    await finishDownload({
      torrentId: prep.torrentId,
      file: prep.files.find((f: any) => (f.mimetype || "").includes("video")) || prep.files[0],
      hash, tmdbId, mediaType, quality, title, poster, season, episode,
    });
    return;
  }

  throw new Error(prep.error || "Download could not be started");
}

// ============================================================
// Poll queued downloads every few seconds until ready, then save
// ============================================================
export async function resumeQueuedDownloads(): Promise<void> {
  const store = useDownloadsStore.getState();
  const queued = store.items.filter((x) => x.status === "queued" && x.torrentId > 0);

  for (const item of queued) {
    const status = await pollDownloadStatus(item.torrentId);
    if (status.completed && status.files.length > 0) {
      const file = status.files.find((f) => (f.mimetype || "").includes("video")) || status.files[0];
      // Remove old queued entry
      await deleteMeta(item.id).catch(() => {});
      store.remove(item.id);
      // Start actual download
      await finishDownload({
        torrentId: item.torrentId,
        file,
        hash: item.hash,
        tmdbId: item.tmdbId,
        mediaType: item.mediaType,
        quality: item.quality,
        title: item.title,
        poster: item.poster,
        season: item.season,
        episode: item.episode,
      });
    }
  }
}

// ============================================================
// Actually download the file
// ============================================================
async function finishDownload(opts: {
  torrentId: number;
  file: { id: number; name: string; size_mb?: number; size?: number };
  hash: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  quality: string;
  title: string;
  poster?: string;
  season?: number;
  episode?: number;
}) {
  const { torrentId, file, hash, tmdbId, mediaType, quality, title, poster, season, episode } = opts;
  const store = useDownloadsStore.getState();

  const id = `${hash}:${file.id}`;
  await ensureDirs();

  // Determine extension from filename
  const ext = (file.name.split(".").pop() || "mkv").toLowerCase();
  const localUri = videoPath(id, ext);

  // Create initial "downloading" entry
  const downloadItem: DownloadItem = {
    id,
    hash,
    fileId: file.id,
    torrentId,
    tmdbId,
    mediaType,
    season,
    episode,
    title,
    poster,
    quality,
    sizeMb: file.size_mb || Math.round((file.size || 0) / 1024 / 1024),
    localUri,
    downloadedAt: Date.now(),
    status: "downloading",
    progress: 0,
  };
  store.upsert(downloadItem);
  await saveMeta(downloadItem);

  // 1. Get the proxied download URL from backend
  const fileRes = await fetch(
    `${API_URL}/api/download/file?torrent_id=${torrentId}&file_id=${file.id}`,
  );
  const fileData = await fileRes.json();
  if (!fileData.success || !fileData.downloadUrl) {
    const failed = { ...downloadItem, status: "failed" as const, error: fileData.error || "Could not get download URL" };
    store.upsert(failed);
    await saveMeta(failed);
    throw new Error(fileData.error || "Could not get download URL");
  }

  // 2. Download to local file with progress
  const downloadResumable = FileSystem.createDownloadResumable(
    fileData.downloadUrl,
    localUri,
    {},
    (progress) => {
      const total = progress.totalBytesExpectedToWrite || 1;
      const pct = Math.min(99, Math.round((progress.totalBytesWritten / total) * 100));
      store.updateProgress(id, pct, "downloading");
    },
  );

  try {
    const result = await downloadResumable.downloadAsync();
    if (!result || !result.uri) throw new Error("Download did not complete");

    const done = {
      ...downloadItem,
      status: "completed" as const,
      progress: 100,
      localUri: result.uri,
      downloadedAt: Date.now(),
    };
    store.upsert(done);
    await saveMeta(done);
  } catch (err: any) {
    const failed = { ...downloadItem, status: "failed" as const, error: err?.message || "Download failed" };
    store.upsert(failed);
    await saveMeta(failed);
    throw err;
  }
}

// ============================================================
// Delete a download
// ============================================================
export async function deleteDownload(id: string): Promise<void> {
  const store = useDownloadsStore.getState();
  const item = store.items.find((x) => x.id === id);
  if (item?.localUri) {
    try {
      await FileSystem.deleteAsync(item.localUri, { idempotent: true });
    } catch {}
  }
  await deleteMeta(id);
  store.remove(id);
}

// ============================================================
// Export (share sheet)
// ============================================================
export async function exportDownload(id: string): Promise<void> {
  const store = useDownloadsStore.getState();
  const item = store.items.find((x) => x.id === id);
  if (!item) throw new Error("Download not found");
  if (item.status !== "completed") throw new Error("Download not complete yet");

  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error("Sharing is not available on this device");

  await Sharing.shareAsync(item.localUri, {
    mimeType: "video/*",
    dialogTitle: "Export " + item.title,
    UTI: "public.movie",
  });
}

// ============================================================
// Get local URI for offline playback
// ============================================================
export async function getLocalVideoUri(hash: string, fileId?: number): Promise<string | null> {
  const store = useDownloadsStore.getState();
  const candidates = store.items.filter(
    (x) =>
      x.hash.toLowerCase() === hash.toLowerCase() &&
      x.status === "completed" &&
      (fileId == null || x.fileId === fileId),
  );
  return candidates.length > 0 ? candidates[0].localUri : null;
}

// ============================================================
// Find a completed download for a tmdbId (loose match)
// ============================================================
export function findDownloadForTitle(
  tmdbId: number,
  mediaType: "movie" | "tv",
  season?: number,
  episode?: number,
): DownloadItem | null {
  const store = useDownloadsStore.getState();
  const match = store.items.find(
    (x) =>
      x.tmdbId === tmdbId &&
      x.mediaType === mediaType &&
      x.status === "completed" &&
      (season == null || x.season === season) &&
      (episode == null || x.episode === episode),
  );
  return match || null;
}


===== FILE: ./src/utils/secureStore.ts =====
import { Platform } from "react-native";

const webStore = {
  async getItemAsync(key: string): Promise<string | null> {
    try {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    } catch { return null; }
  },
  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
    } catch {}
  },
  async deleteItemAsync(key: string): Promise<void> {
    try {
      if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    } catch {}
  },
};

let nativeStore: any = null;
if (Platform.OS !== "web") {
  nativeStore = require("expo-secure-store");
}

export const Store = Platform.OS === "web" ? webStore : nativeStore;


===== FILE: ./tailwind.config.js =====
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        'bg-primary': '#F8FAFC',
        'text-primary': '#0F172A',
      }
    }
  },
  plugins: [],
}


===== FILE: ./tsconfig.json =====
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}

