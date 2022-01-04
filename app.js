const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "labPracticalsDB",
});

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "Keep it secret",
    name: "uniqueSessionID",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session is stored 30 days
    }
  })
);

app.get("/", (req, res) => {
  if (req.session.loggedIn) res.render("home");
  else res.redirect("/login");
});

app.get("/login", (req, res) => {
    if (req.session.loggedIn) res.redirect("/");
    else res.render("login", { msg : null});
});

app.post("/login", (req, res, next) => {
    // Actual implementation would check values in a database
    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "SELECT * FROM accounts WHERE username = ? AND password = ?",
        [username, password],
        (error, result) => {
            if(error){
                res.sendStatus(401)
            } else if(result.length>0){
                res.locals.username = username
                next()
            } else {
                // no account
                res.render("login", {msg: "Account Not Found. Check Username and Password"})
            }
        }
    )
  },
  (req, res) => {
    req.session.loggedIn = true;
    req.session.username = res.locals.username;
    console.log(req.session);
    res.redirect("/");
  }
);

app.get('/logout',(req,res)=>
{
    req.session.destroy((err)=>{})
    res.redirect('/')
})

app.get('/register', (req, res) => {
    if (req.session.loggedIn) res.redirect("/");
    else res.render("register", { msg : null});
})

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query(
      "INSERT INTO accounts values (null, ?, ?, false)",
      [username, password],
      (error, result) =>{
          if(error){
              res.render("register", {msg : "Registeration Failed. Try another username"})
          } else {
              res.redirect("/login")
          }
      }
    )
})
app.listen(port, () => {
  console.log("Website is running");
});
