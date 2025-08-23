import CryptoJS from "crypto-js";

const SECRET_KEY = "mysecretkey"; // replace with your own secret

export const encryptData = (data: any): string => {
  try {
    const stringData = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
    return ciphertext;
  } catch (err) {
    console.error("Encryption error:", err);
    return "";
  }
};

export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
};
