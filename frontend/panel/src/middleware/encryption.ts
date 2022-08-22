import { IV_BLOCK_PASSWD, KEY_DECRYPT_PASSWD } from "contexts/contants";

import crypto from "crypto-js";

const encrypt = (plaintText: string): string => {
  const key = crypto.enc.Utf8.parse(KEY_DECRYPT_PASSWD!);
  const iv = crypto.enc.Utf8.parse(IV_BLOCK_PASSWD!);
  const encryptedMsg = crypto.AES.encrypt(plaintText, key, {
    iv,
    mode: crypto.mode.CBC,
  });
  return crypto.enc.Hex.stringify(encryptedMsg.ciphertext);
};

const decrypt = (encryptedText: string): string => {
  const key = crypto.enc.Utf8.parse(KEY_DECRYPT_PASSWD!);
  const iv = crypto.enc.Utf8.parse(IV_BLOCK_PASSWD!);
  const decryptedMsg = crypto.AES.decrypt(encryptedText, key, {
    iv,
    mode: crypto.mode.CBC,
  });
  return crypto.enc.Hex.stringify(decryptedMsg);
};

export default encrypt;
