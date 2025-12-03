import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import pg from "pg";
import session from "express-session";

const app = express();
const port = 3000;

dotenv.config();

const apiKey = process.env.API_KEY;

app.use(
  session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      secure:false,
      maxAge:1000 * 60 * 60 * 24
    }
  })
);

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

function preventBrowserCache(req, res, next){
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.set('Expires', '0');
  res.set('Pragma', 'no-cache');
  next();
}

app.get("/", (req, res) => {
  res.render("login.ejs");
});
  
let username;
let password;
let user;

app.post("/login", preventBrowserCache, async(req,res) =>{
  try{
    username = req.body.username;
    password = req.body.password;
    let result = await db.query("SELECT * FROM users WHERE username = ($1) AND password = ($2)",[username,password]);
    user = result.rows;
    if(user.length > 0){
      req.session.isAuthenticated = true;
      req.session.username = user.username;
      res.render("home.ejs",{ username : username});
      console.log("Login succesful");
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

app.post("/account", async (req, res) =>{
  console.log(username);  
  console.log(password);  
  const result = await db.query("SELECT mail, fruit FROM users WHERE username = ($1) AND password = ($2)",[username, password]);
  let items = result.rows[0];
  res.render("account.ejs",{
    username : username,
    mail : items.mail,
    fruit : items.fruit
  });
});

app.post("/about", (req, res) => {
  res.render("about.ejs");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err){
      console.log("Eroarea la distrugerea sesiunii:", err);
    } else {
      console.log("Delogare reusita. Sesiune distrusa");
      res.render("login.ejs");
    }
  });
});

app.post("/goBackFromAccount", (req, res) =>{
  res.render("home.ejs", { username : username});
});

app.post("/goBackFromAbout", (req, res) =>{
  res.render("home.ejs", { username : username});
});

app.listen(port, () => {
  console.log(`Movie Tracker App listening at http://localhost:${port}`);
});