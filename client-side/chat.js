const socket = io("http://localhost:3000"); 

const user = prompt('Enter your name');

socket.emit('new-user-joined', user);

const append = (message)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    const messageList = document.getElementById('message-list');
    messageList.append(messageElement);
}

const form = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const message = messageInput.value;
    append(`You : ${message}`);
    socket.emit('send', message);
    messageInput.value = ''
});

socket.on('user-joined', user => {
    append(`${user} joined`)
})

socket.on('receive', data=>{
    append(`${data.user} : ${data.message}`)
})

socket.on('leave', data=>{
    append(`${data.user} left the chat`)
})