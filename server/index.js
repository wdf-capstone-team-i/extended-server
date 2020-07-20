const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const session = require('express-session')
const cors = require('cors')

const db = require("./db/db");

const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("Serving on port: ", PORT));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
const corsOptions = {
  origin: [`http://localhost:3000`],
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use((req, res, next) => {
  if (req.get('origin').slice(0, 19) === 'chrome-extension://') corsOptions.origin.push(req.get('origin'))
  next()
})
app.use(cors(corsOptions))
app.use(session({
  secret: 'Aj0iP30jFd7',
  resave: false,
  saveUninitialized: true
}))

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   // res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const io = require('socket.io')(server);

app.use("/api", require("./routes/api"));
app.use(express.static(path.join(__dirname, "..", "public")));

db.sync().then(() => console.log("database connected"));

let sockets = {}

io.on("connection", (socket) => {
  // console.log("Socket connection made!");

  socket.on("new-user", room => {
    sockets[socket.id] = room
    socket.join(room)
    console.log('ROOM:', socket.room)
    io.in(room).clients((err, clients) => {
      if (err) throw err
      io.in(room).emit('clients-length', clients.length)
      console.log('NUMBER OF CLIENTS IN ROOM:', room, clients.length)
    })
  })

  socket.on('disconnect', () => {
    const room = sockets[socket.id]
    delete sockets[socket.id]
    io.in(room).clients((err, clients) => {
      if (err) throw err
      io.in(room).emit('clients-length', clients.length)
      console.log('NUMBER OF CLIENTS IN ROOM:', room, clients.length)
    })
  })

  socket.on("msg:send", (room, data) => {
    io.in(room).emit("msg:receive", data);
  });
});

app.use((err, req, res, next) => {
  res.send("Oops. Well, that's embarrassing");
  console.log(err);
});

module.exports = server
