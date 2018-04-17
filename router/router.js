var formidable = require('formidable')
var util = require('util')

exports.showIndex = (req,res,next)=>{
	res.render("index")
}
exports.register = (req,res,next)=>{
	res.render("regist")
}

exports.doRegist = (req,res,next)=>{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
	res.writeHead(200, {'content-type': 'text/plain'});
	console.log("xxxxxxxxxxxxxxxxxxxxxx");
	res.end(util.inspect({fields: fields,files: files}));
})
}