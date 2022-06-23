const express = require("express");
const app = express();
const path = require("path");

const router = express.Router();
const upload = require("./middleware/upload_mw");
const Resize = require("./Resize");

router.post("/", upload.single("image"), async function (req, res) {
  const imagePath = path.join(__dirname, "/data/img");
  const fileUpload = new Resize(imagePath);
  console.log(req);
  if (!req.file) {
    res.status(401).json({ error: "Please provide an image" });
  }
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).json({ path: filename });
});

module.exports = router;
