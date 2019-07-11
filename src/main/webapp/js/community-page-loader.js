function getUsersWithPropertyCount(messages, propertyName) {
  // eslint-disable-next-line no-undef
  const messagesByUser = _.groupBy(messages, 'user');

  const userPropertyCount = [];
  // eslint-disable-next-line no-undef
  _.keys(messagesByUser).forEach((userEmail) => {
    const userMessages = messagesByUser[userEmail];

    let count = 0;
    userMessages.forEach((userMessage) => {
      if (userMessage[propertyName]) {
        count += userMessage[propertyName].length;
      }
    });

    userPropertyCount.push({
      user: userEmail,
      propertyCount: count,
    });
  });

  return userPropertyCount;
}

function buildTopThreeContributors(messages) {
  const contributors = [];
  // eslint-disable-next-line no-undef
  const contributorCount = _.countBy(messages, 'user');
  // eslint-disable-next-line no-undef
  _.keys(contributorCount).forEach((userEmail) => {
    contributors.push({
      user: userEmail,
      messageCount: contributorCount[userEmail],
    });
  });

  // eslint-disable-next-line no-undef
  const topThreeContributors = _.orderBy(
    contributors,
    ['messageCount'],
    ['desc'],
  ).slice(0, 3);

  const topThreeContributorsDiv = document.getElementById('top-three-contributors');
  topThreeContributorsDiv.innerHTML = `<div>
  <p>${topThreeContributors[0].user}: ${topThreeContributors[0].messageCount}</p>
  <p>${topThreeContributors[1].user}: ${topThreeContributors[1].messageCount}</p>
  </div>`;
}

function buildUserWithMostLikes(messages) {
  // eslint-disable-next-line no-undef
  const sortedUserLikesCount = _.orderBy(
    getUsersWithPropertyCount(messages, 'likedUserEmails'),
    ['propertyCount'],
    ['desc'],
  ).slice(0, 1);

  const userWithMostLikesDiv = document.getElementById('user-with-most-likes');
  userWithMostLikesDiv.innerHTML = `<p>${sortedUserLikesCount[0].user}</p>`;
}

function buildUserWithMostFavourites(messages) {
  // eslint-disable-next-line no-undef
  const sortedUserFavouritesCount = _.orderBy(
    getUsersWithPropertyCount(messages, 'favouritedUserEmails'),
    ['propertyCount'],
    ['desc'],
  ).slice(0, 1);

  const userWithMostFavouritesDiv = document.getElementById('user-with-most-favourites');
  userWithMostFavouritesDiv.innerHTML = `<p>${sortedUserFavouritesCount[0].user}</p>`;
}

function buildAchievements(messages) {
  buildTopThreeContributors(messages);
  buildUserWithMostLikes(messages);
  buildUserWithMostFavourites(messages);
}

function fetchAllMessages() {
  const url = '/feed';
  fetch(url)
    .then(response => response.json())
    .then((messages) => {
      buildAchievements(messages);
    });
}

function buildUserDetail(detail) {
  return detail == null || detail === '' ? '' : `<p class="font-weight-light user-detail mb-0 text-muted">${detail}</p>`;
}

function buildUserListItem(user) {
  const userListItem = document.createElement('div');
  userListItem.classList.add('card', 'border-right-0', 'border-top-0', 'border-bottom-0', 'rounded-0');

  userListItem.innerHTML = `<div class="media">
                              <a class="mx-3 my-2" href="/user-page.html?user=${user.email}">
                                <img src="${user.profileImageUrl}" 
                                     class="user-profile-image rounded-circle" 
                                     alt="...">
                              </a>
                              <div class="media-body pt-1">
                                <a href="/user-page.html?user=${user.email}">
                                  <p class="mt-1 mb-1 font-weight-normal username">
                                    ${user.username != null
                                      && user.username !== '' ? user.username : user.email}
                                  </p>
                                </a>
                                ${buildUserDetail(user.location)}
                                ${buildUserDetail(user.organization)}
                              </div>
                            </div>`;
  return userListItem;
}

// Fetched users and adds them to the page
function fetchUserList() {
  const url = '/user-list';
  fetch(url)
    .then(response => response.json())
    .then((users) => {
      const list = document.getElementById('user-card-container');
      list.innerHTML = '';

      users.forEach((user) => {
        const userListItem = buildUserListItem(user);
        list.appendChild(userListItem);
      });
    });
}

// Fetches data and populates the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchAllMessages();
  fetchUserList();
}
