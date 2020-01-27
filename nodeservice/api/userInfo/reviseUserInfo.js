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

router.post('/revise', function(req, res){
  const sessionCaptcha = req.session.captcha;//服务器生成待验证码
  console.log(sessionCaptcha,req.body.VerificationCode);
  const VerificationCode = req.body.VerificationCode;//用户输入待验证码
  console.log(req.body)
   console.log('修改资料')

   if(!VerificationCode){
     return res.json({
     	 status:'0',
     	message:'请填写验证码！',
     })
   }else if(sessionCaptcha!=VerificationCode){
      return res.json({
      	 status:'0',
      	message:'验证码错误！',
      })
   }

    let email =JSON.stringify(req.body.email);
    let username = JSON.stringify(req.body.username);
    let phone = JSON.stringify(req.body.phone);
    let birthday = JSON.stringify(req.body.birthday);


     let sqlStr = 'UPDATE users SET username='+username+', phone='+phone+',birthday='+birthday+' WHERE email=' + email

    link.query(sqlStr,email,(err,results) => {
      console.log(err)
      console.log(results)
    		    if(err) return res.json({status:'0',err_code:1,message:'获取数据失败',affectedRows:0})
    		    if(results) return res.json({status:'1',results:results,message:'修改成功！'})
            console.log("1")
             return res.json({status:'1',message:'修改成功！',})

    		})

});
