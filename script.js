const urlParameters = new Proxy(new URLSearchParams(window.location.search), {
  get: (params, property) => params.get(property)
});
const zipCodeParameter = urlParameters['zip-code'];
const placeInformationArray = [
  {
    label: 'City',
    dataLabel: 'place name'
  },
  {
    label: 'Latitude',
    dataLabel: 'latitude'
  },
  {
    label: 'Longitude',
    dataLabel: 'longitude'
  }
];

const updateDOMWithResult = res => {
  if (res && Object.keys(res).length > 0) {
    // Handle 200 status code
    const zipCodeInfoDiv = document.getElementsByClassName('zip-code-info');
    zipCodeInfoDiv[0].innerHTML += `<h3 class="info-title">Results for zip code ${res['post code']}:</h3>`;
  
    for (let place of res.places) {
      // Loop through and display data from api for each place found by zip code
      for (let placeInformation of placeInformationArray) {
        zipCodeInfoDiv[0].innerHTML += `<div class="info-line-item">
          <h3 class="info-data">${placeInformation.label}:
          <h3 class="info-data">${place[placeInformation.dataLabel]}</h3>
        </div>`;
      }
  
      zipCodeInfoDiv[0].innerHTML += `<h3 class="image-title">${place['place name']} is found in ${place.state}!</h3>`;
      zipCodeInfoDiv[0].innerHTML += `<img class="svg-image" src="./states/${place['state abbreviation']}.svg" alt="An image of ${place.state}">`;
    }
  } else {
    // Handle 404 status code
    const zipCodeInfoDiv = document.getElementsByClassName('zip-code-info');
    zipCodeInfoDiv[0].innerHTML += `<h3 class="error-title">Uh oh! It looks like there was not any information available for the zip code provided.</h3>
    <h3 class="error-info">Please try another request with a five number format (e.g. 77706)</h3>`;
  }
};

const makeGetRequest = async zipCodeParameter => {
  fetch(`https://api.zippopotam.us/us/${zipCodeParameter}`)
    .then(data => data.json())
    .then(res => updateDOMWithResult(res))
    .catch(err => {
      throw err
    });
};

if (zipCodeParameter) {
  try {
    makeGetRequest(zipCodeParameter);
  } catch (error) {
    console.error(error);
    alert(`Oh no! It looks like an error has occurred. Please try again.`);
  }
}