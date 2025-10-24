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

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/submit",(req, res) => {
  res.redirect("/weather");
});

app.get("/weather", (req, res) => {
  res.render("weather.ejs");
});

app.listen(port, () => {
  console.log(`Weather app listening at http://localhost:${port}`);
});

