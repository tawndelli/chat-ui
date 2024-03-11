// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
var currentTime = null;
var response = '';

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = "";
  document.getElementById('submit-button').disabled = true; 
  currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

  // Add user input to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'user-message');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p><img class="userImg" src="img/user.png" />`;
  conversation.appendChild(message);

  message.scrollIntoView({behavior: "smooth"});

  // Get chatbot response
  fetch('http://localhost:8000/prompt/', {
    method: "POST",
    body: JSON.stringify({
        query_str: input
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "http://localhost:5000"
      }
  }).then((response) => response.json())
  .then((json) => {
    response = json;
    addAIMessage();
  });
});

function addAIMessage(){
     // Add chatbot response to conversation
  message = document.createElement('div');
  message.classList.add('chatbot-message','chatbot');
  message.innerHTML = `<img class="botImg" src="img/bot.png" /><p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({behavior: "smooth"});
}

function success() {
  if(document.getElementById("input-field").value==="") { 
      document.getElementById('submit-button').disabled = true; 
  } else { 
      document.getElementById('submit-button').disabled = false;
  }
}
