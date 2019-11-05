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

// load desktop css:
const windowMinWidth = window.matchMedia("(min-width: 480px)");

if (windowMinWidth.matches) {
  const head = document.querySelector('head');
  const style = document.createElement('link');
  style.rel = "stylesheet";
  style.href = "css/desktop.css";
  head.appendChild(style);

} else {
  document.querySelector(".title__img").src = "images/tree.jpg";
}

window.addEventListener('DOMContentLoaded', () => {
  // header section events:
  document.querySelector("#goNav").addEventListener("click", () => {
    document.querySelector("#navigation").scrollIntoView();
  });

  // navigation section events:
  // Set button disabled:
  document.querySelector(".choice__button").disabled = true;
  document.querySelector(".choice__button").classList.add("disabled");

  // Set country value:
  if (countriesArray.indexOf(getCookie("country")) !== -1) {
    document.querySelector("#country").value = getCookie("country");
    if (inputFlag === 0) {
      document.querySelector(".choice__label").classList.add("choice__label--active");
      document.querySelector(".choice__input").classList.add("choice__input--active");
      inputFlag = 1;

      document.querySelector("#verifier").classList.remove("fa-times");
      document.querySelector("#verifier").classList.add("fa-check");
      document.querySelector(".choice__button").disabled = false;
      document.querySelector(".choice__button").classList.remove("disabled");
    }
  }

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
    createCookie(document.querySelector("#country").value);
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
    const text = document.createElement('span');
    const city = document.createElement('span');
    const header = document.createElement('h3');
    const button = document.createElement('button');

    city.classList.add("city");

    header.classList.add("city__header");
    header.innerText = index + 1 + ". " + array[index];

    text.classList.add("city__information");
    text.classList.add("city__information--hidden");
    text.classList.add("city__information--unloaded");
    button.classList.add("city__button");

    button.innerText = "i";

    city.appendChild(header);
    city.appendChild(button);
    city.appendChild(text);
    main.appendChild(city);

    button.addEventListener("click", (e) => showInfo(e));
  };

  document.querySelector("body").append(main);

  document.querySelector("#cities").scrollIntoView();
  document.querySelector(".choice__button").innerText = "Show cities";
  document.querySelector(".choice__button").disabled = false;
}

function showInfo(e) {
  const city = e.target.closest(".city");
  const text = city.querySelector(".city__information");
  const cityName = city.querySelector(".city__header").innerText.slice(3);
  // console.log(cityName);

  if (text === city.querySelector(".city__information--unloaded")) {
    // console.log("unloaded");

    const span = document.createElement('span');
    const info = document.createElement('p');
    const link = document.createElement('a');
    info.classList.add("info");
    link.classList.add("link");

    getDataFromWiki(cityName, info, link).then(function(response) {
      span.append(info);
      span.append(link);
      text.appendChild(span);
      // text.appendChild(link);
      return response;
    }).then(function(response) {
      text.classList.remove("city__information--unloaded");
      text.classList.toggle("city__information--hidden");
      return response;
    });
  } else {
    // console.log("nothing to do");
    text.classList.toggle("city__information--hidden");
  }
}


async function getDataFromWiki(cityName, info, link) {
  let url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${cityName}&limit=1&namespace=0&format=json`;
  // let imgUrl = `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${cityName}`;

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(response) {
    // console.log(response.query.pages[90580].extract);
    console.log(response)
  })

  // fetch(url)
  //   .then(function(response){
  //     return response.json();
  //   })
  //   .then(function(response) {
  //     // console.log(response);
  //     if (response[2][0] === "") {
  //       info.innerText = "Sorry we cannot find any short information about this city. Please check full version of article here:";  
  //     } else if(response[2][0] === undefined && response[3][0] === undefined){
  //       info.innerText = "Sorry we cannot find any information about this city."; 
  //     } else {
  //       info.innerText = response[2][0];
  //     }
  //     return response;
  //   })
  //   .then(function(response) {
  //     if (response[3][0] === undefined) {
  //       link.classList.add("link--hidden");
  //     } else {
  //       link.innerText = "More informations";
  //       link.href = response[3][0];
  //     }
  //     return response;
  //   })
  //   .catch(function(error){
  //     console.log(error);
  //   });
}


// create cookie (remember input value):
function createCookie(countryName) {
  if (navigator.cookieEnabled) {
    let data = new Date();
    data.setTime(data.getTime() + (24*60*60*1000));
    let cookieValue = encodeURIComponent("country") + "=" + encodeURIComponent(countryName) + ";expires=" + data.toGMTString();

    document.cookie = cookieValue;
  }
}

// get cookie value:
function getCookie(name) {
  if (document.cookie !== "") {
    const cookies = document.cookie.split(/; */);

    for (let i=0; i<cookies.length; i++) {
      const cookieName = cookies[i].split("=")[0];
      const cookieVal = cookies[i].split("=")[1];
      if (cookieName === decodeURIComponent(name)) {
          return decodeURIComponent(cookieVal);
      }
    }
  }
}