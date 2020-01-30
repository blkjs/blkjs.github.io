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

router.post('/postip', function(req, res){
    console.log(req.body)

    const hostname=JSON.stringify(req.body.hostname)
    const ip=JSON.stringify(req.body.ip)
    const position=JSON.stringify(req.body.position)
    const email=JSON.stringify(req.body.email)
    const sqlStr = "select * from ip where ip = "+ip+" AND host="+hostname
    const sqlStr1 = 'INSERT INTO ip (host,ip,position,email) VALUE ('+hostname+','+ip+','+position+','+email+')'

    link.query(sqlStr,ip,(err,results) => {
      console.log(err)
       console.log(results)
       let arr =[];
       console.log(arr)

    		    if(err) return res.json({status:'0',err_code:1,message:'获取数据失败',affectedRows:0})
            if(JSON.stringify(results)==='[]') {
              link.query(sqlStr1,position,(err,results) => {
               console.log(err)
                console.log(results)

                            		    if(err) return res.json({status:'0',err_code:1,message:'插入数据失败',affectedRows:0})
                            		    if(results) return res.json({status:'1',results:results,})


                            		})


            }else{
               return res.json({status:'0',results:results,message:'该数据已存在'})
            }

    		})



});
