// server file 
const express = require("express");
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Connection event handler 
io.on('connection', (socket)=>{
    console.log('A user connected');

    // Client message event listener
    socket.on('toServermessage', (arg)=>{
        console.log("Message from client: ", arg);
    });

    // Event listener 
    // Code for joinRoom eventlistener 
    socket.on('joinRoom', (room)=>{
        console.log(`${socket.id} just joined room ${room}`);
        socket.join(room);
        io.to(room).emit('roomJoined', `${socket.id} just joined the room`);
    });

    //  Leave a room
    socket.on('leaveRoom', (room)=>{
        console.log(`${socket.id} has left room ${room}`);
        socket.leave(room);
        io.to(room).emit('roomLeft', `${socket.id} has left the room`);

    });

    // Post a message to a specific room
    socket.on('messageToRoom', (data)=>{
        console.log(`${socket.id} posted a message to room ${data.room}: ${data.message}`);
        io.to(data.room).emit('message', {
            id: socket.id,
            message: data.message
        });
    });

    // chatMessage event listener
    socket.on('chatMessage', (message)=>{
        console.log(message);
    })


    // Disconnect event
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });

    // Message to the server 
    socket.emit("message", "Server is messaging you. Hiii!!!!")

    

});


// Handle Routes
app.get('/', (req, res)=> {
    res.send('Welcome!');
});

// Start the server 
http.listen(3000, ()=>{
    console.log('Server is listening on port 3000');
});

