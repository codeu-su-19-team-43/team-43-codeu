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
  linkElement.className = 'nav-link font-weight-light';
  linkElement.href = url;
  linkElement.appendChild(document.createTextNode(text));
  return linkElement;
}

function createLinkListItem(url, text) {
  const link = createLink(url, text);
  if (url.split('.')[0] === window.location.pathname.split('.')[0]) {
    link.classList.add('active');
  }
  return createListItem(link);
}

/**
 * Adds a login or logout link to the page, depending on whether the user is
 * already logged in.
 */
// eslint-disable-next-line no-unused-vars
function addLoginOrLogoutLinkToNavigation() {
  const navigationElement = document.getElementById('navigation');

  fetch('/login-status')
    .then(response => response.json())
    .then((loginStatus) => {
      if (loginStatus.isLoggedIn) {
        const userPageLink = createLinkListItem(`/user-page.html?user=${loginStatus.username}`, 'My Page');
        const logoutLink = createLinkListItem('/logout', 'Logout');
        navigationElement.insertBefore(userPageLink, navigationElement.childNodes[1]);
        navigationElement.appendChild(logoutLink);
      } else {
        const loginLink = createLinkListItem('/login', 'Login');
        navigationElement.appendChild(loginLink);
      }
    });
}

function buildNavigationLinks() {
  const navigationElement = document.getElementById('navigation');

  const links = [
    createLinkListItem('/', 'Home'),
    createLinkListItem('/feed.html', 'Feed'),
    createLinkListItem('/community.html', 'Community'),
    createLinkListItem('/charts.html', 'Charts'),
    createLinkListItem('/aboutus.html', 'About'),
    createLinkListItem('/google-map.html', 'Map'),
  ];

  links.forEach(link => navigationElement.appendChild(link));

  addLoginOrLogoutLinkToNavigation();
}

// Set transparency of navigation bar
function setTransparency() {
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const navBar = document.getElementById('navigationBar');
    navBar.className = 'navbar navbar-expand-lg d-flex fixed-top navbar-dark transparent navBarTransparent';
  }
}

// Remove transparency of navigation bar in index.html on scrolling over landing page description
function scrollTransparency() {
  if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    return;
  }

  let scrollStart = 0;
  const landingPageDescription = $('.landing-page-description');
  const offset = landingPageDescription.offset();
  if (landingPageDescription.length) {
    $(document).scroll(function changeTransparencyOnScroll() {
      const navBar = document.getElementById('navigationBar');
      scrollStart = $(this).scrollTop();
      if (scrollStart > offset.top) {
        navBar.className = 'navbar navbar-expand-lg d-flex fixed-top border-bottom shadow-sm navbar-light bg-light';
      } else {
        navBar.className = 'navbar navbar-expand-lg d-flex fixed-top navbar-dark transparent navBarTransparent';
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
function loadNavigationBar() {
  const navElement = document.createElement('div');
  $(navElement).load('navigation-bar.html', () => {
    $(document).ready(() => {
      document.body.insertBefore(navElement, document.body.firstChild);
      buildNavigationLinks();
      setTransparency();
      scrollTransparency();
    });
  });
}

loadNavigationBar();
