const express = require("express");
const cors = require("cors");
const configRouter = require("../routes/config");
const memeRouter = require("../routes/meme");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", configRouter);
app.use("/api", memeRouter);

const PORT = process.env.PORT || 8080;
const DB_HOST = process.env.DB_HOST || "mssql";
const DB_PORT = Number(process.env.DB_PORT || 1433);

console.log(`[startup] DB_HOST=${DB_HOST} DB_PORT=${DB_PORT}`);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
});
