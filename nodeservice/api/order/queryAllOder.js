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

router.post('/queryAllOdrder', function(req, res){
    var orderstatus =JSON.stringify(req.body.orderstatus)

    var email = JSON.stringify(req.body.email);
    var page = req.body.page;//共查询几条数据5
    var pagecum = req.body.pagecum;//当前是第几页1
    var pagecum1 = page*pagecum-page;
     var sqlStr= ''
    if(orderstatus==JSON.stringify("all")){
      console.log("1")
          sqlStr = 'SELECT * FROM orders  WHERE email='+email+' limit '+ pagecum1+','+page
          //查询指定用户全部订单，分页查询
    }else{
           sqlStr = 'SELECT * FROM orders  WHERE email='+email+' AND orderstatus='+orderstatus+ ' limit '+ pagecum1+','+page
            //查询指定用户指定类型订单，分页查询
    }
    //var pagecum2 = page*pagecum;
console.log(page,pagecum1)
   // const sqlStr = 'SELECT * FROM orders  WHERE email='+email+' AND orderstatus='+orderstatus+ ' limit '+ pagecum1+','+page
    console.log(req.body)
    link.query(sqlStr,'',(err,results) => {
      console.log(err)
    		    if(err) return res.json({status:'0',err_code:1,message:'获取数据失败',affectedRows:0})
    		    if(results) return res.json({status:'1',results:results,})


    		})

});
