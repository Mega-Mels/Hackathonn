import CryptoJS from "crypto-js";


export function encryptJson(json: object, keyHex: string) {
const iv = CryptoJS.lib.WordArray.random(16);
const key = CryptoJS.enc.Hex.parse(keyHex);
const plaintext = CryptoJS.enc.Utf8.parse(JSON.stringify(json));
const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv });
return {
ivBase64: CryptoJS.enc.Base64.stringify(iv),
ciphertextBase64: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
};
}