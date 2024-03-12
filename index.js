// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
const submitButton = document.getElementById('submit-button');
var currentTime = null;
var response = '';

document.addEventListener('readystatechange', (event)=>{
  if(event.target.readyState === "interactive"){
    fetch('https://rights-sichvtpofq-uc.a.run.app/init/', {
    // fetch('http://localhost:8000/startup', {
      method: "GET",
      headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
    }).then((response) => {
      if(response.status === 200){
        document.getElementById('chatbot').style.display = 'block';
        document.getElementById('micDiv').style.display = 'flex';
        document.getElementById('loadingDiv').style.display = 'none';
        return;
      }
      else{ 
        showError();
      }
    }).catch((ex) => {
      showError();
    });
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

  const micButton = document.getElementById('mic');

  let recognizing = false;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'English';

  micButton.addEventListener('mousedown', toggleSpeechRecognition);
  micButton.addEventListener('mouseup', toggleSpeechRecognition);

  recognition.onresult = (event) =>{
    const result = event.results[event.results.length-1][0].transcript;
    inputField.value = result;
  }

  recognition.onend = ()=>{
    recognizing = false;
    inputField.focus();
    submitButton.click();
  }

  function toggleSpeechRecognition(){
    if(recognizing){
      recognition.stop();
      micButton.style.background = 'red';
    }
    else{
      inputField.value = "";
      recognition.start();
      micButton.style.background = 'chartreuse';
    }

    recognizing = !recognizing;

    inputField.onchange();
  }
});

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = "";
 submitButton.disabled = true; 
  currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

  // Add user input to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'user-message');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p><img class="userImg" src="img/user.png" />`;
  conversation.appendChild(message);

  message.scrollIntoView({behavior: "smooth"});

  // Get chatbot response
  fetch('https://rights-sichvtpofq-uc.a.run.app/prompt/', {
    method: "POST",
    body: JSON.stringify({
        query_str: input
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
  }).then((response) => response.json())
  .then((json) => {
    response = json;
    addAIMessage();
  });
});

function showError(){
  document.getElementById('errorDiv').style.display = 'flex';
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('micDiv').style.display = 'none';
  document.getElementById('loadingDiv').style.display = 'none';
}

function addAIMessage(){
     // Add chatbot response to conversation
  message = document.createElement('div');
  message.classList.add('chatbot-message','chatbot');
  message.innerHTML = `<img class="botImg" src="img/court.png" /><p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({behavior: "smooth"});
}

function success() {
  if(document.getElementById("input-field").value==="") { 
     submitButton.disabled = true; 
  } else { 
      submitButton.disabled = false;
  }
}
