/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */
function buildMessageDiv(message) {
  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('left-align');
  usernameDiv.appendChild(document.createTextNode(message.user));

  const timeDiv = document.createElement('div');
  timeDiv.classList.add('right-align');
  timeDiv.appendChild(
    document.createTextNode(new Date(message.timestamp)),
  );

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('message-header');
  headerDiv.appendChild(usernameDiv);
  headerDiv.appendChild(timeDiv);

  const textDiv = document.createElement('p');
  textDiv.classList.add('message-text');
  textDiv.innerHTML = message.text;

  const BodyDiv = document.createElement('div');
  BodyDiv.classList.add('message-body');
  BodyDiv.appendChild(textDiv);

  if (message.imageUrl != null) {
    const imageDiv = document.createElement('img');
    imageDiv.classList.add('message-img');
    imageDiv.src = message.imageUrl;
    BodyDiv.appendChild(imageDiv);
  }

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message-div');
  messageDiv.appendChild(headerDiv);
  messageDiv.appendChild(BodyDiv);

  return messageDiv;
}


function fetchMessagesFromUrl(url) {
  fetch(url)
    .then(response => response.json())
    .then((messages) => {
      const messagesContainer = document.getElementById('message-container');
      if (messages.length === 0) {
        messagesContainer.innerHTML = '<p>This user has no posts yet.</p>';
      } else {
        messagesContainer.innerHTML = '';
      }
      messages.forEach((message) => {
        const messageDiv = buildMessageDiv(message);
        messagesContainer.appendChild(messageDiv);
      });
    });
}

/** Fetches messages and add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchCurrentUserMessages(parameterUsername) {
  const url = `/messages?user=${parameterUsername}`;
  fetchMessagesFromUrl(url);
}

/** Fetches messages and add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchAllUserMessages() {
  const url = '/feed';
  fetchMessagesFromUrl(url);
}
