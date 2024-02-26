const express = require('express');
const app = express();
const db = require("./models");
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use(express.json());

const messageRouter = require("./routes/Messages");
app.use("/message", messageRouter);


const config = require("./config/config.json");
const dbUsername = process.env.DB_USERNAME || config.development.username;
const dbPassword = process.env.DB_PASSWORD || config.development.password;
const dbName = process.env.DB_NAME || config.development.database;
const dbHost = process.env.DB_HOST || config.development.host;
const dbDialect = process.env.DB_DIALECT || config.development.dialect;

config.production.username = dbUsername;
config.production.password = dbPassword;
config.production.database = dbName;
config.production.host = dbHost;
config.production.dialect = dbDialect;


db.sequelize.sync().then(() => {
    app.listen(process.env.PORT||3001, () => {
      console.log("Server is running on port 3001.");
    });
  }).catch((err) => {console.log(err)});
