import { IV_BLOCK_PASSWD, KEY_DECRYPT_PASSWD } from "../config/constants";
import CryptoJS from "crypto-js";

const encrypt = async (plaintText: string) => {
  const iv = IV_BLOCK_PASSWD;
  const key = KEY_DECRYPT_PASSWD;
  // Encrypt with aes-256-cbc with crypto-js and utf8 encoding
  const encryptedMsg = CryptoJS.AES.encrypt(
    plaintText,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return encryptedMsg;
};

export default encrypt;
