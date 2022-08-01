var express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");

var corsOptions = {
  origin: process.env.CLIENT_URI || "*",
  optionsSuccessStatus: 200,
};
dotenv.config();
const bodyParser = require("body-parser");
const router = require("./router");
var app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/data/img"));
// app.use("/weather", express.static(__dirname + "/data/img/weather"));
app.use("/upload", router);

const port = process.env.PORT || 3500;

app.listen(port, function () {
  console.log(`Express server is listening on port ${port}`);
});
