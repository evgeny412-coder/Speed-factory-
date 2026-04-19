const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

let players = {};

io.on("connection", socket => {
  console.log("Игрок подключился:", socket.id);
  players[socket.id] = {
    car:{x:100,y:300,speed:0,angle:0,skin:"jeep",hp:100},
    person:{x:120,y:300,speed:2,skin:"driver",hp:100},
    mode:"car"
  };

  io.emit("state", players);
  io.emit("onlineCount", Object.keys(players).length);

  socket.on("move", data => {
    players[socket.id] = data;
    io.emit("state", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("state", players);
    io.emit("onlineCount", Object.keys(players).length);
  });
});

// Railway назначает порт автоматически
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Сервер запущен на порту " + PORT));
