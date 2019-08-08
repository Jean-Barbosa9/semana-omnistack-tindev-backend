const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const server = express();

mongoose.connect(
  "mongodb+srv://OmnistackTindev:0mn1T1nd3v@cluster0-pvsmn.mongodb.net/omnistacktindev?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

server.use(express.json());
server.use(routes);

server.listen(3333);
