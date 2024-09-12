const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dataBaseConnection = require("./config/database");
const authRouter = require("./routes/authRoute");
const messengerRouter = require("./routes/messangerRoute");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config({
  path: "config/config.env",
});

dataBaseConnection();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// calling the socket io...
require("./socket/socket")(io);

app.get("/", (req, res) => {
  res.json({ answer: "This is my app!!!" });
});

app.use("/api/chat-with", authRouter);
app.use("/api/chat-with", messengerRouter);

// static files
app.use("/static", express.static("public"));

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
