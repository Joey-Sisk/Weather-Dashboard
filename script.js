
function buildQueryURL() {

  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${$("#searchCity").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;
  
  console.log("---------------\nBasic URL: " + queryURL + "\n---------------");
  
  return queryURL;
}

function updatePage(weatherData) {

  $("#mainCity").text(weatherData.name).append(` <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></img>`);

  $("#mainTemp").text("Temperature: " + weatherData.main.temp);

  $("#mainHumidity").text("Humidity: " + weatherData.main.humidity);

  $("#mainWind").text("Wind speed: " + weatherData.wind.speed);

  const UVQueryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5`;

  console.log("---------------\nUV URL: " + UVQueryURL + "\n---------------");

  $.ajax({
    url: UVQueryURL,
    method: "GET"
  }).then(function(UVWeatherData) {

    $("#mainUV").text("UV Index: " + UVWeatherData.value);

  });

  const forcastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${$("#searchCity").val().trim()}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5&units=imperial`;

  console.log("---------------\nForcast UV URL: " + forcastQueryURL + "\n---------------");

  $.ajax({
    url: forcastQueryURL,
    method: "GET"
  }).then(function(forcastWeatherData) {

    for (let i = 0; i < 5; i++) {
      
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

    for (let i = 0; i < 5; i++) {
      
      let forcastDate = forcastWeatherData.list[i * 8 + 3].dt_txt;

     

      $(`${'#date' + i}`).text(forcastDate.slice(5, 10));

      $(`${'#icon' + i}`).append(`<img src="http://openweathermap.org/img/wn/${forcastWeatherData.list[i * 8 + 3].weather[0].icon}.png"></img>`);

      $(`${'#temp' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.temp);

      $(`${'#humidity' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.humidity);

       console.log("---------------\ntemp: " + (forcastWeatherData.list[i * 8 + 3].main.temp) + "\n---------------");

    }

  });

}

function updatePageUV(UVWeatherData) {
  console.log("---------------\nUVweatherData: " + UVWeatherData + "\n---------------");
  
  $("#mainUV").text("UV Index : " + UVWeatherData);

  
  
}

$("#runSearch").on("click", function(event) {
  event.preventDefault();

  // $("#location").empty();

  const queryURL = buildQueryURL();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);

});