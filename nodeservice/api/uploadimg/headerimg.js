var link = require('../../link');//引入连接数据库文件
var express = require('express');
var md5=require('md5-node');
var router=express.Router();
module.exports = router;
const fs = require('fs');

	var bodyParser = require('body-parser')
		router.use(bodyParser.urlencoded({limit:'10000kb',extended:true}))//限制数据大小
		router.use(bodyParser.json({limit:"10000kb"}))//限制数据大小
 //设置跨域访问
router.all('*', function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
	res.header("Access-Control-Allow-Credentials", true)
    next();
});

router.post('/upload', function(req, res){
   console.log("被调用")
    //接收前台POST过来的base64
    var imgData = req.body.imageUrl;
	var email = req.body.email;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
		fs.exists("./user_image",(exists)=>{//判断第一级目录user_image是否存在
			  if(exists){//如果存在
				 fs.exists("./user_image/"+email,(exists)=>{//判断二级目录是否存在
					 if(!exists){//如果不存在
					 				fs.mkdir('./user_image/' + email,(error)=>{//创建二级目录
					 					if(error){
					 						console.log(error);
					 						return false;
					 					}
										saveimg()
					 				})

					 }else{
						 saveimg()
					 }
				 })
			  }

			 if(!exists){//如果一级目录不存在
				fs.mkdir('./user_image',(error)=>{//创建一级目录user_image
					if(error){
						console.log(error);
						return false;
					}
					fs.mkdir('./user_image/'+email,(error)=>{//创建二级目录
						if(error){
							console.log(error);
							return false;
						}
						saveimg();
					})
				})

			 }
	  })
  var saveimg=()=>{
	  fs.writeFile("./user_image/"+email+'/headerImg.png', dataBuffer, (err)=> {
	      if(err){
	        res.send(err);
			 return res.json({
				 _status:'0',
				data:'上传失败',
				error:err,
			})
	  	  console.log(err)
	      }else{
	        return res.json({
	        	 _status:'1',
	        	data:'上传成功',
	        })
	  	  console.log("保存成功")
	      }
	  });
  }

});
