import { IV_BLOCK_PASSWD, KEY_DECRYPT_PASSWD } from "../config/api";

var crypto = require("crypto");

const encrypt = async (plaintText) => {
  const iv = IV_BLOCK_PASSWD;
  const key = KEY_DECRYPT_PASSWD;
  const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedMsg = encrypter.update(plaintText, "utf8", "hex");
  encryptedMsg += encrypter.final("hex");
  return encryptedMsg;
};

export default encrypt;
