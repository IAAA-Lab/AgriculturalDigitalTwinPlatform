import { IV_BLOCK_PASSWD, KEY_DECRYPT_PASSWD } from "../config/api";

var crypto = require("crypto");

const encrypt = async (password) => {
  const iv = KEY_DECRYPT_PASSWD;
  const key = IV_BLOCK_PASSWD;
  const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedMsg = encrypter.update(password, "utf8", "hex");
  encryptedMsg += encrypter.final("hex");
  return encryptedMsg;
};

export default encrypt;
