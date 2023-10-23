// server file
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

users = {};

// Connection event handler
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    //    socket.broadcast.emit('user-joined', name);
    console.log(`New user joined ${name}`);
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { message: message, user: users[socket.id] });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("leave", { user: users[socket.id] });
  });
});

// Handle Routes
app.get("/", (req, res) => {
  res.send("Welcome!");
});

// Start the server
http.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
