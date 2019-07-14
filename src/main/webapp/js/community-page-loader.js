function buildUserDetail(detail) {
  return detail == null || detail === '' ? '' : `<p class="font-weight-light user-detail mb-0 text-muted">${detail}</p>`;
}

function getUserListHtml(user) {
  return `<div class="media">
            <a class="mx-3 my-2" href="/user-page.html?user=${user.email}">
              <img src="${user.profileImageUrl}" class="user-profile-image rounded-circle" alt="user profile image">
            </a>
            <div class="media-body pt-1 text-left">
              <a href="/user-page.html?user=${user.email}">
                <p class="mt-1 mb-1 font-weight-normal username">
                  ${user.username != null && user.username !== '' ? user.username : user.email}
                </p>
              </a>
              ${buildUserDetail(user.location)}
              ${buildUserDetail(user.organization)}
              ${user.numLikes !== undefined && user.numLikes !== null ? buildUserDetail(`Likes: ${user.numLikes}`) : ''}
              ${user.numFavourites !== undefined && user.numFavourites !== null ? buildUserDetail(`Favourites: ${user.numFavourites}`) : ''}
              ${user.messageCount !== undefined && user.messageCount !== null ? buildUserDetail(`Message Count: ${user.messageCount}`) : ''}
            </div>
          </div>`;
}

function buildUserListItem(user) {
  const userListItem = document.createElement('div');
  userListItem.classList.add('card', 'border-0');

  userListItem.innerHTML = getUserListHtml(user);

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

  let topThreeContributorsListHtml = '';
  topThreeContributors.forEach((contributor) => {
    const url = `/user-profile?user=${contributor.user}`;
    fetch(url)
      .then(response => response.json())
      .then((user) => {
        const userWithMessageCount = {
          ...user,
          messageCount: contributor.messageCount,
        };

        topThreeContributorsListHtml += `<li class="list-group-item px-5">
                                           ${getUserListHtml(userWithMessageCount)}
                                         </li>`;
      }).then(() => {
        topThreeContributorsDiv.innerHTML = `<div class="card text-center">
                                               <div class="card-body px-0 pb-0">
                                                 <h5 class="card-title">Top Three Contributors</h5>
                                                 <ul class="list-group list-group-flush">
                                                   ${topThreeContributorsListHtml}
                                                 </ul>
                                               </div>
                                             </div>`;
      });
  });
}

function buildUserWithMostLikes(messages) {
  // eslint-disable-next-line no-undef
  const sortedUserLikesCount = _.orderBy(
    getUsersWithPropertyCount(messages, 'likedUserEmails'),
    ['propertyCount'],
    ['desc'],
  ).slice(0, 1);

  const userWithMostLikesDiv = document.getElementById('user-with-most-likes');
  const userWithMostLikesEmail = sortedUserLikesCount[0].user;
  const url = `/user-profile?user=${userWithMostLikesEmail}`;
  fetch(url)
    .then(response => response.json())
    .then((user) => {
      const userWithNumLikes = {
        ...user,
        numLikes: sortedUserLikesCount[0].propertyCount,
      };

      userWithMostLikesDiv.innerHTML = `<div class="card text-center">
                                          <div class="card-body px-0 pb-0">
                                            <h5 class="card-title">Most Liked User</h5>
                                              <ul class="list-group list-group-flush">
                                                <li class="list-group-item px-2">
                                                  ${getUserListHtml(userWithNumLikes)}
                                                </li>
                                              </ul>
                                          </div>
                                       </div>`;
    });
}

function buildUserWithMostFavourites(messages) {
  // eslint-disable-next-line no-undef
  const sortedUserFavouritesCount = _.orderBy(
    getUsersWithPropertyCount(messages, 'favouritedUserEmails'),
    ['propertyCount'],
    ['desc'],
  ).slice(0, 1);

  const userWithMostFavouritesDiv = document.getElementById('user-with-most-favourites');
  const userWithMostFavouritesEmail = sortedUserFavouritesCount[0].user;
  const url = `/user-profile?user=${userWithMostFavouritesEmail}`;
  fetch(url)
    .then(response => response.json())
    .then((user) => {
      const userWithNumFavourites = {
        ...user,
        numFavourites: sortedUserFavouritesCount[0].propertyCount,
      };

      userWithMostFavouritesDiv.innerHTML = `<div class="card text-center">
                                               <div class="card-body px-0 pb-0">
                                                 <h5 class="card-title">Most Favourited User</h5>
                                                 <ul class="list-group list-group-flush">
                                                  <li class="list-group-item px-2">
                                                    ${getUserListHtml(userWithNumFavourites)}
                                                  </li>
                                                </ul>
                                               </div>
                                             </div>`;
    });
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

// Fetches data and populates the UI of the page.
// eslint-disable-next-line no-unused-vars
function buildUI() {
  fetchAllMessages();
  fetchUserList();
}
