//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDb", {useNewUrlParser: true});
const userSkema = new mongoose.Schema({
    email: String,
    password: String
});


userSkema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const user = mongoose.model("user", userSkema); // "user" = nama tabel yang akan dibuat didatabase

app.get("/", function(req, res){
    res.render("home"); // respon menjalankan home.ejs di folder views
});

app.get("/login", function(req, res){
    res.render("login"); // respon menjalankan login.ejs di folder views
});

app.get("/register", function(req, res){
    res.render("register"); // respon menjalankan register.ejs di folder views
});

app.post("/register", function(req, res){
  const userBaru = new user(
    {
      email: req.body.username,
      password: req.body.password
    }
  );
  userBaru.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  user.findOne({email: username}, function(err, cocok){
      if(err){
        console.log(err);
      }else{
        if(cocok){
          if(cocok.password === password){
            res.render("secrets");
          }
        }
      }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});