var express = require("express")
var app = express()
var router = require("./router/router.js")
var session = require('express-session');

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set("view engine","ejs")
app.use(express.static("./public"))

app.get("/",router.showIndex)

app.get("/regist",router.register)
app.post("/doRegist",router.doRegist)

app.get("/showlogin",router.showlogin)
app.post("/login",router.login)

app.get("/showAvatar",router.showAvatar)

app.post("/avatar",router.avatar)

app.listen(3000)