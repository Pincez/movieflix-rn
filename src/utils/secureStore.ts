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
