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
