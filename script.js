
let savedCities = { // fill out the city buttons.
  city0: "",
  city1: "",
  city2: "",
  city3: ""
};

function buildQueryURL() { // build the first API url for the current day

  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${$("#searchCity").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;

  console.log("---------------\nBasic URL: " + queryURL + "\n---------------");

  return queryURL;
}

function updatePage(weatherData) { // load data to page and fill out UV and forcast API's

  $("#mainCity").text(weatherData.name).append(` <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></img>`);

  $("#mainTemp").text("Temperature: " + weatherData.main.temp);

  $("#mainHumidity").text("Humidity: " + weatherData.main.humidity);

  $("#mainWind").text("Wind speed: " + weatherData.wind.speed);

  // UV API

  const UVQueryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5`;

  console.log("---------------\nUV URL: " + UVQueryURL + "\n---------------");

  $.ajax({
    url: UVQueryURL,
    method: "GET"
  }).then(function (UVWeatherData) {

    $("#mainUV").text("UV Index: " + UVWeatherData.value);

  });

  // forcast API

  const forcastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${$("#searchCity").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;

  console.log("---------------\nForcast UV URL: " + forcastQueryURL + "\n---------------");

  $.ajax({
    url: forcastQueryURL,
    method: "GET"
  }).then(function (forcastWeatherData) {

    for (let i = 0; i < 5; i++) { // print 5 day forcast cards

      const fiveDayTemplate = `
      <div class="col">
        <div id="${'card' + i}" class="card bg-primary text-white p-2 mt-1 mb-1" style="width: 10rem;">
          <h4 id="${'date' + i}"></h4>
          <p id="${'icon' + i}"></p>
          <p id="${'temp' + i}">Temp: </p>
          <p id="${'humidity' + i}">Humidity: </p>
        </div>
      </div>
      `;

      $("#fiveDayCards").append(fiveDayTemplate);

    }

    for (let i = 0; i < 5; i++) { // weather at noon for each day

      let forcastDate = forcastWeatherData.list[i * 8 + 3].dt_txt;



      $(`${'#date' + i}`).text(forcastDate.slice(5, 10));

      $(`${'#icon' + i}`).append(`<img src="http://openweathermap.org/img/wn/${forcastWeatherData.list[i * 8 + 3].weather[0].icon}.png"></img>`);

      $(`${'#temp' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.temp);

      $(`${'#humidity' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.humidity);

    }

  });

}

function checkStorage() { // load previously saved cities
  let previously = JSON.parse(localStorage.getItem("cities"));
  if (previously) {
    savedCities = previously;
  } else {
    localStorage.setItem("cities", JSON.stringify(savedCities));
  }
}

function saveCities() { // save most recent search and move each item down one

  savedCities[3] = savedCities[2];
  savedCities[2] = savedCities[1];
  savedCities[1] = savedCities[0];
  savedCities[0] = $("#searchCity").val().trim();
  
  localStorage.setItem("cities", JSON.stringify(savedCities));

  printCities();

}

function printCities() { // print cities from storage to the stage

  // $("#city0").text("Boston");


  for (let i = 0; i < 4; i++) {
    const citySpot = "city" + i;

    console.log("---------------\ncitySpot: " + savedCities.citySpot + "\n---------------");

    $(`${'#city' + i}`).text(savedCities.citySpot);
    
  }
}

$("#runSearch").on("click", function (event) { // when user enters city in textbox
  event.preventDefault();

  $("#fiveDayCards").empty();

  const queryURL = buildQueryURL();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);

  saveCities();
});

checkStorage(); // check local storage