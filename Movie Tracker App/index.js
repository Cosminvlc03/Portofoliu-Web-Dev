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
const baseURL = 'https://api.themoviedb.org/3';
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

let username;
let password;
let user;

function preventBrowserCache(req, res, next){
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.set('Expires', '0');
  res.set('Pragma', 'no-cache');
  next();
}

async function getMovieDetails(mediaId, mediaType = 'movie'){
  try{
    const detailsUrl = `${baseURL}/${mediaType}/${mediaId}?api_key=${apiKey}&append_to_response=credits`;
    const respone = await axios.get(detailsUrl);
    const data = respone.data;
    const mainActors = data.credits.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 5).map(actor => actor.name);
    const releaseDate = data.release_date || data.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    return {
      title: data.title || data.name,
      releaseYear: releaseYear,
      genres: data.genres.map(genre => genre.name) || [],
      photo: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path.trim()}` : null,
      description: data.overview,
      mainActors: mainActors
    };
  } catch(err){
    console.log(`Error fetching details for ID ${mediaId}`,err);
  }
}

async function searchAndGetDetails(query, noOfResults){
  console.log(`Searching for ${query}`);
  const maxResults = noOfResults;
  try{
    const searchUrl = `${baseURL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    const respone = await axios.get(searchUrl);
    const searchResults = respone.data.results;
    if(!searchResults || searchResults.length === 0){
      console.log('No results found');
      return null;
    }
    const mediaToFetch = searchResults.filter(result => result.media_type !== 'person').slice(0, maxResults);

    const selectedMedia = mediaToFetch.map(result => {
      const mediaId = result.id;
      const mediaType = result.media_type;
      return getMovieDetails(mediaId, mediaType);
    });
    let detailedResults = await Promise.all(selectedMedia);
    detailedResults = detailedResults.filter(detail => detail !== null);
    return detailedResults;
  } catch(err){
    console.log(err);
    return null;
  }
}

app.get("/", (req, res) => {
  res.render("login.ejs");
});

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
      console.log(user);
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
      await db.query("INSERT INTO watchlist (user_id) VALUES ((SELECT id FROM users WHERE mail = ($1) AND password = ($2)))",[email, password]);
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

app.post("/goBackFromSearch", (req, res) => {
  res.render("home.ejs",{ username : username});
});

app.post("/searchMedia", async(req, res) =>{
  try{
    let title = req.body["search"];
    let details = await searchAndGetDetails(title, 4);
    console.log(details);
    const media = (details || []).map(item => ({
      title: item.title,
      image: (item.photo && item.photo.trim() !== '') ? item.photo.trim() : null
    }));
    res.render("search.ejs",{ media : media});
    media.length = 0;
  } catch(err){
    console.log(err);
  }
});

app.post("/mediaDetails", async(req, res) =>{
  try{
    let mediaTitle = req.body["mediaTitle"];
    let detailsArray = await searchAndGetDetails(mediaTitle, 1);
    let details = detailsArray[0];
    console.log(details);
    let title = details.title;
    let year = details.releaseYear;
    let type = details.genres.join(', ');
    let photo = details.photo;
    let description = details.description;
    let actors = details.mainActors;
    res.render("media.ejs", { title: title, year: year, type: type, photo: photo, description: description, actors: actors });
  } catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Movie Tracker App listening at http://localhost:${port}`);
});