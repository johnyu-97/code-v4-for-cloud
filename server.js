const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const msgRoute = require("./routes/msgRoute");
const path = require("path");

//create express server
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/msg", msgRoute);

app.get("/", (req, res) => {
  res.send("Welcome to chat app APIs..");
});

const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URL;

app.listen(port, (req, res) => {
  console.log(`server running on port: ${port}`);
});

// production script
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((error) => console.log("MongoDB connect fail.", error.message));
