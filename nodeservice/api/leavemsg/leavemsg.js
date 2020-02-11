var link = require('../../link');//引入连接数据库文件
var express = require('express');
var md5=require('md5-node');
var router=express.Router();
module.exports = router;
const fs = require('fs');
const nodemailer = require('nodemailer');//邮件功能

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


  //创建一个SMTP客户端配置
 let mailTransport = nodemailer.createTransport({
     // host: 'smtp.qq.email',
     service:'qq',
     secure: true,	//安全方式发送,建议都加上
     auth: {
         user: 'blkjs@qq.com',
         pass: 'qhvnbwlxpuqybggi'
     }
 })

router.post('/leavemsg', function(req, res){
    let username =req.body.username;
    let qq = req.body.qq;
	let phone = req.body.phone;
	let wechat = req.body.wechat;
	let content = req.body.content;
	let sessionID = req.sessionID;
 function isleavemsg1(){
 		return new Promise((resolve,reject)=>{
 			fs.exists("./leavemsg",(exists)=>{//判断第一级目录leavemsg是否存在
 				if(exists){//如果存在
 					resolve("1")
 				}else{
 					reject("1")
 				}
 			})
 		})
 	}
 	function isleavemsg2(){
 		return new Promise((resolve,reject)=>{
 			fs.exists("./leavemsg/"+username,(exists)=>{//判断第二级目录"./leavemsg/"+username是否存在
 				if(exists){//如果存在
 					resolve("2")
 				}else{
 					reject("2")
 				}
 			})
 		})
 	}
 	function mkdir1(){//创建一级目录和二级目录并写入文件
			fs.mkdir('./leavemsg',(error)=>{//创建一级目录leavemsg
				if(error){
					console.log(error);
					return false;
				}
				mkdir2();
			})
	}
	function mkdir2(){//创建二级目录并写入文件
			fs.mkdir('./leavemsg/'+username,(error)=>{//创建二级目录
				if(error){
					console.log(error);
					return false;
				}
				leavemsg();
			})
	}
	
 	isleavemsg1()
 	.then(()=>{//存在一级目录
 		return isleavemsg2()
 	})
 	.then(()=>{//存在二级目录
 		return leavemsg()//写入文件
 	})
 	.catch((err)=>{
 		console.log(err)
 		if(err==1){//不存在一级目录
			mkdir1()
 		}else if(err==2){//不存在二级目录
 			mkdir2()
 		}
 	})

	var currTime=new Date()
	var year = currTime.getFullYear();     //获取当前时间的年份
	var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
	var day = currTime.getDate();          //获取当前时间的日期
	var hour = currTime.getHours();        //获取当前时间的小时数
	var minute = currTime.getMinutes();    //获取当前时间的分钟数
	var second = currTime.getSeconds();    //获取当前时间的秒数
	
	var messages=	"姓名/公司："+username+"\r\n"+
					"电话："+phone+"\r\n"+
					"qq号码："+qq+"\r\n"+
					"微信号："+wechat+"\r\n"+
					"留言内容："+content+"\r\n"+
					"留言时间:"+year+"年"+month+"月"+day+"日"+hour+":"+minute+":"+second
   
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
				let options = {
				        from: ' "板栗壳技术有限公司" <blkjs@qq.com>',
				        to: '<1051011877@qq.com>',
				        bcc: '密送',
				        subject: '板栗壳官网收到一条来自'+username+'的留言',
				        text:'',
				        html: '<h1>板栗壳官网收到一条留言,请前往服务器查看!</h1><br>'+messages
				    };
				    mailTransport.sendMail(options,function(err,msg) {
				        if(err) {
				            console.log(err);
				          return res.json({
				          	 _status:'0',
				          	message:'失败',
							error:err
				          })
				        } else {
				           return res.json({
				           	 _status:'1',
				           	message:'成功',
				           })
				        }
				    })
				
		      
		    }
		});
	}
});
