const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dataBaseConnection = require("./config/database");
const authRouter = require("./routes/authRoute");
const messengerRouter = require("./routes/messangerRoute");
const cors = require("cors");

dotenv.config({
  path: "config/config.env",
});

dataBaseConnection();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// routes...
app.get("/", (req, res) => {
  res.json({ answer: "This is my app!!!" });
});

// they have to be same  (base url)
app.use("/api/chat-with", authRouter);
app.use("/api/chat-with", messengerRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
