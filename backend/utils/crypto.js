import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.CRYPTO_SECRET;

export const encryptResponse = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  return ciphertext;
};

export const decryptRequest = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};