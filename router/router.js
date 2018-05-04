var formidable = require('formidable')
var md5 = require('../model/md5.js')
var util = require('util')
var db = require('../model/db.js')
var path = require("path");
var fs =require("fs")
var gm = require("gm")
exports.showIndex = (req,res,next)=>{

	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:"首页",
		 avatar:"avatar.jpg"
	}
	res.render("index",renderData)

}

exports.register = (req,res,next)=>{
	var renderData = {
		login:req.session.login=="1",
		 username:req.session.username,
		 active:"",
		 avatar:path.normalize(__dirname+"/../avatar/avatar.jpg")
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
		 active:"",
		 avatar:req.session.avatar
	}
	res.render("avatar",renderData)
}

exports.avatar = (req,res,next)=>{
	console.log("-------------avatar--------------");
	if (req.session.login!="1") {
		res.end("请先登录!")
	}
	console.log(" __dirname=", __dirname,path.normalize(__dirname+"/../avatar"));
	var form = new formidable.IncomingForm();

	form.uploadDir = path.normalize(__dirname+"/../avatar")
    form.parse(req, function (err, fields, files) {

        console.log(files);
        var oldpath = files.touxiang.path;

        var newpath = path.normalize(__dirname + "/../avatar" + "/" + req.session.username + ".jpg")
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("-1");
                return;
            }

            req.session.avatar = req.session.username + ".jpg"
            // 跳转到切的业务
            res.redirect("/cut");
        })
    });
    
	
}

exports.cut = (req,res,next)=>{
	res.render("cut",{avatar:req.session.avatar})

}
exports.docut = (req,res,next)=>{
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;
	// var filename = path.normalize(__dirname + "/../avatar" + "/" + req.session.avatar)
	var filename = req.session.avatar
	console.log(filename);
    gm("./avatar/"+filename)
        .crop(w, h, x, y)
        .resize(100, 100)
        .write("./avatar/"+filename, function (err) {
        	console.log(err);
            if (err) {
                res.send("-1");
                return;
            }
            //更改数据库当前用户的avatar这个值
            db.updateMany("users", {"username": req.session.username}, {
                $set: {"avatar": req.session.avatar}
            }, function (err, results) {
                res.send("1");
            });
        });
}

exports.doPost = (req,res,next)=>{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'content-type': 'text/plain'});
		var content = fields.content
		console.log("content="+content);
		db.insertOne("posts",{
			username:req.session.username,
			content:content,
			createTime:new Date(),
			avatar:req.session.avatar
		},(err,response)=>{
			if (err) {res.end("-1")}
			res.end("1")	
		})
	})
}

exports.getAllShuoshuo = (req,res,next)=>{
	db.find("posts",{},{"pageamount":9,"page":req.query.page,"sort":{"createTime":-1}},function(err,result){
		if (err) {
			res.end("-1")
			return
		}
		console.log({"posts":result});
		res.json({"result":result})
	})

}

exports.getUserinfo = (req,res,next)=>{
	console.log("getUserinfo==》"+req.query.username);
	// res.writeHead(200, {'content-type': 'text/plain'});
	db.find("users",{},{"username":req.query.username},function(err,result){
		if (err) {
			console.log("getUserinfo");
			console.log(err);
			res.end("-1")
			return
		}
		res.json({"result":result[0]})
		// console.log({"result":result});
	})
}
exports.getPostAmount = (req,res,next)=>{
	db.getAllCount("posts",function(count){
		res.end(count.toString())
	})

}

exports.showUser = (req,res,next)=>{
	console.log("showUser===>"+req.params["user"]);
	
	db.find("posts",{"username":req.params["user"]},function(err,result){
		var renderData = {
		 user:req.params["user"],
		 contents:result

	}
	console.log(renderData);
		res.render("user",renderData)
	})
		
	

}

exports.userlist= (req,res,next)=>{
	db.find("users",{},{"pageamount":9,"page":req.query.page,"sort":{"createTime":-1}},function(err,result){
		if (err) {
			res.end("-1")
			return
		}
		res.render("userlist",{"userlist":result})
	})
}