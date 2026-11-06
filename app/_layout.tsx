// import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../src/context/AuthContext";
import { LivePatch } from "react-native-livepatch";

LivePatch.configure({
  updateUrl: "https://github.com/Pincez/movieflix-rn/releases/latest/download",
  channel: "production",
});

// Keep the native splash visible until app/index.tsx tells it to go away.
// This must run at module scope — before React mounts — otherwise the
// native splash will auto-hide on the first render and you'll see a flash
// between the native splash and the JS splash.
SplashScreen.preventAutoHideAsync().catch(() => {});

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
