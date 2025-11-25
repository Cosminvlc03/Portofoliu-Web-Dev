import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import pg from "pg";

const app = express();
const port = 3000;

dotenv.config();

const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/misc', express.static('misc'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "movies",
  password: "HonestHearts21",
  port: 5432,
});

db.connect();

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async(req,res) =>{
  try{
    const username = req.body.username;
    const password = req.body.password;
    const result = await db.query("SELECT * FROM users WHERE username = ($1) AND password = ($2)",[username,password]);
    let user = result.rows;
    if(user.length > 0){
      res.render("home.ejs");
      console.log("Login succesful")
    } else {
      console.log("Invalid username or password");
      res.render("login.ejs", { error: "Invalid username or password"});
    }
  } catch(err) {
    console.log(err);
  }
});

app.post("/forgotten", (req,res) =>{
  res.render("forgotten.ejs");
});

app.post("/signup", (req,res) => {
  res.render("signup.ejs")
});

app.listen(port, () => {
  console.log(`Movie Tracker App listening at http://localhost:${port}`);
});