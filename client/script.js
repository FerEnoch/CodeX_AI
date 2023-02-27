import bot from '/assets/bot.png';
import user from '/assets/user.png';
// import worker from '/service-worker.js?url';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index++);
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class='chat'>
        <div class='profile'>
          <img
              src=${isAi ? bot : user}
              alt=${isAi ? 'bot' : 'user'}
            />
        </div>
        <div class='message ${isAi ? 'white-space-wrap' : ''}' id='${uniqueId}'>
          <!-- messages go here --> 
          ${value}
        </div>
      </div> 
    </div>
    `
  )
}

const handleSubmit = (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch('http://localhost:3001', {
  fetch('https://codex-5zsc.onrender.com/', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get("prompt")
    })
  })
    .then(async response => {
      if (response.ok) {
        const data = await response.json();
        const parseData = data.bot.trim();
        typeText(messageDiv, parseData);
        clearInterval(loadInterval);
        messageDiv.innerHTML = '';
      } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong...";
        alert(err);
      }
    })
    .catch(err => {
      console.log("There's a problem with the server or the net:", err);
      chatContainer.innerHTML = chatStripe(true, "Sorry... I can't answer cause we're disconnected", uniqueId);
      alert("You need internet connection to chat with Codex... or maybe there's a problem with the server :_(");
    });
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    handleSubmit(e);
  }
});

/**
 *  La herramienta vite-plugin-pwa crea y registra automáticamente un service-worker,
 *  por lo que el código que sigue es innecesario, y sólo lo dejo aquí a los fines de que
 *  quede registro de cómo se haría en vanilla javascript.
 * 
 * 
 *      if ('serviceWorker' in navigator) {
 *        // console.log('Service worker supported!');
 *        window.addEventListener('load', () => {
 *          navigator.serviceWorker
 *            .register(worker, { type: "module", scope: "./" })
 *            .then(reristrationObject => console.log('[Service Worker] Successful registration', reristrationObject.scope))
 *            .catch(err => console.log("[Service Worker] Registration failed. Error: ", err));
 *        });
 *      } else {
 *        console.error('Service workers are not supported.');
 *      }
 */
