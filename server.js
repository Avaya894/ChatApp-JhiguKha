// server file 
const express = require("express");
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res)=> {
    res.send('Welcome!');
});

app.listen(3000, ()=>{
    console.log('Server is listening on port 3000');
});

