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
      android_ripple={{ color: "rgba(0,0,0,0.1)" }} style={{ paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: active ? accent : "#fff",
        borderWidth: 1.5,
        borderColor: active ? accent : "#E2E8F0",
        
        shadowColor: active ? accent : "transparent",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 } }}
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
