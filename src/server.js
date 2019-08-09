const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const server = express();

const configs = require("../config");

mongoose.connect(configs.mongoDBUrl, { useNewUrlParser: true });

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);
