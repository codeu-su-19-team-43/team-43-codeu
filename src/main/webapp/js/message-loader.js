/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */

function buildMessageDiv(message) {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const usernameDiv = document.createElement('h5');
  usernameDiv.classList.add('card-title');
  usernameDiv.appendChild(document.createTextNode(message.user));
  cardBody.appendChild(usernameDiv);

  const timeDiv = document.createElement('p');
  timeDiv.classList.add('card-text');

  const timeText = document.createElement('small');
  timeText.classList.add('text-muted');
  timeText.appendChild(
    document.createTextNode(new Date(message.timestamp)),
  );

  timeDiv.appendChild(timeText);
  cardBody.appendChild(timeDiv);

  const textDiv = document.createElement('p');
  textDiv.classList.add('card-text');
  textDiv.appendChild(document.createTextNode(message.text));
  cardBody.appendChild(textDiv);

  if (message.imageUrl != null) {
    const imageDiv = document.createElement('img');
    imageDiv.classList.add('card-img-top');
    imageDiv.src = message.imageUrl;

    cardBody.appendChild(imageDiv);

    const labelDiv = document.createElement('p');
    labelDiv.classList.add('card-text');
    labelDiv.innerHTML = `Tags: ${message.imageLabels}`;
    cardBody.appendChild(labelDiv);

  }

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(cardBody);

  return card;
}


function fetchMessagesFromUrl(url) {
  fetch(url)
    .then(response => response.json())
    .then((messages) => {
      const messagesContainer = document.getElementById('message-cards-container');
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
