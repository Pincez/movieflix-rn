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
