// eslint-disable-next-line no-unused-vars
const teams = [
  {
    name: 'Aadyaa Maddi',
    avatarPath: 'images/aboutus-avatar/aadyaa.jpg',
    details: [
      {
        subTitle: 'Summer Feelz',
        text: 'Exciting | Happy | Active',
      },
      {
        subTitle: 'Aspirational Hobby',
        text: 'If I had all the time and money in the world, I would become '
        + 'certified at kayaking. I find it really fun and exciting - it\'s a '
        + 'great workout as well! I\'ve gone kayaking in Singapore and Indonesia '
        + 'before, but I would love to go kayaking at some of the'
        + ' <a href="https://www.redbull.com/sg-en/best-kayaking-holidays">'
        + 'best paddling locations</a> in the world.',
      },
      {
        subTitle: 'Ask Me About',
        text: 'Books! I\'ve been reading books ever since I can '
        + 'remember. My favourite books while growing up were Anne of Green '
        + 'Gables and The Hobbit. I love getting lost in new worlds. I\'m '
        + 'currently reading a lot of science fiction and fantasy. I also enjoy '
        + 'classics, mystery, and graphic novels. Recommendations are welcome!',
      },
    ],
  },
  {
    name: 'Aditi Saini',
    avatarPath: './images/aboutus-avatar/aditi.jpg',
    details: [
      {
        subTitle: 'Summer Feelz',
        text: 'Contempt | Happy | Adventurous',
      },
      {
        subTitle: 'Aspirational Hobby',
        text: 'If I had all the time and money in the world, I '
        + 'would travel to different places of the world. I have '
        + 'always liked to explore different cultures. It gives me a distinct '
        + 'perspective of how life is in different places and communities and '
        + 'a completely new angle to think about possibilities that could exist.',
      },
      {
        subTitle: 'Ask Me About',
        text: 'I love painting and going on nature walks. Anything '
        + 'natural in the environment always fascinates me. I love '
        + 'colors and different shades that the sky makes at different times of '
        + 'the day. I feel painting is a form of self-expression that '
        + 'can convey a very deep meaning. I also enjoy '
        + 'nature walks because it calms me down and refreshes me to a whole '
        + 'new level.',
      },
    ],
  },
  {
    name: 'Anqi Tu',
    avatarPath: './images/aboutus-avatar/anqi.jpg',
    details: [
      {
        subTitle: 'Summer Feelz',
        text: 'Lucky | Enjoyable | Fulfilling',
      },
      {
        subTitle: 'Aspirational Hobby',
        text: 'If I had all the time and money in the world, I '
        + 'would open a dog cafe for dog-lovers to enjoy moments '
        + 'with dogs, especially for those not owning a dog. '
        + 'Dogs are my favourite animal and are known to have '
        + 'a magic mood-boosting power to help people cope with '
        + 'depression, anxiety and stress.',
      },
      {
        subTitle: 'Ask Me About',
        text: 'I enjoy doing yoga as it helps me reduce body pain and '
        + 'relieve mental stress. I enjoy stretching my muscle which takes away '
        + 'my back pain and shoulder pain due to sitting in front of the screen '
        + 'for almost entire day. Doing yoga also reminds me of focusing on and '
        + 'enjoy the current moment.',
      },
    ],
  },
  {
    name: 'Alexander Naberezhnov',
    avatarPath: './images/aboutus-avatar/alexander.jpg',
    details: [
      {
        subTitle: 'Summer Feelz',
        text: 'Happy | Adventurous | Active',
      },
      {
        subTitle: 'Aspirational Hobby',
        text: 'If I had all the time and money in the world and I got bored enjoying '
        + 'the life and traveling around the world, I would put them to make high-quality '
        + 'modern education available to people who are stuck without proper skills to succeed in live. ',
      },
      {
        subTitle: 'Ask Me About',
        text: 'Board games, fantasy, travel, immigration, obstacle races, martial arts, volleyball, being a parent of twins, chocolate, tea.',
      },
    ],
  },
];

function populateTeamCards() {
  const teamList = document.getElementById('team-list');

  teams.forEach((teammate) => {
    const teamCard = document.createElement('div');
    teamCard.className = 'card border-0 mb-5 shadow';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-center';

    const avatarHolder = document.createElement('div');
    avatarHolder.className = 'avatar-holder mx-auto mt-4';
    const avatarImage = document.createElement('img');
    avatarImage.src = teammate.avatarPath;
    avatarImage.alt = teammate.name;
    avatarImage.className = 'rounded-circle avatar';
    avatarHolder.appendChild(avatarImage);
    cardBody.appendChild(avatarHolder);

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title text-center mt-3';
    cardTitle.innerHTML = teammate.name;
    cardBody.appendChild(cardTitle);

    teammate.details.forEach((detail) => {
      const cardSDetailubtitle = document.createElement('h6');
      cardSDetailubtitle.className = 'card-subtitle mb-2 mt-4 text-muted';
      cardSDetailubtitle.innerHTML = detail.subTitle;
      cardBody.appendChild(cardSDetailubtitle);

      const cardDetailText = document.createElement('p');
      if (detail.text.length <= 30) {
        cardDetailText.className = 'card-text font-weight-light';
      } else {
        cardDetailText.className = 'card-text text-justify font-weight-light';
      }
      cardDetailText.innerHTML = detail.text;
      cardBody.appendChild(cardDetailText);
    });

    teamCard.appendChild(cardBody);
    teamList.appendChild(teamCard);
  });
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  populateTeamCards();
}
