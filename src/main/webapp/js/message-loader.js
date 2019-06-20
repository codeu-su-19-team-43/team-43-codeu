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

function getTextForTts(message) {
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

function playTtsAudio(text) {
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

function getTranslatedText(text, languageCode) {
  return fetch('/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      languageCode,
    }),
  }).then(response => response.text());
}

function buildInfoDiv(message) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center');

  const sentimentScoreDiv = document.createElement('div');
  const sentimentScoreIcon = document.createElement('i');
  sentimentScoreIcon.classList.add(...getIconTypeUsingSentimentScore(message.sentimentScore));
  sentimentScoreDiv.appendChild(sentimentScoreIcon);
  const sentimentScore = Math.trunc(message.sentimentScore * 100) / 100;
  sentimentScoreDiv.appendChild(document.createTextNode(sentimentScore));

  infoDiv.appendChild(sentimentScoreDiv);

  const textToSpeechIcon = document.createElement('i');
  textToSpeechIcon.classList.add('fas', 'fa-volume-up', 'text-to-speech-icon');
  textToSpeechIcon.addEventListener('click', () => {
    playTtsAudio(getTextForTts(message));
  });
  infoDiv.appendChild(textToSpeechIcon);

  const translateIcon = document.createElement('i');
  translateIcon.classList.add('fas', 'fa-language', 'translate-icon');

  const translateResultDivId = `translateCollapseDiv-${message.id}`;
  translateIcon.setAttribute('data-toggle', 'collapse');
  translateIcon.setAttribute('data-target', `#${translateResultDivId}`);
  infoDiv.appendChild(translateIcon);

  const translateResult = document.createElement('div');
  translateResult.classList.add('collapse');
  translateResult.setAttribute('id', translateResultDivId);
  getTranslatedText(message.text, 'es').then((translatedText) => {
    translateResult.innerHTML = translatedText;
  });

  return { infoDiv, translateResult };
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

  const { infoDiv, translateResult } = buildInfoDiv(message);
  cardBody.appendChild(infoDiv);
  cardBody.appendChild(translateResult);

  card.appendChild(cardBody);

  if (message.imageUrl != null) {
    const imageDiv = document.createElement('img');
    imageDiv.classList.add('card-img-top');
    imageDiv.src = message.imageUrl;
    // eslint-disable-next-line prefer-destructuring
    imageDiv.alt = message.imageLabels[0];

    card.insertBefore(imageDiv, card.childNodes[0]);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('card-footer');
    labelDiv.classList.add('p-1');
    labelDiv.innerHTML = '<p class="text-muted d-inline px-1">Tags:</p>';
    // eslint-disable-next-line no-return-assign
    message.imageLabels.map(imageLabel => labelDiv.innerHTML
      += `<a href="/feed.html?imageLabel=${imageLabel.toLowerCase()}">
            <button type="button" class="btn btn-outline-info m-1 p-1 font-weight-lighter tag-button">
              ${imageLabel}
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

/** Fetches messages by user of current page  add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchMessagesByUser(parameterUsername) {
  const url = `/messages?user=${parameterUsername}`;
  fetchMessagesFromUrl(url);
}

/** Fetches all messages and add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchAllMessages() {
  const url = '/feed';
  fetchMessagesFromUrl(url);
}

/** Fetches messages for given image labels and add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchMessagesByImageLabels(imageLabels) {
  let url = '/feed?';
  imageLabels.forEach((imageLabel, index) => {
    url += `imageLabel=${imageLabel}`;
    if (index !== imageLabels.length - 1) {
      url += '&';
    }
  });
  fetchMessagesFromUrl(url);
}
