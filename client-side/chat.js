const socket = io("http://localhost:3000"); 

const user = prompt('Enter your name');

socket.emit('new-user-joined', user);

const append = (message)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    const messageList = document.getElementById('message-list');
    messageList.append(messageElement);
}

socket.on('user-joined', user => {
    append(`${user} joined`)
})