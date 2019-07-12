const carouselItems = [
  {
    active: true,
    imageUrl: 'images/landing-carousel/singapore.jpg',
    location: 'Singapoer, Singapore',
  },
  {
    imageUrl: 'images/landing-carousel/greece-santorini.jpg',
    location: 'Santorini, Greece',
  },
  {
    imageUrl: 'images/landing-carousel/india-goa.jpg',
  },
  {
    imageUrl: 'images/landing-carousel/indonesia-bali.jpg',
  },
  {
    imageUrl: 'images/landing-carousel/spain-mallorca.jpg',
  },
];

function buildCarouselItem(item) {
  const carouselItem = document.createElement('div');
  carouselItem.classList.add('carousel-item');
  if (item.active != null && item.active) {
    carouselItem.classList.add('active');
  }
  carouselItem.innerHTML = `<img src="${item.imageUrl}" class="d-block w-100 carousel-image"/>`;
  return carouselItem;
}

function buildCarousel() {
  const carouselContainer = document.getElementById('carousel-container');
  carouselItems.forEach((item) => {
    carouselContainer.appendChild(buildCarouselItem(item));
  });
}

// eslint-disable-next-line no-unused-vars
function buildUI() {
  buildCarousel();
}
