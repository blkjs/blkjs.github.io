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

router.post('/getip', function(req, res){
    console.log(req.body.position)
    let position=JSON.stringify(req.body.position)
    const sqlStr = 'SELECT * FROM ip where position ='+position
    link.query(sqlStr,position,(err,results) => {
      console.log(err)
    		    if(err) return res.json({status:'0',err_code:1,message:'获取数据失败',affectedRows:0})
    		    if(results) return res.json({status:'1',results:results,})


    		})

});
