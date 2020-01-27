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

router.post('/leavemsg', function(req, res){
    let username =req.body.username;
    let qq = req.body.qq;
	let phone = req.body.phone;
	let wechat = req.body.wechat;
	let content = req.body.content;
	let sessionID = req.sessionID;
 console.log(req.body)
 console.log(req.sessionID)
	fs.exists("./leavemsg",(exists)=>{//判断第一级目录leavemsg是否存在
				  if(exists){//如果存在
					 fs.exists("./leavemsg/"+username,(exists)=>{//判断二级目录是否存在
						 if(!exists){//如果不存在
						 				fs.mkdir('./leavemsg/' + username,(error)=>{//创建二级目录
						 					if(error){
						 						console.log(error);
						 						return false;
						 					}
											leavemsg()
						 				})
	
						 }else{
							 leavemsg()
						 }
					 })
				  }
	
				 if(!exists){//如果一级目录不存在
					fs.mkdir('./leavemsg',(error)=>{//创建一级目录leavemsg
						if(error){
							console.log(error);
							return false;
						}
						fs.mkdir('./leavemsg/'+username,(error)=>{//创建二级目录
							if(error){
								console.log(error);
								return false;
							}
							leavemsg();
						})
					})
	
				 }
	})
	var messages=	"姓名/公司："+username+"\r\n"+
					"电话："+phone+"\r\n"+
					"qq号码："+qq+"\r\n"+
					"微信号："+wechat+"\r\n"+
					"留言内容："+content+"\r\n"
   
	var leavemsg=()=>{
		fs.writeFile("./leavemsg/"+username+"/"+sessionID+'.txt', messages, (err)=> {
		    if(err){
		      res.send(err);
					 return res.json({
						 _status:'0',
						message:'失败',
						error:err,
					})
			  console.log(err)
		    }else{
		      return res.json({
		      	 _status:'1',
		      	message:'成功',
		      })
			  console.log("保存成功")
		    }
		});
	}
});
