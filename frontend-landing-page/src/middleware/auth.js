var crypto = require("crypto");

const encrypt = async (password) => {
  const iv = "79b67e539e7fcaef";
  const key = "c38036f65157cb6db0e8fd855aa28ade";
  const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedMsg = encrypter.update(password, "utf8", "hex");
  encryptedMsg += encrypter.final("hex");
  return encryptedMsg;
};

export default encrypt;
