const carouselItems = [
  {
    active: true,
    imageUrl: 'images/landing-carousel/singapore.jpg',
    location: 'Singapore, Singapore',
  },
  {
    imageUrl: 'images/landing-carousel/greece-santorini.jpg',
    location: 'Santorini, Greece',
  },
  {
    imageUrl: 'images/landing-carousel/india-goa.jpg',
    location: 'Goa, India',
  },
  {
    imageUrl: 'images/landing-carousel/indonesia-bali.jpg',
    location: 'Bali, Indonesia',
  },
  {
    imageUrl: 'images/landing-carousel/spain-mallorca.jpg',
    location: 'Mallorca, Spain',
  },
];

function buildCarouselItem(item) {
  const carouselItem = document.createElement('div');
  carouselItem.classList.add('carousel-item');
  if (item.active != null && item.active) {
    carouselItem.classList.add('active');
  }
  carouselItem.innerHTML = `<img src="${item.imageUrl}" class="d-block w-100 carousel-image"/>
                            <div class="carousel-caption d-md-block">
                              <i class="fas fa-map-marker-alt location-icon"></i>
                              <div class="d-inline-block ml-2"><p class="location-text"><a href="https://www.google.com.sg/maps/place/${item.location}">${item.location}</a></p></div>
                            </div>`;
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
  document.getElementById('landing-overlay').classList.remove('hidden');
}
