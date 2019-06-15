function getIconTypeUsingSentimentScore(sentimentScore) {
  const iconClassNames = ['sentiment-score-icon', 'fas'];
  if (sentimentScore > 0.5) {
    iconClassNames.push('fa-laugh-beam');
  } else if (sentimentScore < -0.5) {
    iconClassNames.push('fa-frown');
  } else {
    iconClassNames.push('fa-meh-blank');
  }
  return iconClassNames;
}


function getText(message) {
  const { user, text } = message;
  const date = new Date(message.timestamp).toDateString();
  const finalText = [];

  finalText.push(
    'On ', date, ', ',
    user, ' said: ',
    text,
  );

  return finalText.join('');
}

function playTextToSpeechAudio(text) {
  fetch('/a11y/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
    .then(response => response.blob())
    .then((audioBlob) => {
      const audioUrl = window.URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play()
        .catch((error) => {
          throw error.message;
        });
    });
}

/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */

function buildMessageDiv(message) {
  const card = document.createElement('div');
  card.classList.add('card');

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
  textDiv.innerHTML = message.text;
  cardBody.appendChild(textDiv);

  const infoDiv = document.createElement('div');

  const sentimentScoreIcon = document.createElement('i');
  sentimentScoreIcon.classList.add(...getIconTypeUsingSentimentScore(message.sentimentScore));
  infoDiv.appendChild(sentimentScoreIcon);

  const sentimentScore = Math.trunc(message.sentimentScore * 100) / 100;
  infoDiv.appendChild(document.createTextNode(sentimentScore));

  const textToSpeechIcon = document.createElement('i');
  textToSpeechIcon.classList.add('fas', 'fa-volume-up', 'text-to-speech-icon');
  textToSpeechIcon.addEventListener('click', () => {
    playTextToSpeechAudio(getText(message));
  });

  infoDiv.appendChild(textToSpeechIcon);

  cardBody.appendChild(infoDiv);

  card.appendChild(cardBody);

  if (message.imageUrl != null) {
    const imageDiv = document.createElement('img');
    imageDiv.classList.add('card-img-top');
    imageDiv.src = message.imageUrl;

    card.insertBefore(imageDiv, card.childNodes[0]);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('card-footer');
    labelDiv.classList.add('p-1');
    labelDiv.innerHTML = '<p class="text-muted d-inline px-1">Tags:</p>';
    // eslint-disable-next-line no-return-assign
    message.imageLabels.map(imageLabel => labelDiv.innerHTML
            += `<a href="/feed.html">
            <button type="button" 
                    class="btn btn-outline-info m-1 p-1 font-weight-lighter tag-button"
            >${imageLabel}
            </button>
          </a>`);

    card.appendChild(labelDiv);
  }

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
