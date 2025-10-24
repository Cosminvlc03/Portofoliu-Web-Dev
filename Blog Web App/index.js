import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let blog_posts = [];
let name;

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", (req, res) => {
    name = req.body["name"];
    res.redirect("/home");
});

app.get("/home", (req,res) => {
    res.render("home.ejs",{name : name, blog_posts : blog_posts});
});

app.post("/create",(req, res) => {
    res.render("create.ejs");
});

app.post("/blog_post",(req,res) => {
    const posts = {
        title : req.body["title"],
        content: req.body["blog"]
    };
    blog_posts.push(posts);
    res.redirect("/home");
});

app.post("/modify",(req, res) => {
    res.render("modify.ejs");
});

app.post("/update_post", (req, res) => {
    const title = req.body["update_title"];
    const updated_content = req.body["update_text"];
    const post_index = blog_posts.findIndex(post => post.title === title);
    if(post_index !== -1){
        blog_posts[post_index].content = updated_content;
        res.redirect("/home");
    } else {
        res.send("Post not found.");
    }
});

app.post("/delete_post", (req, res) =>{
    const post_to_delete = req.body["delete_title"];
    const init_length = blog_posts.length;
    blog_posts = blog_posts.filter(post => post.title !== post_to_delete);
    if(blog_posts.length < init_length){
        res.redirect("/home");
    } else {
        res.send("Post not found.");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});