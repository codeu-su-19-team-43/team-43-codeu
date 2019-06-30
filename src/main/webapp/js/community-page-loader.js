function buildUserDetail(detail) {
  return (detail == null || detail === '') ? ''
    : `<p class="font-weight-light user-detail mb-0 text-muted">${detail}</p>`;
}

function buildUserListItem(user) {
  const userListItem = document.createElement('div');
  userListItem.classList.add('card', 'border-right-0', 'border-top-0', 'border-bottom-0', 'rounded-0');

  userListItem.innerHTML = `<div class="media">
                              <a class="mx-3 my-2" href="/user-page.html?user=${user.email}">
                                <img src="./images/aboutus-avatar-anqi.jpg" 
                                     class="user-profile-image rounded-circle" 
                                     alt="...">
                              </a>
                              <div class="media-body pt-1">
                                <a href="/user-page.html?user=${user.email}">
                                  <p class="mt-1 mb-1 font-weight-normal username">
                                    ${user.username != null && user.username !== '' ? user.username : user.email}
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
  fetch(url).then(response => response.json()).then((users) => {
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
  fetchUserList();
}
