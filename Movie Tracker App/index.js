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
  password: process.env.DB_PASS,
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

app.post("/backLogin", (req,res) => {
  res.render("login.ejs");
});

app.post("/save", async(req,res) => {
  try{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const fruit = req.body.fruit;
    if((username.length > 0) && (email.length > 0) && (password.length > 0) && (fruit.length > 0)){
      await db.query("INSERT INTO users (username , mail, password, fruit) VALUES (($1), ($2), ($3), ($4))",[username, email, password, fruit]);
      console.log("Account Created Successfuly");
      res.render("login.ejs");
    } else {
      console.log("Account creation failed");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/getPassword", async(req,res) =>{
  try{
    const email = req.body.email;
    const fruit = req.body.fruit;
    const result = await db.query("SELECT password FROM users WHERE fruit = ($1) AND mail = ($2)", [fruit, email]);
    if (result.rows.length > 0){
      const user = result.rows[0];
      const userPassword = user.password;
      console.log("Parola recuperata");
      res.render("forgotten.ejs",{
        verificationSuccess : true,
        passwordToShow : userPassword,
        });
    } else{
      res.render("forgotten.ejs",{
        verificationSuccess : false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Movie Tracker App listening at http://localhost:${port}`);
});