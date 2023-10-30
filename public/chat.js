const socket = io("https://jhigukha.onrender.com/");

const user = prompt("Enter your name");

socket.emit("new-user-joined", user);

// const append = (message) => {
//   const messageElement = document.createElement("div");
//   messageElement.innerText = message;
//   const messageList = document.getElementById("message-list");
//   messageList.append(messageElement);
// };



const createToastElement = (title, content, position) => {
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'fade', 'show', 'mb-3');
    toastElement.classList.add(position);
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
  
    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
  
    const svgElement = document.createElement('svg');
    svgElement.classList.add('bd-placeholder-img', 'rounded', 'me-2');
    svgElement.setAttribute('width', '20');
    svgElement.setAttribute('height', '20');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('aria-hidden', 'true');
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svgElement.setAttribute('focusable', 'false');
  
    const rectElement = document.createElement('rect');
    rectElement.setAttribute('width', '100%');
    rectElement.setAttribute('height', '100%');
    rectElement.setAttribute('fill', '#007aff');
  
    svgElement.appendChild(rectElement);
  
    const strongElement = document.createElement('strong');
    strongElement.classList.add('me-auto');
    strongElement.innerText = title;
  
    const smallElement = document.createElement('small');
    smallElement.innerText = '11 mins ago';
  
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = content;
  
    toastHeader.appendChild(svgElement);
    toastHeader.appendChild(strongElement);
    toastHeader.appendChild(smallElement);
  
    toastElement.appendChild(toastHeader);
    toastElement.appendChild(toastBody);
  
    return toastElement;
  }
  

const append = (data, position) => {
    const messageList = document.getElementById("message-list");
    const toastElement = createToastElement(data.user, data.message, position);
    messageList.appendChild(toastElement);
  };


const form = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value;
  let right = 'ms-auto'
  append({user: "You", message: message}, right);
  socket.emit("send", message);
  messageInput.value = "";
});

socket.on("user-joined", (user) => {
  let left = 'me-auto';
  append({user: user, message: "Joined"}, left);
});

socket.on("receive", (data) => {
  let left = 'me-auto';
  let dm = {
    user: data.user,
    message: data.message
  }
  append(dm, left);
});

socket.on("leave", (data) => {
  let left = 'me-auto';
  append({user: data.user, message: "Left the chat"}, left);
});
