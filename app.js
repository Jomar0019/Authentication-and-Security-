require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
    const email = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: email,
        password: password
    });

    newUser.save((err) => {
        if(err){
            console.log(err);
        } else {
            res.render("login");
        }
    });
});

app.post("/login", (req,res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email: email}, (err,result) => {
        if(err){
            console.log(err);
        } else {
            if(result){
                if(result.password === password){
                    res.render("secrets");
                } else {
                    res.render("login");
                }
            }
        }
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000.")
})
