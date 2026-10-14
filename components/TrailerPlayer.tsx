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
