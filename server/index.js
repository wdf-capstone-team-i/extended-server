const express = require("express");
const morgan = require("morgan");
const compression = require("compression");

const db = require("./db/db");

const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("Serving on port: ", PORT));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const io = require('socket.io')(server);

app.use("/api", require("./routes/api"));
app.use(express.static(path.join(__dirname, "..", "public")));

db.sync().then(() => console.log("database connected"));

let rooms = {}
let sockets = {}

io.on("connection", (socket) => {
  console.log("Socket connection made!");

  socket.on("new-user", room => {
    if (!rooms[room]) rooms[room] = {totalSockets: 0}
    rooms[room].totalSockets++
    sockets[socket.id] = room
    console.log('SOCKETS:', sockets)
    console.log('ROOMS:', rooms)
    console.log(room)
    socket.join(room)
  })

  socket.on('disconnect', () => {
    console.log(`socket is disconnecting from room ${sockets[socket.id]}`)
    rooms[sockets[socket.id]].totalSockets--
    if (!rooms[sockets[socket.id]].totalSockets) delete rooms[sockets[sockets.id]]
    delete sockets[socket.id]
  })

  socket.on("msg:send", (room, data) => {
    io.in(room).emit("msg:receive", data);
  });
});

app.use((err, req, res, next) => {
  res.send("Oops. Well, that's embarrassing");
});

module.exports = server
