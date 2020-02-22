const express =require('express')
const router =express.Router()
const fs = require('fs');
const path = require('path');
const multipart = require('connect-multiparty')//解决from-data接收不到数据问题...
const multipartyMiddleware = multipart()
const nodemailer = require('nodemailer');//邮件功能

 var saveimg=(email,dataBuffer,type)=>{
	 let name = type==1 ? "headerImg" : "others"
	 return new Promise((resolve,reject)=>{
	  fs.writeFile('./uploads/'+email+'/'+name+'.png', dataBuffer, (err)=> {
	      if(err){
			  reject(err)
	  	  console.log(err)
	      }else{
	        resolve('/public/'+email+'/'+name+'.png')
	      }
	  });
	 })
  }
  var mkdirs =(url)=>{//创建目录
  return new Promise((resolve,reject)=>{
	  fs.mkdir(url,(error)=>{
	  	if(error){
			console.log(url+"✘✘✘✘✘✘✘✘✘✘文件创建失败")
			console.log(error);
			 reject()
	  		return false;
	  	}
		console.log(url+"✔✔✔✔✔✔✔✔✔文件创建成功")
		resolve()
	  })
	  })
  }
  var isTures=(file)=>{//检测文件是否存在
    return new Promise((resolve,reject)=>{
	  fs.exists(file,function(exists){
	    if(exists){
			resolve()
	       console.log(file+"✔✔✔✔✔✔✔✔✔文件存在")
	    }
	     if(!exists){
			 reject(file)
	          console.log(file+"✘✘✘✘✘✘✘✘✘✘文件不存在")
	     }
	    })
		
		})
  }
  
	 /**
	  * @api {post} /file/upload 上传图片
	  * @apiName 上传图片
	  * @apiGroup file
	  * @apiSuccess {String} userEmail 用户邮箱账号,将作为文件夹名称.
	  * @apiSuccess {String} imgBase64  用户上传的Base64图片字符串.
	  * @apiSuccess {Number} type  1头像,2其他.
	  * @apiSuccessExample 成功的返回示例:
	  *     HTTP/1.1 200 OK
	  *     {
	  *       "status": 0,
	  *       "message": "上传成功",
	  *       "imgURL": "/uploads/123456@qq.com/headerImg.png"
	  *     }
	  */
	 
	 //上传图片
router.post('/upload',multipartyMiddleware,(req,res)=>{
	let {userEmail,imgBase64,type}=req.body
//过滤data:URL
    var base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
	isTures("./uploads")
	.then(()=>{
		return isTures("./uploads/"+userEmail)
	})
	.then(()=>{
		return saveimg(userEmail,dataBuffer,type)
	})
	.then((URL)=>{
		return res.json({
		 	 status:'0',
		 	message:'上传成功',
			imgURL:URL
		 })	
	})
	.catch((file)=>{
		if(file=='./uploads'){
			mkdirs(file)
			.then(()=>{
				return mkdirs(file+'/'+userEmail)
			})
			.then(()=>{
				return saveimg(userEmail,dataBuffer,type)
			})
			.then((URL)=>{
				return res.json({
				 	 status:'0',
				 	message:'上传成功',
					imgURL:URL
				 })	
			})
			.catch(()=>{
				return res.json({
				 	 status:'0',
				 	message:'上传失败',
					
				 })	
			})
		}else if(file=='./uploads/'+userEmail){
			mkdirs(file)
			.then(()=>{
				return saveimg(userEmail,dataBuffer,type)
			})
			.then((URL)=>{
				return res.json({
				 	 status:'0',
				 	message:'上传成功',
					imgURL:URL
				 })	
			})
			.catch(()=>{
				return res.json({
				 	 status:'0',
				 	message:'上传失败',
					
				 })	
			})
		}else{
			return res.json({
			 	 status:'0',
			 	message:'上传失败'
			 })	
		}
		
	})

})

/**
 * @api {post} /file/iflogin 留言
 * @apiName 留言
 * @apiGroup file
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 1,
 *     }
 */
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
router.post('/leavemsg',(req,res)=>{
 let username =req.body.username;
    let qq = req.body.qq;
 	let phone = req.body.phone;
 	let wechat = req.body.wechat;
 	let content = req.body.content;
	let userEmail = req.body.userEmail || '';
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
 					"留言时间:"+year+"年"+month+"月"+day+"日"+hour+":"+minute+":"+second+"\r\n"+
					"用户email:"+userEmail
   
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
 				        from: ' 板栗壳技术有限公司 <blkjs@qq.com>',
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
module.exports=router