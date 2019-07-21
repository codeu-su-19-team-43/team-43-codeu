/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Creates an li element.
 * @param {Element} childElement
 * @return {Element} li element
 */
function createListItem(childElement) {
  const listItemElement = document.createElement('li');
  listItemElement.className = 'nav-item';
  listItemElement.appendChild(childElement);
  return listItemElement;
}

/**
 * Creates an anchor element.
 * @param {string} url
 * @param {string} text
 * @return {Element} Anchor element
 */
function createLink(url, text) {
  const linkElement = document.createElement('a');
  linkElement.className = 'nav-link';
  linkElement.href = url;
  linkElement.appendChild(document.createTextNode(text));
  return linkElement;
}

function createLinkListItem(url, text) {
  const link = createLink(url, text);
  if (url.split('.')[0] === window.location.pathname.split('.')[0]) {
    link.classList.add('active-link');
  }
  return createListItem(link);
}

function buildNavigationLinks() {
  const navigationElement = document.getElementById('navbarContent');

  const navBarList = document.createElement('ul');
  navBarList.classList.add('navbar-nav', 'ml-auto');
  navBarList.id = 'navigation';

  const links = [
    createLinkListItem('/', 'Home'),
    createLinkListItem('/feed.html', 'Feed'),
    createLinkListItem('/community.html', 'Community'),
    createLinkListItem('/universe.html', 'Universe'),
    createLinkListItem('/charts.html', 'Charts'),
    createLinkListItem('/aboutus.html', 'About Us'),
  ];

  links.forEach(link => navBarList.appendChild(link));

  fetch('/login-status')
    .then(response => response.json())
    .then((loginStatus) => {
      if (loginStatus.isLoggedIn) {
        const userPageLink = createLinkListItem(`/user-page.html?user=${loginStatus.username}`, 'My Page');
        const logoutLink = createLinkListItem('/logout', 'Logout');
        navBarList.insertBefore(userPageLink, navBarList.childNodes[1]);
        navBarList.appendChild(logoutLink);
        navigationElement.appendChild(navBarList);
      } else {
        const loginLink = createLinkListItem('/login', 'Login');
        navBarList.appendChild(loginLink);
        navigationElement.appendChild(navBarList);
      }
    });
}

// Set transparency of navigation bar
function setTransparency() {
  const navBar = document.getElementById('navigationBar');
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    navBar.classList.remove('shadow-sm', 'non-transparent-nav-bar');
    navBar.classList.add('transparent-nav-bar');
  } else {
    navBar.classList.add('shadow-sm', 'non-transparent-nav-bar');
    navBar.classList.remove('transparent-nav-bar');
  }
}

// Remove transparency of navigation bar in index.html on scrolling over landing page description
function scrollTransparency() {
  if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    return;
  }

  let scrollStart = 0;
  const offset = 200;
  $(document).scroll(function changeTransparencyOnScroll() {
    const navBar = document.getElementById('navigationBar');
    scrollStart = $(this).scrollTop();
    if (scrollStart > offset) {
      navBar.classList.add('shadow-sm', 'non-transparent-nav-bar');
      navBar.classList.remove('transparent-nav-bar');
    } else {
      navBar.classList.remove('shadow-sm', 'non-transparent-nav-bar');
      navBar.classList.add('transparent-nav-bar');
    }
  });
}

// eslint-disable-next-line no-unused-vars
function loadNavigationBar() {
  const navElement = document.createElement('div');
  navElement.innerHTML = `<nav class="navbar navbar-expand-lg bg-light d-flex fixed-top px-5 transparent-nav-bar" id="navigationBar">
                            <a class="navbar-brand" href="/">
                              <img src="images/logo.png" width="30" height="30" alt="" />
                              <div class="d-inline-block ml-4"><p class="brand-name m-0">PhotoBook</p></div>
                            </a>
                            <button class="navbar-toggler toggler-button" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                              <i class="fas fa-bars"></i>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarContent">
                            </div>
                          </nav>`;

  document.body.insertBefore(navElement, document.body.firstChild);
  buildNavigationLinks();
  setTransparency();
  scrollTransparency();
}
