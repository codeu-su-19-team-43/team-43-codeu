let userEmail = null;
let langCodeForTranslation = 'es'; // default to Spanish on empty or invalid language code

function fetchUserEmail() {
  $.ajaxSetup({ async: false });
  $.getJSON('/login-status', (loginStatus) => {
    if (loginStatus.isLoggedIn) {
      userEmail = loginStatus.username;
    }
  });
  $.ajaxSetup({ async: true });
}

fetchUserEmail();

function getUsername(email) {
  const url = `/user-profile?user=${email}`;
  return fetch(url)
    .then(response => response.json())
    .then((user) => {
      // eslint-disable-next-line prefer-destructuring
      const username = user.username;
      return (username !== undefined && username !== '') ? username : email;
    });
}

function fetchLanguageForTranslation() {
  if (userEmail !== null) {
    $.ajaxSetup({ async: false });
    $.getJSON(`/user-profile?user=${userEmail}`, (userProfile) => {
      if (userProfile.langCodeForTranslation && userProfile.langCodeForTranslation !== '') {
        langCodeForTranslation = userProfile.langCodeForTranslation.toString();
      }
    });
    $.ajaxSetup({ async: true });
  }
}

fetchLanguageForTranslation();

function getBadgeUsingSentimentScore(sentimentScore) {
  const sentimentScoreBadge = document.createElement('span');
  if (sentimentScore > 0.5) {
    sentimentScoreBadge.classList.add('badge', 'badge-pill', 'badge-success');
    sentimentScoreBadge.appendChild(document.createTextNode(
      'Positive',
    ));
  } else if (sentimentScore < -0.5) {
    sentimentScoreBadge.classList.add('badge', 'badge-pill', 'badge-danger');
    sentimentScoreBadge.appendChild(document.createTextNode(
      'Negative',
    ));
  } else {
    sentimentScoreBadge.classList.add('badge', 'badge-pill', 'badge-secondary');
    sentimentScoreBadge.appendChild(document.createTextNode(
      'Neutral',
    ));
  }

  const scoreText = Math.trunc(sentimentScore * 100) / 100;
  sentimentScoreBadge.appendChild(
    document.createTextNode(` (${scoreText.toString()})`),
  );

  return sentimentScoreBadge;
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

function playTtsAudio(textToSpeechIconId, text) {
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
        }).finally(() => {
          // make icon clickable after audio has stopped playing
          audio.onended = () => {
            $(textToSpeechIconId).removeClass('unclickable');
          };
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
  }).then(response => response.text())
    .catch(error => `Error: ${error}. You probably set an invalid language code in your profile! 
    Update it and try again.`);
}

function buildInfoDiv(message) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center');

  const sentimentScoreDiv = document.createElement('div');
  const sentimentScoreBadge = getBadgeUsingSentimentScore(message.sentimentScore);
  sentimentScoreDiv.appendChild(sentimentScoreBadge);

  infoDiv.appendChild(sentimentScoreDiv);

  const iconGroupDiv = document.createElement('div');
  const textToSpeechIcon = document.createElement('i');
  textToSpeechIcon.id = `text-to-speech-icon-${message.id}`;
  textToSpeechIcon.classList.add('fas', 'fa-volume-up', 'text-to-speech-icon', 'mr-2');

  // listen for click events
  const textToSpeechIconIdStr = `#${textToSpeechIcon.id}`;
  textToSpeechIcon.addEventListener('click', (event) => {
    // prevent click while audio is playing
    if ($(textToSpeechIconIdStr).hasClass('unclickable')) {
      event.preventDefault();
    } else {
      $(textToSpeechIconIdStr).addClass('unclickable');
      playTtsAudio(textToSpeechIconIdStr, getTextForTts(message));
    }
  });

  iconGroupDiv.appendChild(textToSpeechIcon);

  const translateIcon = document.createElement('i');
  translateIcon.classList.add('fas', 'fa-language', 'translate-icon');

  const translateResultDivId = `translateCollapseDiv-${message.id}`;
  translateIcon.setAttribute('data-toggle', 'collapse');
  translateIcon.setAttribute('data-target', `#${translateResultDivId}`);
  iconGroupDiv.appendChild(translateIcon);
  infoDiv.appendChild(iconGroupDiv);

  const translateResult = document.createElement('div');
  translateResult.classList.add('collapse');
  translateResult.setAttribute('id', translateResultDivId);
  getTranslatedText(message.text, langCodeForTranslation).then((translatedText) => {
    translateResult.innerHTML = translatedText;
  });

  return { infoDiv, translateResult };
}

function buildUsernameDiv(message) {
  const usernameDiv = document.createElement('h5');
  usernameDiv.classList.add('card-title', 'mb-0');
  usernameDiv.id = 'username';

  getUsername(message.user).then((username) => {
    usernameDiv.innerHTML = username;
  });

  return usernameDiv;
}

function getHourDiffFromNow(timeStamp) {
  // eslint-disable-next-line no-undef
  const duration = moment.duration(moment(new Date()).diff(moment(timeStamp)));
  const hours = duration.asHours();
  return hours;
}

function getTimeText(timestamp) {
  // eslint-disable-next-line no-nested-ternary, no-undef
  return getHourDiffFromNow(timestamp) < 24 ? moment(timestamp).fromNow()
    // eslint-disable-next-line no-undef
    : getHourDiffFromNow(timestamp) < (24 * 7) ? moment(timestamp).calendar()
      // eslint-disable-next-line no-undef
      : moment(timestamp).format('ll');
}

function buildTimeDiv(timestamp) {
  const timeDiv = document.createElement('p');
  timeDiv.classList.add('card-text', 'mb-0');

  const timeText = document.createElement('small');
  timeText.classList.add('text-muted');

  timeText.innerHTML = getTimeText(timestamp);

  timeDiv.appendChild(timeText);
  return timeDiv;
}

function buildLandmarkDiv(message) {
  const landmarkDiv = document.createElement('div');
  landmarkDiv.classList.add('mb-2', 'imageLandmark-container');
  landmarkDiv.innerHTML = `<a href="#" class="card-text">${message.imageLandmark}</a>`;
  return landmarkDiv;
}

function buildTextDiv(message) {
  const textDiv = document.createElement('p');
  textDiv.id = `text-${message.id}`;
  textDiv.classList.add('card-text', 'border-top', 'pt-2');
  textDiv.innerHTML = message.text;
  return textDiv;
}

// eslint-disable-next-line no-unused-vars
function onMouseEnterImageDiv(element) {
  element.childNodes[1].classList.remove('hidden');
}

// eslint-disable-next-line no-unused-vars
function onMouseOutImageDiv(element) {
  element.childNodes[1].classList.add('hidden');
}

function buildImageDiv(message) {
  let imageDivHtml = '<div class="card mb-0 border-0" id="image-container" onmouseenter="onMouseEnterImageDiv(this)" onmouseleave="onMouseOutImageDiv(this)">';

  imageDivHtml += `<img class="lazy card-img-top border-bottom"
                        src="/images/placeholder.png"
                        data-src=${message.imageUrl} 
                        alt=${message.imageLabels[0]}>`;

  let labelHtml = '<div id="image-label-container" class="card-footer p-1 border-top-0 image-label-container hidden">';
  // eslint-disable-next-line no-return-assign
  message.imageLabels.map(imageLabel => labelHtml
    += `<a href="/feed.html?imageLabel=${imageLabel.toLowerCase()}">
            <button type="button" class="btn btn-outline-light m-1 p-1 font-weight-lighter tag-button">
              ${imageLabel}
            </button>
          </a>`);
  labelHtml += '</div>';
  imageDivHtml += labelHtml;

  imageDivHtml += '</div>';

  const imageDiv = document.createElement('div');
  imageDiv.innerHTML = imageDivHtml;

  return imageDiv;
}

// eslint-disable-next-line no-unused-vars
function onClickCommentCount() {
  document.getElementById('comment-container').classList.remove('hidden');
}

function buildCommentCount(message) {
  // eslint-disable-next-line no-nested-ternary
  return (message.commentIds == null || message.commentIds.length === 0)
    ? '' : message.commentIds.length === 1
      ? `<p class="text-muted font-weight-light pr-2 mb-0" data-toggle="collapse" data-target="#comment-container-${message.id}">1 comment</p>`
      : `<p class="text-muted font-weight-light pr-2 mb-0" data-toggle="collapse" data-target="#comment-container-${message.id}">${message.commentIds.length} comments</p>`;
}

function buildFavouriteCount(message) {
  // eslint-disable-next-line no-nested-ternary
  return (message.favouritedUserEmails == null
    || message.favouritedUserEmails.length === 0)
    ? '' : message.favouritedUserEmails.length === 1
      ? '<p class="text-muted font-weight-light mb-0">1 Favourite</p>'
      : `<p class="text-muted font-weight-light mb-0">${message.favouritedUserEmails.length} Favourites</p>`;
}

function buildLikeCount(message) {
  const messageCount = (message.likedUserEmails == null || message.likedUserEmails.length === 0)
    ? '' : message.likedUserEmails.length;
  return (message.likedUserEmails == null || message.likedUserEmails.length === 0)
    ? '' : `<i class="reaction-icon far fa-thumbs-up mr-1"></i>
            <p class="reaction-count font-weight-light mb-0">${messageCount}</p>`;
}

function hasResponse(message) {
  return ((message.commentIds != null && message.commentIds.length !== 0)
    || (message.favouritedUserEmails != null && message.favouritedUserEmails.length !== 0)
    || (message.likedUserEmails != null && message.likedUserEmails.length !== 0));
}

function toggleResponse(message) {
  const responseDiv = document.getElementById(`response-container-${message.id}`);
  if (hasResponse(message)) {
    responseDiv.classList.remove('hidden');
  } else {
    responseDiv.classList.add('hidden');
  }
}

function buildResponseDiv(message) {
  const responseDiv = document.createElement('div');
  responseDiv.id = `response-container-${message.id}`;
  responseDiv.classList.add('response-container', 'd-flex', 'justify-content-between', 'mt-2', 'pb-2', 'border-bottom');

  if (!hasResponse(message)) {
    responseDiv.classList.add('hidden');
  }

  responseDiv.innerHTML = `<span class="like-count-container d-flex flex-row" id="like-count-container-${message.id}">
                            ${buildLikeCount(message)}
                          </span>
                          <div class="comment-favourite-container d-flex flex-row">
                            <div id="comment-count-container-${message.id}">
                              ${buildCommentCount(message)}
                            </div>
                            <div id="favourite-count-container-${message.id}">
                              ${buildFavouriteCount(message)}
                            </div>
                          </div>`;
  return responseDiv;
}

function buildLikeAction(message) {
  let iconHtml;
  if (message.likedUserEmails != null && message.likedUserEmails.includes(userEmail)) {
    iconHtml = '<i class="fas fa-thumbs-up mr-1"></i>Like';
  } else {
    iconHtml = '<i class="far fa-thumbs-up mr-1"></i>Like';
  }
  return iconHtml;
}

function buildFavouriteAction(message) {
  let iconHtml;
  if (message.favouritedUserEmails != null && message.favouritedUserEmails.includes(userEmail)) {
    iconHtml = '<i class="fas fa-heart mr-1"></i>Favourite';
  } else {
    iconHtml = '<i class="far fa-heart mr-1"></i>Favourite';
  }
  return iconHtml;
}

// eslint-disable-next-line no-unused-vars
function onClickLikeButton(messageId) {
  if (userEmail != null) {
    const data = { userEmail, messageId };
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify(data),
      processData: false,
      type: 'POST',
      url: '/like',
    }).done(() => {
      fetch(`/message?messageId=${messageId}`)
        .then(response => response.json())
        .then((message) => {
          const likeCountContainers = document.querySelectorAll(`[id='like-count-container-${messageId}']`);
          likeCountContainers.forEach((div) => {
            // eslint-disable-next-line no-param-reassign
            div.innerHTML = buildLikeCount(message);
          });
          const likeActionContainers = document.querySelectorAll(`[id='like-action-container-${messageId}']`);
          likeActionContainers.forEach((div) => {
            // eslint-disable-next-line no-param-reassign
            div.innerHTML = buildLikeAction(message);
          });
          toggleResponse(message);
        });
    });
  } else {
    $('#instructUserToLoginModal').modal('show');
  }
}

// eslint-disable-next-line no-unused-vars
function onClickFavouriteButton(messageId) {
  if (userEmail != null) {
    const data = { userEmail, messageId };
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify(data),
      processData: false,
      type: 'POST',
      url: '/favourite',
    }).done(() => {
      fetch(`/message?messageId=${messageId}`)
        .then(response => response.json())
        .then((message) => {
          const favCountContainers = document.querySelectorAll(`[id='favourite-count-container-${messageId}']`);
          favCountContainers.forEach((div) => {
            // eslint-disable-next-line no-param-reassign
            div.innerHTML = buildFavouriteCount(message);
          });
          const favActionContainers = document.querySelectorAll(`[id='favourite-action-container-${messageId}']`);
          favActionContainers.forEach((div) => {
            // eslint-disable-next-line no-param-reassign
            div.innerHTML = buildFavouriteAction(message);
          });

          toggleResponse(message);
        });
    });
  } else {
    $('#instructUserToLoginModal').modal('show');
  }
}

function buildActionDiv(message) {
  const actionDiv = document.createElement('div');
  actionDiv.innerHTML = `<div id="action-container" class="action-container d-flex justify-content-between mt-2 pb-2">
                          <button id="like-action-container-${message.id}" class="btn btn-light btn-sm font-weight-light" onclick="onClickLikeButton('${message.id}');">
                            ${buildLikeAction(message)}
                          </button>
                          <button id="comment-action-container-${message.id}" class="btn btn-light btn-sm font-weight-light" data-toggle="collapse" data-target="#comment-container-${message.id}">
                            <i class="far fa-comment-alt mr-1"></i>
                            Comment
                          </button>
                          <button id="favourite-action-container-${message.id}" class="btn btn-light btn-sm font-weight-light" onclick="onClickFavouriteButton('${message.id}');">
                            ${buildFavouriteAction(message)}
                          </button>
                         </div>`;
  return actionDiv;
}

// eslint-disable-next-line no-unused-vars
function autoGrow(element) {
  // eslint-disable-next-line no-param-reassign
  element.style.height = '5px';
  // eslint-disable-next-line no-param-reassign
  element.style.height = `${element.scrollHeight}px`;
}

// eslint-disable-next-line no-unused-vars
function enablePostButton(commentInputTextArea, messageId) {
  const commentPostButton = document.getElementById(`comment-post-button-${messageId}`);

  commentInputTextArea.addEventListener('input', () => {
    commentPostButton.disabled = true;
    if (commentInputTextArea.value) {
      const commentText = commentInputTextArea.value.toString().trim();
      if (commentText !== '') {
        commentPostButton.disabled = false;
      }
    }
  });
}

function getUserProfileUrl(email) {
  if (email === null || email === undefined || email === '') {
    return Promise.resolve('./images/default-user-profile/1.jpg');
  }

  const url = `/user-profile?user=${email}`;
  return fetch(url)
    .then(response => response.json())
    .then(user => user.profileImageUrl);
}

function buildCommentInput(messageId) {
  return getUserProfileUrl(userEmail).then((userProfileImageUrl) => {
    const commentFormHtml = `<li class="media">
                            <a class="mr-3 my-2" href="#">
                              <img src="${userProfileImageUrl}" class="comment-image rounded-circle" alt="...">
                            </a>
                            <div class="media-body">
                              <div id="comment-input-container" class="comment-input-container">
                                <div class="input-group input-group-sm mt-2">
                                  <textarea
                                    name="comment-input-textarea-${messageId}"
                                    id="comment-input-textarea-${messageId}"
                                    class=form-control
                                    type=text
                                    placeholder="Add a comment"
                                    onblur="this.placeholder='Add a comment'"
                                    onfocus="this.placeholder=''"
                                    onkeyup="autoGrow(this)"
                                    oninput="enablePostButton(this, '${messageId}')"
                                    ></textarea>
                                  <div class="input-group-append">
                                    <button class="btn btn-light comment-post-button border" 
                                            disabled="true"
                                            type="button" 
                                            id="comment-post-button-${messageId}"
                                            onclick="onClickCommentPostButton('${messageId}');">
                                            Post
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>`;
    return commentFormHtml;
  });
}

function buildCommentSentimentIndicator(sentimentScore) {
  const sentimentScoreText = Math.trunc(sentimentScore * 100) / 100;

  if (sentimentScore > 0.5) {
    return `<span class="badge badge-pill badge-success sentiment-score-indicator">
              <small>${sentimentScoreText}</small>
            </span>`;
  }

  if (sentimentScore < -0.5) {
    return `<span class="badge badge-pill badge-danger sentiment-score-indicator">
              <small>${sentimentScoreText}</small>
            </span>`;
  }

  return `<span class="badge badge-pill badge-secondary sentiment-score-indicator">
            <small>${sentimentScoreText}</small>
          </span>`;
}

function buildCommentItem(comment) {
  return getUsername(comment.user).then(username => getUserProfileUrl(comment.user)
    .then((userProfileUrl) => {
      const commentHtml = `<li class="media">
            <a class="mr-3 my-2" href="/user-page.html?user=${comment.user}">
              <img src="${userProfileUrl}" class="comment-image rounded-circle" alt="...">
            </a>
            <div class="media-body">
              <div class="d-flex justify-content-between mt-1">
                <a href="/user-page.html?user=${comment.user}"><p class="mb-0 font-weight-normal comment-username">${username}</p></a>
                <p class="card-text mb-0 comment-time-container">
                  <small class="text-muted">${getTimeText(comment.timestamp)}</small>  
                </p>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <p class="font-weight-light comment-text mb-0">${comment.text}</p>
                ${comment.sentimentScore !== null || comment.sentimentScore !== undefined ? buildCommentSentimentIndicator(comment.sentimentScore) : ''}
              </div>
            </div>
          </li>`;

      return commentHtml;
    }));
}

function buildCommentHtml(messageId) {
  let commentHtml = `<ul class="list-unstyled comment-list mb-0" id="comment-list-${messageId}">`;

  return buildCommentInput(messageId).then((commentInput) => {
    commentHtml += commentInput;

    const url = `/comments?messageId=${messageId}`;
    return fetch(url)
      .then(response => response.json())
      .then((comments) => {
        let commentSequence = Promise.resolve();
        comments.forEach((comment) => {
          commentSequence = commentSequence.then(() => buildCommentItem(comment))
            .then((commentItemHtml) => {
              commentHtml += commentItemHtml;
            });
        });

        return commentSequence.then(() => {
          commentHtml += '</ul>';
          return commentHtml;
        });
      });
  });
}

function onCommentPost(messageId) {
  fetch(`/message?messageId=${messageId}`)
    .then(response => response.json())
    .then((message) => {
      $(`#comment-count-container-${messageId}`).html(
        buildCommentCount(message),
      );
      toggleResponse(message);
    });
}

// eslint-disable-next-line no-unused-vars
function onClickCommentPostButton(messageId) {
  const commentInputTextarea = document.getElementById(`comment-input-textarea-${messageId}`);

  const comment = {
    messageId,
    userText: commentInputTextarea.value,
  };

  $.ajax({
    contentType: 'application/json',
    data: JSON.stringify(comment),
    processData: false,
    type: 'POST',
    url: '/comments',
  }).done((response) => {
    if (response.toString().trim() !== '') {
      $('#instructUserToLoginModal').modal('show');
    } else {
      buildCommentHtml(messageId).then((commentHtml) => {
        $(`#comment-container-${messageId}`).html(commentHtml);
      });

      onCommentPost(messageId);
    }
  });
}

function buildCommentDiv(messageId) {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('px-2', 'py-1', 'border-top', 'collapse', 'comment-container');
  commentDiv.id = `comment-container-${messageId}`;

  buildCommentHtml(messageId).then((commentHtml) => {
    commentDiv.innerHTML = commentHtml;
  });

  return commentDiv;
}

function buildCardBodyDiv(message) {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'pb-0', 'px-3');

  cardBody.appendChild(buildUsernameDiv(message));
  cardBody.appendChild(buildTimeDiv(message.timestamp));

  if (message.imageLandmark != null && message.imageLandmark !== '') {
    cardBody.appendChild(buildLandmarkDiv(message));
  }

  cardBody.appendChild(buildTextDiv(message));

  const { infoDiv, translateResult } = buildInfoDiv(message);
  cardBody.appendChild(infoDiv);
  cardBody.appendChild(translateResult);

  cardBody.appendChild(buildResponseDiv(message));
  cardBody.appendChild(buildActionDiv(message));

  return cardBody;
}

/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */
function buildMessageDiv(message) {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'p-2', 'border-0');

  const card = document.createElement('div');
  card.classList.add('border');

  card.appendChild(buildCardBodyDiv(message));

  if (message.imageUrl != null) {
    card.insertBefore(buildImageDiv(message), card.childNodes[0]);
  }

  card.appendChild(buildCommentDiv(message.id));
  cardContainer.appendChild(card);
  return cardContainer;
}

/** Gets message property to sort on and sort order based on criteria.  */
function getSortParameters(sortCriteria) {
  let sortProperty = '';
  let sortOrder = '';
  if (sortCriteria === 'Least Recent') {
    sortProperty = 'timestamp';
    sortOrder = 'asc';
  } else if (sortCriteria === 'Most Positive') {
    sortProperty = 'sentimentScore';
    sortOrder = 'desc';
  } else if (sortCriteria === 'Most Negative') {
    sortProperty = 'sentimentScore';
    sortOrder = 'asc';
  } else {
    sortProperty = 'timestamp';
    sortOrder = 'desc';
  }

  return { sortProperty, sortOrder };
}

function getLoadingElement() {
  return (
    `<div class="d-flex justify-content-start my-3">
      <p>Loading...</p>
      <div class="spinner-border mx-3" role="status"></div>
    </div>`
  );
}

function buildMessagesDivFromUrl(url, parentId, emptyHolderContent, sortCriteria) {
  const messagesContainer = document.getElementById(parentId);
  if (parentId !== 'user-gallery-container') {
    messagesContainer.innerHTML = getLoadingElement();
  }

  fetch(url)
    .then(response => response.json())
    .then((messagesJson) => {
      let messages = messagesJson;

      if (messages == null || messages.length === 0) {
        if (parentId === 'user-gallery-container') {
          document.getElementById('add-post-text').innerHTML = emptyHolderContent;
        } else {
          messagesContainer.innerHTML = emptyHolderContent;
        }
      } else {
        if (parentId !== 'user-gallery-container') {
          messagesContainer.innerHTML = '';
        }

        if (sortCriteria) {
          const { sortProperty, sortOrder } = getSortParameters(sortCriteria);
          // eslint-disable-next-line no-undef
          messages = _.orderBy(messages, [sortProperty], [sortOrder]);
        }

        messages.forEach((message) => {
          const messageDiv = buildMessageDiv(message);
          messagesContainer.appendChild(messageDiv);
        });
      }
    });
}

/** Fetches messages by user of current page  add them to the page. */
// eslint-disable-next-line no-unused-vars
async function fetchMessagesByUser(parameterUsername) {
  buildMessagesDivFromUrl(`/user-messages?user=${parameterUsername}`, 'user-gallery-container',
    'Your gallery is empty. <br> Post your first photo and share about its story!');
  buildMessagesDivFromUrl(`/favourite?userEmail=${parameterUsername}`, 'favourite-messages-container',
    `<p class="text-muted ml-3 mt-4 position-absolute font-weight-lighter">
      Your favourite collection is empty. Mark a photo as your favourite to view it here!
    </p>`);
}

function buildFeedPageEmptyHolder(string) {
  return `<p class="text-muted ml-3 mt-0 position-absolute font-weight-lighter">${string}</p>`;
}

/** Fetches all messages and add them to the page. */
// eslint-disable-next-line no-unused-vars
function fetchAllMessages() {
  const url = '/feed';
  buildMessagesDivFromUrl(url, 'message-cards-container', buildFeedPageEmptyHolder('The PhotoBook universe is empty. Be the one to post the first photo!'));
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
  buildMessagesDivFromUrl(url, 'message-cards-container', buildFeedPageEmptyHolder('No images found for this label. Be the one to post the first photo!'));
}

/** Build messages div with given sort criteria */
function onSelectSetSortCriteria() {
  const sortCriteria = $(this).val();

  let url = window.location.pathname.replace('.html', '');
  const parameterStartIdx = window.location.href.indexOf('?');
  if (parameterStartIdx !== -1) {
    url += window.location.href.substring(parameterStartIdx);
  }

  buildMessagesDivFromUrl(url, 'message-cards-container', buildFeedPageEmptyHolder('No images found for this label. Be the one to post the first photo!'), sortCriteria);
}

/** Listen for sort menu changes and trigger sorting function */
$(document).ready(() => {
  $('#sortCriteriaMenu').change(onSelectSetSortCriteria);
});
