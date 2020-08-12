const nodemailer = require('nodemailer');//邮件功能

  //创建一个SMTP客户端配置
 let mailTransport = nodemailer.createTransport({
     // host: 'smtp.qq.email',
     service:'qq',
     secure: true,	//安全方式发送,建议都加上
     auth: {
         user: 'blkjs@qq.com',
         pass: 'kavdzyagmgbkbgif'
     }
 })


function send(mail,code){
   let options = {
		   from: ' "板栗壳技术有限公司" <blkjs@qq.com>',
		   to: mail,
		   bcc: '密送',
		   subject: '板栗壳官网验证码',
		   text:'',
		   html: '<h1>验证码5分钟内有效!</h1><br><span>您本次的验证码为:</span>'+`${code}`
	   };
	   return new Promise((resolve,reject)=>{
		   mailTransport.sendMail(options,function(err,msg) {
				 if(err) {
					reject()//发送失败走reject
				 } else {
					resolve()//发送成功走resolve
				 }
		   })
	   })
}
function sendLottery(mail,html){
   let options = {
		   from: ' "板栗壳技术有限公司" <blkjs@qq.com>',
		   to: mail,
		   bcc: '密送',
		   subject: '开奖结果',
		   text:'',
		   html: `${html}`
	   };
	   return new Promise((resolve,reject)=>{
		   mailTransport.sendMail(options,function(err,msg) {
				 if(err) {
					reject(err)//发送失败走reject
				 } else {
					resolve(msg)//发送成功走resolve
				 }
		   })
	   })
}


module.exports={
   send,
   sendLottery
}