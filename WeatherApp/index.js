import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from 'dotenv';

const app = express();
const port = 3000;

dotenv.config();

const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/misc', express.static('misc'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cityCoordsAPI = "https://geocode.maps.co/";
const weatherAPI = "https://api.open-meteo.com/v1/";

app.get("/", (req, res) => {
  res.render("home.ejs");
});

let city;

app.post("/submit",(req, res) => {
  city = req.body.city;
  console.log(`City submitted: ${city}`);
  res.redirect("/weather");

});

let weather;

app.get("/weather", async(req, res) => {
  try{
    const coordResponse = await axios.get(`${cityCoordsAPI}search`, {
      params: {
        q: city,
        limit: 1
      }
    });
    const { lat, lon } = coordResponse.data[0];
    const weatherResponse = await axios.get(`${weatherAPI}forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: 'precipitation_probability'
        
      }
    });
    weather = weatherResponse.data.current_weather.temperature + "°C" + ", Precipitation Probability: " + weatherResponse.data.hourly.precipitation_probability[0] + "%";
    console.log(`Weather fetched: ${weather}`);
    res.render("weather.ejs", { city, weather });
  }
  catch (error) {
    console.error("Error fetching weather data:", error);
    res.render("weather.ejs", { city });
  }
});

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});

