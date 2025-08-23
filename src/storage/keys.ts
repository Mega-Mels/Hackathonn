import * as SecureStore from "expo-secure-store";
import * as ExpoCrypto from "expo-crypto";


const KEY_NAME = "sr_key_v1";


export async function getOrCreateKeyHex(): Promise<string> {
let key = await SecureStore.getItemAsync(KEY_NAME);
if (!key) {
const bytes = await ExpoCrypto.getRandomBytesAsync(32); // 256-bit
key = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
await SecureStore.setItemAsync(KEY_NAME, key, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}
return key;
}