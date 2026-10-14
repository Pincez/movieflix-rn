import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Mark from "../assets/brand/mark.svg";

const BG = "#05070a";
const MOTTO = "Entertainment. Unfiltered.";

// --- Konami-style timing ---
const SCALE_IN_MS   = 1800;  // logo grows from 0.8 to 1.0
const FADE_IN_MS    = 1200;  // logo fades from transparent to solid
const MOTTO_IN_MS   = 900;   // motto fades in after the logo settles
const HOLD_MS       = 3500;  // the classic "hold" after everything is up
const FADE_OUT_MS   = 700;   // whole screen fades out

// Motto starts this long after mount — must be >= SCALE_IN_MS so the
// logo has already stopped growing when the text appears.
const MOTTO_DELAY_MS = 2000;

export default function SplashIndex() {
  const scale            = useRef(new Animated.Value(0.8)).current;
  const logoOpacity      = useRef(new Animated.Value(0)).current;
  const glowOpacity      = useRef(new Animated.Value(0)).current;
  const mottoOpacity     = useRef(new Animated.Value(0)).current;
  const mottoTranslateY  = useRef(new Animated.Value(8)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo scales up + fades in.
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: SCALE_IN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Glow pulses briefly for the "power on" feel.
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.55,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.18,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // 3. Motto fades + slides up, after the logo has settled.
    const mottoTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(mottoOpacity, {
          toValue: 1,
          duration: MOTTO_IN_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(mottoTranslateY, {
          toValue: 0,
          duration: MOTTO_IN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, MOTTO_DELAY_MS);

    // 4. Hide the native splash after our JS splash is painted.
    const hideNative = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 50);

    // 5. After the full timeline, fade out and go to the app.
    const total = SCALE_IN_MS + HOLD_MS;
    const proceed = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(tabs)");
      });
    }, total);

    return () => {
      clearTimeout(hideNative);
      clearTimeout(mottoTimer);
      clearTimeout(proceed);
    };
  }, [scale, logoOpacity, glowOpacity, mottoOpacity, mottoTranslateY, containerOpacity]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Soft radial glow behind the logo */}
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { opacity: glowOpacity }]}
      />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale }],
        }}
      >
        <Mark width={200} height={200} />
      </Animated.View>

      {/* Motto — fades in after the logo settles */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: "22%",
          opacity: mottoOpacity,
          transform: [{ translateY: mottoTranslateY }],
        }}
        pointerEvents="none"
      >
        <Text style={styles.motto}>{MOTTO}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#3B82F6",
  },
  motto: {
    color: "#8892A6",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 3.2,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
