var express = require("express")
var app = express()
var router = require("./router/router.js")
app.set("view engine","ejs")
app.use(express.static("./public"))

app.get("/",router.showIndex)

app.get("/regist",router.register)

app.post("/doRegist",router.doRegist)


app.listen(3000)