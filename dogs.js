
async function loadCarouselImages() {
    const res = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await res.json();
    const carousel = document.getElementById('dog-carousel');
  
    carousel.innerHTML = ''; 
  
    data.message.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Dog';
      img.style.width = '100%';
      carousel.appendChild(img);
    });
  

    simpleslider.getSlider();
  }
  

  async function loadBreedButtons() {
    const res = await fetch('https://dogapi.dog/api/v2/breeds');
    const data = await res.json();
    const breeds = data.data;
    const container = document.getElementById('breed-buttons');
  
    breeds.forEach(breed => {
      const btn = document.createElement('button');
      btn.textContent = breed.attributes.name;
      btn.classList.add('breed-button');
      btn.addEventListener('click', () => showBreedInfo(breed.attributes));
      container.appendChild(btn);
    });
  }
  

  function showBreedInfo(breed) {
    const infoContainer = document.getElementById('breed-info');
    infoContainer.innerHTML = `
      <h3>${breed.name}</h3>
      <p><strong>Description:</strong> ${breed.description}</p>
      <p><strong>Life Expectancy:</strong> ${breed.life.min} - ${breed.life.max} years</p>
    `;
    infoContainer.style.display = 'block';
  }
  

  window.onload = () => {
    loadCarouselImages();
    loadBreedButtons();
  };
  