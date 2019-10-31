require("dotenv").config();
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  db = require("./db"),
  mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const Message = mongoose.model("Message", { name: String, message: String });

// Routes
app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", async (req, res) => {
  try {
    let message = new Message(req.body);
    await message.save();
    console.log("message", req.body);

    io.emit("message", req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.log("error", error);
  } finally {
    console.log("Message Posted");
  }
});

io.on("connection", () => {
  console.log("a user is connected");
});

try {
  db.connect();
  console.log("db connected");
} catch (e) {
  console.error(e);
}

const server = app.listen(3000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

io.listen(server);
