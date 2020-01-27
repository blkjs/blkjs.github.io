var link = require('../link');//引入连接数据库文件
var express = require('express');
var md5=require('md5-node');
var router=express.Router();
module.exports = router;

	var bodyParser = require('body-parser')
		router.use(bodyParser.urlencoded({ extended: false }))
		router.use(bodyParser.json())
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

router.post('/about',(req,res)=>{
  console.log("被调用")
var email = JSON.stringify(req.body.email)
var password1 = JSON.stringify(md5(req.body.password1))
var password2 = JSON.stringify(md5(req.body.password2))

const sqlStr = 'SELECT * FROM users where email ='+email+'AND password='+password1
link.query(sqlStr,email,(err,results) => {
		    if(err) return res.json({err_code:1,message:'获取数据失败',affectedRows:0})
		    if(results.length !== 1) return res.json({status:'0',err_code:1,message:'旧密码错误',affectedRows:0})
			changepasswd();

		})

var changepasswd = () => {
	const sqlStr = 'update users set password='+ password2+'where email ='+email+'AND password='+password1
	link.query(sqlStr,email,(err,results) => {
			if(err) return res.json({message:'获取数据失败'})

			 return res.json({
					status:'1',
					message:'修改成功',
			    })
		})
	};
})
