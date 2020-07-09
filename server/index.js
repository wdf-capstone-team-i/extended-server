const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const Socket = require("socket.io");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("Serving on port: ", PORT));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());

// add routes here
app.use("/api/users", require("./db/api/users"));
app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Socket(server);

io.on("connection", (socket) => {
  console.log("Socket connection made!");

  socket.on("msg:send", (data) => {
    io.sockets.emit("msg:receive", data);
  });
});

app.use((err, req, res, next) => {
  res.send("Oops. Well, that's embarrassing");
});
