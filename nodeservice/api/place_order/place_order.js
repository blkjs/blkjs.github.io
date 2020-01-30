var link = require('../../link');//引入连接数据库文件
var express = require('express');
var md5=require('md5-node');
var router=express.Router();
module.exports = router;
const fs = require('fs');
var CronJob = require('cron').CronJob;//定时任务

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

router.post('/place_order', function(req, res){
   console.log("提交订单被调用")
   console.log(req.body)
   var type = JSON.stringify(req.body.type);
   var name = JSON.stringify(req.body.name);
   var money = JSON.stringify(req.body.money);
   var user_name = JSON.stringify(req.body.user_name);
   var user_phone = JSON.stringify(req.body.user_phone);
   var user_addr = JSON.stringify(req.body.user_addr);
   var user_remarks = JSON.stringify(req.body.user_remarks);
   var email =JSON.stringify(req.body.email);
   //订单写入数据库
   var myDate = new Date();
   var year = myDate.getFullYear();
   var mon = myDate.getMonth()+1;//获取当前月份(0-11,0代表1月)
   var date = myDate.getDate(); //获取当前日(1-31)
   var hours =myDate.getHours(); //获取当前小时数(0-23)
   var  min = myDate.getMinutes(); //获取当前分钟数(0-59)
   var second = myDate.getSeconds(); //获取当前秒数(0-59)
   var seconds = myDate.getMilliseconds();//获取当前毫秒数(0-999)
   var time = (new Date()).valueOf();
   var orderid = year+""+mon+date+hours+min+second+seconds;
   console.log(time)


   //return false;

	   //const sqlStr = 'INSERT INTO order (order_Id) VALUES ('+user_name+')'
	   var sqlStr = 'INSERT INTO orders (orderid,type,name,money,username, userphone,useraddr,userremarsks,creattime,orderstatus,email) VALUES ('+time+','+type+','+name+ ','+money+','+user_name+','+user_phone+','+user_addr+','+user_remarks+','+time+','+'0'+','+email+')'

     link.query(sqlStr,user_name,(err,results) => {
       console.log(err)
         if(err) return res.json({status:'0',message:'提交失败'})
        var m = min;
        var hour =hours +1;
        console.log(hours+":"+m+":"+second)
         new CronJob(second+' '+m+' '+hour+' * * *',()=>{
           console.log('已经取消订单')
             cancel();
         }, null, true);

        return res.json({
     		status:'1',
        message:'发布成功！',

         })
     })

     let cancel = ()=>{
        let sqlStr = 'UPDATE orders SET orderstatus=12 WHERE orderid=' + orderid

       link.query(sqlStr,email,(err,results) => {
         console.log(err)
         console.log(results)

       		})
     }


   //return false;
   /* //接收前台POST过来的base64
    var imgData = req.body.imageUrl;
	var email = req.body.email;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
		fs.exists("./user_image",(exists)=>{//判断第一级目录user_image是否存在
			  if(exists){//如果存在
				 fs.exists("./user_image/"+email,(exists)=>{//判断二级目录是否存在
					 if(!exists){//如果不存在
					 				fs.mkdir('./user_image/' + email,(error)=>{//创建二级目录
					 					if(error){
					 						console.log(error);
					 						return false;
					 					}
										saveimg()
					 				})

					 }else{
						 saveimg()
					 }
				 })
			  }

			 if(!exists){//如果一级目录不存在
				fs.mkdir('./user_image',(error)=>{//创建一级目录user_image
					if(error){
						console.log(error);
						return false;
					}
					fs.mkdir('./user_image/'+email,(error)=>{//创建二级目录
						if(error){
							console.log(error);
							return false;
						}
						saveimg();
					})
				})

			 }
	  })
  var saveimg=()=>{
	  fs.writeFile("./user_image/"+email+'/headerImg.png', dataBuffer, (err)=> {
	      if(err){
	        res.send(err);
			 return res.json({
				 _status:'0',
				data:'上传失败',
				error:err,
			})
	  	  console.log(err)
	      }else{
	        return res.json({
	        	 _status:'1',
	        	data:'上传成功',
	        })
	  	  console.log("保存成功")
	      }
	  });
  } */

});
