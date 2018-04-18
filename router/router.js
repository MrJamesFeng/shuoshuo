var formidable = require('formidable')
var md5 = require('../model/md5.js')
var util = require('util')
var db = require('../model/db.js')

exports.showIndex = (req,res,next)=>{

	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:"首页"
	}
	res.render("index",renderData)

}

exports.register = (req,res,next)=>{
	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:""
	}
	res.render("regist",renderData)
}

exports.doRegist = (req,res,next)=>{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
	res.writeHead(200, {'content-type': 'text/plain'});
	var username = fields.username
	var password = fields.password
	password = md5(password)
	db.find("users",{username:username},(err,response)=>{
		if (err) {
			res.end("-3")
		}else if(response.length==0){
			req.session.login = "1"
			req.session.username = username
			// req.seesion.password = password
			db.insertOne("users",{username:username,password:password},(err,response)=>{

			})
			res.end("1")
		}else{

			res.end("-1")}
	})
	console.log(fields.username,fields.password,password);
	// res.end(util.inspect({fields: fields,files: files}));
})
}

exports.showlogin = (req,res,next)=>{
	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:""
	}
	res.render("login",renderData)
}

exports.login = (req,res,next)=>{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'content-type': 'text/plain'});
		var username = fields.username
		var password = fields.password
		password = md5(password)
		db.find("users",{username:username},(err,response)=>{
			console.log("find:",username,response);
			var user = response[0]

			if (err) {
				res.end("-3")
			}else if(response.length==1){
				if (user.password!=password) {
					res.end("-2")
				}
				req.session.login = "1"
				req.session.username = username

				res.end("1")
			}else{
				res.end("-1")
			}
		})
	})
}
// 头像
exports.showAvatar = (req,res,next)=>{
	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:""
	}
	res.render("avatar",renderData)
}

exports.avatar = (req,res,next)=>{

	
}