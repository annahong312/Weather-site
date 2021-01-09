const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

// Add URL checker
var urlExists = require('url-exists');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const apiKey = "3e47c2b6f21460e4eced2ea842608054";
  const query = req.body.cityName;
  const units = req.body.units;
  const url = "https://api.openweathermap.org/data/2.5/weather?units=" + units + "&q=" + query + "&appid=" + apiKey;

  urlExists(url, function(err,exists){
    // URL Does not exist
    if (!exists){
      console.log("URL exists: " + exists);
      res.write("<h1>Please enter a valid city</h1>");
      res.send();
    }

    // URL exists - parse data from API
    else{
      https.get(url, function(response) {
        console.log(response);
        response.on("data", function(data) {
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp;
          const weatherDescription = weatherData.weather[0].description;

          var iconURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

          var nextUnit;
          if (units != "metric"  && units != "Metric" && (units != "imperial")  && (units != "Imperial")){
            res.write("<h1>Please enter a valid unit system</h1>");
            res.send();
          }
          else{
            if ((units === "metric") || (units === "Metric")) {
              nextUnit = "celsius";
            } else if ((units ==="imperial") || (units === "Imperial")) {
              nextUnit = "fahrenheit";
            }
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees " + nextUnit  + "</h1> ");
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<img src=" + iconURL + " alt='Weather Icon' > ");
            res.send();
          }
        });
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
