let inputFlag = 0; // input active or not

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// array with countries:
const countriesArray = ["Poland", "Germany", "Spain", "France"];
// country symbol:
let country = "";

// API:
let request = new XMLHttpRequest();
let pollutedCities = [];
let limit = 50;
let pollutedCitiesDistinct = [];


window.addEventListener('DOMContentLoaded', () => {

  // header section events:
  document.querySelector("#goNav").addEventListener("click", () => {
    document.querySelector("#navigation").scrollIntoView();
  });

  // navigation section events:
  // Set button disabled:
  document.querySelector(".choice__button").disabled = true;
  document.querySelector(".choice__button").classList.add("disabled");

  // nav: input enabling:
  document.querySelector("#country").addEventListener("click", (e) => {
    if (inputFlag === 0) {
      document.querySelector(".choice__label").classList.add("choice__label--active");
      document.querySelector(".choice__input").classList.add("choice__input--active");
      inputFlag = 1;
      // console.log("active");
    }
  });

  // nav: verifier change:
  document.querySelector("#country").addEventListener("keyup", (e) => {

    if (countriesArray.indexOf(document.querySelector("#country").value) !== -1) {
      document.querySelector("#verifier").classList.remove("fa-times");
      document.querySelector("#verifier").classList.add("fa-check");
      document.querySelector(".choice__button").disabled = false;
      document.querySelector(".choice__button").classList.remove("disabled");
    } else {
      document.querySelector("#verifier").classList.add("fa-times");
      document.querySelector("#verifier").classList.remove("fa-check");
      document.querySelector(".choice__button").disabled = true;
      document.querySelector(".choice__button").classList.add("disabled");
    }

  });

  // nav: input disabling:
  document.addEventListener("click", (e) => {

    if (inputFlag === 1 && document.querySelector("#country").value === "" && e.target.id !== "country") {
      document.querySelector(".choice__label").classList.remove("choice__label--active");
      document.querySelector(".choice__input").classList.remove("choice__input--active");
      inputFlag = 0;
    }
  });

  // nav: button: 
  document.querySelector(".choice__button").addEventListener("click", () => {
    // get data from openaq API:
    getPollutedCities();
    document.querySelector(".choice__button").innerText = "Loading...";
    document.querySelector(".choice__button").disabled = true;
  });

  // create datalist with countries:
  countriesArray.forEach(element => {
    const option = document.createElement('option');
    option.innerText = element;

    document.querySelector("#countryList").append(option);
  });

});

// functions:

// Set country shortcut
function getPollutedCities() {
  switch (document.querySelector("#country").value) {
    case "Poland":
      country = "PL";
      break;
    case "Germany":
      country = "DE";
      break;
    case "Spain":
      country = "ES";
      break;
    case "France":
      country = "FR";
      break;
  }

  limit = 25;

  getDataFromOpenaq();
}

// Get 10 distinct cities from API
function getDataFromOpenaq() {
  pollutedCitiesDistinct = [];
  request = new XMLHttpRequest();
  pollutedCities = [];
  limit *= 2;

  getData(country, limit).then(data => {
    data.results.forEach(city => {
      pollutedCities.push(city.city);
    })
    pollutedCitiesDistinct = [...new Set(pollutedCities)];    

    if (pollutedCitiesDistinct.length < 10)
    { 
      // console.log("Once more");
      getDataFromOpenaq();
    } else {
      createMainSection(pollutedCitiesDistinct);
    }
  });
}

// Get data from OpenAQ API 
async function getData(country, limit) 
{
  let response = await fetch(`https://api.openaq.org/v1/measurements?country=${country}&parameter=pm25&date_from=2019-07-01&order_by=value&sort=desc&limit=${limit}`);
  let data = await response.json()
  return data;
}

// Create section with 10 most polluted cities in country
function createMainSection(array) {
  if (document.querySelector(".cities") !== null) {
    document.querySelector(".cities").remove();
  }
  
  const main = document.createElement('main');
  main.classList.add("cities");
  main.id = "cities";

  for (let index = 0; index < 10; index++) {
    const city = document.createElement('span');
    const header = document.createElement('h3');
    // const text = document.createElement('p');
    const button = document.createElement('button');

    city.classList.add("city");

    header.classList.add("city__header");
    header.innerText = index+1 + ". "+array[index];

    // text.classList.add("city__information");
    // text.innerText = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id eius, ipsam repellat velit recusandae eaque aliquid autem deleniti voluptates deserunt officia vero exercitationem nostrum, voluptate voluptatibus pariatur nisi quis error.";

    button.classList.add("city__button");
    button.innerText = "i";

    city.appendChild(header);
    city.appendChild(button);
    // city.appendChild(text);
    main.appendChild(city);
  };

  document.querySelector("body").append(main);

  document.querySelector("#cities").scrollIntoView();
  document.querySelector(".choice__button").innerText = "Show cities";
  document.querySelector(".choice__button").disabled = false;
}