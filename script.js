
function buildQueryURL() {

  const city = $("#searchCity").val().trim();

  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4535e384f0a4ea4ebc02ddb6fb1569c5`;
 
  console.log("---------------\nURL: " + queryURL + "\n---------------");

  return queryURL;
}

function updatePage(weatherData) {
  console.log(weatherData);
  console.log("------------------------------------");

  $("#mainCity").text(weatherData.name).append(` <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></img>`);

  $("#mainTemp").text("Temperature: " + weatherData.main.temp);

  $("#mainHumidity").text("Humidity: " + weatherData.main.humidity);

  $("#mainWind").text("Wind speed: " + weatherData.wind.speed);

  // $("#mainUV").text(weatherData.);

}

// function clear() {
//   $("#article-section").empty();
// }

$("#runSearch").on("click", function(event) {
  event.preventDefault();

  // clear();

  var queryURL = buildQueryURL();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});