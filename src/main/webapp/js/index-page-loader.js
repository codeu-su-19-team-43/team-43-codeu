const carouselItems = [
  {
    active: true,
    imageUrl: '../images/landing-carousel/greece-santorini.jpg',
  },
  {
    imageUrl: '../images/landing-carousel/india-goa.jpg',
  },
  {
    imageUrl: '../images/landing-carousel/indonesia-bali.jpg',
  },
  {
    imageUrl: '../images/landing-carousel/singapore-jewel.jpg',
  },
  {
    imageUrl: '../images/landing-carousel/spain-mallorca.jpg',
  },
];

function buildCarouselItem(item) {
  const carouselItem = document.createElement('div');
  carouselItem.classList.add('carousel-item');
  console.log(item.active);
  if (item.active != null && item.active) {
    carouselItem.classList.add('active');
  }
  carouselItem.style.backgroundImage = `url(${item.imageUrl})`;
  carouselItem.innerHTML = `<div class="landing-tagline" >
                              <h1 class="display-4 text-center">
                                <big><big>PhotoBook</big></big>
                              </h1>
                              <h3 class="font-weight-lightest text-center">
                                Shoot. Share. Explore.
                              </h3>
                            </div >`;
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
