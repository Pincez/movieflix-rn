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
