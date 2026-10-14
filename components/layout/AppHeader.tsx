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
