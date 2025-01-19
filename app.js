require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

module.exports = app;
