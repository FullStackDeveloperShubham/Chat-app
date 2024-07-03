const socket = io();

const clientsTotal = document.getElementById('clients-total');

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage()
})





socket.on('clients-total', (data) => {
  clientsTotal.innerText = `TOTOAL CLIENTS: ${data}`;
});

// send message function 
function sendMessage() {
  if (messageInput.value === "") return

  // console.log(messageInput.value)
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dataTime: new Date
  }
  socket.emit('message', data)
  addMessageToUi(true, data)
  messageInput.value = ''
}

socket.on('chat-message', (data) => {
  // console.log(data)
  addMessageToUi(false, data)
})

function addMessageToUi(isOwnMessage, data) {

  clearFeedback()

  const element = `
  <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
          ${data.message}
          <span>${data.name}  ${moment(data.dataTime).fromNow()}</span>
        </p>
      </li>`

  messageContainer.innerHTML += element
  scrollToButtom()
}

function scrollToButtom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}


messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is tying a mesaage`
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is tying a mesaage`
  })
})


messageInput.addEventListener('blue', (e) => {
  socket.emit('feedback', {
    feedback: ''
  })
})

socket.on('feedback', (data) => {

  clearFeedback()

  const element = `
  <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
      </li>`

  messageContainer.innerHTML += element
})



function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach(element => {
    element.parentNode.removeChild(element)
  })
}