// server file
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require('path');
const router = express.Router();

app.use(express.static('public'));

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
router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/', router);

// Start the server
http.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
