const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dataBaseConnection = require("./config/database");
const authRouter = require("./routes/authRoute");
dotenv.config({
  path: "config/config.env",
});

dataBaseConnection();

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cookieParser());

// routes...
app.get("/", (req, res) => {
  res.send("This is my app!!!");
});
app.use("/api/chat-with", authRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
