var link = require('../../link');//引入连接数据库文件
var express = require('express');
var md5=require('md5-node');
var router=express.Router();
module.exports = router;
const fs = require('fs');
var svgCaptcha = require('svg-captcha');

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

router.post('/VCode', function(req, res){
   /* const sessionCaptcha = req.session.captcha.toLowerCase()
    console.log(sessionCaptcha,'验证码') */


 var captcha = svgCaptcha.create({
      inverse: true, // 翻转颜色
      fontSize: 18, // 字体大小
      noise: 2, // 噪声线条数
      width: 20, // 宽度
      height: 20, // 高度
      size: 4,// 验证码长度
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      color: true,
      background:'＃cc9966'// svg图像的背景颜色
    });
      var captcha = svgCaptcha.create(captcha);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    console.log(req.session.captcha)
    var codeData = {
        img:captcha.data
    }
    if(req.body.name==='wx'){//小程序掉用接口要传name='wx'，小程序不支持标签svg
       return res.json({
      			 codeData:codeData,
      			code:req.session.captcha,
      		})
    }else{
      return res.send(codeData);
    }


    //return res.send(codeData,);

});
