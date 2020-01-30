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

router.post('/cancelOrder', function(req, res){
    let orderid =JSON.stringify(req.body.orderid);
    let email = JSON.stringify(req.body.email);
    console.log(req.body)

     let sqlStr = 'UPDATE orders SET orderstatus=12 WHERE orderid=' + orderid

    link.query(sqlStr,email,(err,results) => {
      console.log(err)
      console.log(results)
    		    if(err) return res.json({status:'0',err_code:1,message:'获取数据失败',affectedRows:0})
    		    if(results) return res.json({status:'1',results:results,})
            console.log("1")
             return res.json({status:'1',message:'取消成功',})

    		})

});

router.post('/delete', function(req, res){
    let orderid =JSON.stringify(req.body.orderid);
    let email = JSON.stringify(req.body.email);
    console.log(req.body)

     let sqlStr = 'DELETE FROM orders WHERE orderstatus=12 AND orderid=' + orderid +' AND email='+email

    link.query(sqlStr,email,(err,results) => {
      console.log(err)
      console.log(results)
    		    if(err) return res.json({status:'0',err_code:1,message:'删除订单失败',affectedRows:0})
    		    if(results) return res.json({status:'1',message:'订单已删除',})
            console.log("订单已删除")
    		})

});
