const express = require('express')
const app = express()
const router = express.Router()
var http = require('http');
var md5=require("md5")  
var rp = require('request-promise');
const Play=require('../db/model/playModel')//引入用户表的Schema模型
const User=require('../db/model/userModel')//引入用户表的Schema模型
const Order=require('../db/model/orderModel')//引入用户表的Schema模型
const Message=require('../db/model/messageModel')//引入用户表的Schema模型
const qrCode = require('../db/model/qrCodeModel');
/**
 * @api {post} /play/play 用户支付
 * @apiName 用户支付
 * @apiGroup user
 * @apiSuccess {String} userEmail 用户邮箱号.
 * @apiSuccess {String} userPass  用户密码.
 * @apiSuccess {String} code  验证码.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "userEmail": "2155655@qq.com",
 *       "userPass": "123456",
 *       "code":"s55g"
 *     }
 */
router.post('/play', (req, res) => {
	let msg ={
		"order_id":"1321456548",	//外部订单编号
		"order_type":"wechat",	//支付方式 wechat（微信） alipay（支付宝） 默认 wechat
		"order_price":"0.01",	//订单金额 保留两位小数
		"order_name":"Q币充值",	//订单名称/商品名称
		"sign":md5(md5('1321456548'+'0.01')+'kjcfskdjhv'),	//签名->加密方法 md5(md5(order_id + order_price) + secretkey) // 这里的 + 是字符串拼接
		"redirect_url":"http://49.235.80.80:3000/play/sucess",	//支付成功服务器回调地址包含 http(s)://，当订单已支付会向这个url地址推送”一次“Get请求！包含三个参数order_id 、qr_price（实际支付金额） 、extension 和 sign加密方式为 md5(md5(order_id) + secretkey)
		"extension":"kkkk"//创建订单时后端传入的扩展信息，支付成功后原样返回，中文需要url编码后传入
	}
		console.log("支付")
		var msg1=JSON.stringify(msg)
		creat(msg,res)
})

function creat(params,res) {
	var options = {
	    method: 'POST',
	    uri: 'http://localhost:7001/api/order',
	    form: {
	        "order_id":"14242242856356",	//外部订单编号
	        "order_type":"wechat",	//支付方式 wechat（微信） alipay（支付宝） 默认 wechat
	        "order_price":"0.01",	//订单金额 保留两位小数
	        "order_name":"Q币充值",	//订单名称/商品名称
	        "sign":md5(md5('14242242856356'+'0.01')+'kjcfskdjhv'),	//签名->加密方法 md5(md5(order_id + order_price) + secretkey) // 这里的 + 是字符串拼接
	        "redirect_url":"http://localhost:3000/play/sucess",	//支付成功服务器回调地址包含 http(s)://，当订单已支付会向这个url地址推送”一次“Get请求！包含三个参数order_id 、qr_price（实际支付金额） 、extension 和 sign加密方式为 md5(md5(order_id) + secretkey)
	        "extension":"kkkk"//创建订单时后端传入的扩展信息，支付成功后原样返回，中文需要url编码后传入
	    },
	    headers: {
	       'Content-Type': 'application/json;charset=UTF-8'
	    }
	};
	var requry=res
	rp(options)
    .then((body)=> {
        console.log(body)
		requry.send({body})
    })
    .catch((err)=> {
        requry.send({err})
    });
}
router.get('/', function(req, res, next) {
  res.write(
	 '<!DOCTYPE html><html lang="ZH-CN"><head>  <meta charset="gb2312">  <title>web VUE 测试</title>  <button onclick="play()">去支付</button>  <style>  </style></head><body>	<a href="alipays://platformapi/startapp?appId=20000067&appClearTop=false&startMultApp=YES&showTitleBar=YES&showToolBar=NO&showLoading=YES&pullRefresh=YES&url=http%3A%2F%2F49.235.80.50%3A3000%2Falipay.html%3Fu%3D2088122957176211%26a%3D0.01">去支付</a>  <script>	function play(){		window.location.href = "alipays://platformapi/startapp?appId=20000067&appClearTop=false&startMultApp=YES&showTitleBar=YES&showToolBar=NO&showLoading=YES&pullRefresh=YES&url=http%3A%2F%2F49.235.80.50%3A3000%2Falipay.html%3Fu%3D2088122957176211%26a%3D0.01"} </script></body></html>'
  )
});

router.post('/creatOrder', (req, res) => { //增加订单
	let { num, name, type, userEmail } = req.body
	let money = 0.1 * num
	if( !num || !name || !type || !userEmail ){
		res.send({message:"订单创建失败，缺少参数"})
		return false
	}
	console.log(money,name,type,userEmail,num)
	var time = new Date().getTime()
	var status=0
	qrCode.find({$and:[{'money':money},{type:'wechat'}]})
	 .then((data)=>{
		var order = new Order();
		 order.time=time;
		 order.price=money;
		 order.name=name;
		 order.status=status;
		 order.payType=type;
		 order.userEmail=userEmail;
		 order.num=num;
		 order.payUrl=data[0].path
		order.save((err, response)=>{
		 if (err) {
			console.log(err);
		  } else {
			  console.log(typeof(payUrl))
			  res.send({ message:"订单创建成功", time, money, name, type, userEmail, num ,payUrl:data[0].path,status})
			  setTimeout(()=>{
				  Order.updateOne({'price': money,'payType':type,status:0}, { 'status': '-1' },function(err, response) {
					if (err){
					  console.log(err);
					} else {
						console.log('订单超时自动取消！')
					}
					})
			  },300000)
		  }
		})
	 })
	 .catch(()=>{
		 res.send({ message:"订单创建失败", ststus: 0 })
	 })
	
})

router.post('/test',(req, res, next)=> {//修改订单  收款,安卓APP监听到收款后通知服务器
	let {money,time,title,type} = req.body
	//console.log(money,time,title,type)
	let thisTime = new Date().getTime()
	let userEmail=''
	let num=''
	let diamonds='' //钻石数
	let surplus=''
	Order.find({'price': Number(money),'payType':type,status:0})
	.then((response)=>{//查询订单信息
		console.log(response[0].userEmail)
		userEmail = response[0].userEmail
		num = response[0].num
		return Order.updateOne({'price': Number(money),'payType':type,status:0}, { 'status': '1' })
	})
	.then((response)=>{//修改订单为已支付
		console.log(response)
		return User.find({userEmail})
	})
	.then((response)=>{
		console.log(response)
		surplus = Number(response[0].diamonds)+Number(num)
		return User.updateOne({userEmail}, { 'diamonds':surplus })
	})
	.then(()=>{
		var nowTime =new Date().getTime()
		var msg = new Message()
		msg.messages='您已成功充值'+num+'钻石！实付'+money+'元';
		msg.userEmail=userEmail;
		msg.isRead=0;
		msg.creatTime=nowTime
		msg.diamonds=surplus//本次充值后剩余钻石数量
		msg.save()
		console.log('付款成功')
		res.send({message:"付款成功"})
	})
	.catch((err)=>{
		if (err){
			res.send({message:"付款失败，订单已取消，请联系客服！",time ,title,type,money,err})
		  console.log(err);
		}
	})
});

router.post('/cancelOrder',(req, res, next)=> {//取消订单
	let { userEmail,_id} = req.body
	console.log(userEmail,_id)
		Order.updateOne({userEmail,_id,status:0}, { 'status': -1 },function(err, doc) {
			console.log(doc)
			if (err || doc.nModified===0){
				res.send({message:"取消订单失败",status:0,err})
				console.log(err);
			} else {
				console.log('取消订单成功')
			  res.send({message:"取消成功",status:1,doc})
			}
		  })
});
router.post('/delOrder',(req, res, next)=> {//删除订单
let { userEmail,_id} = req.body
console.log(userEmail,_id)
	Order.deleteOne({userEmail,_id},(err,doc)=>{
		if(err){
			res.send({message:"操作失败",status:0,err})
		}
		res.send({message:"操作成功",status:1,doc})
	})
})

router.post('/getOrder',(req, res, next)=> {//分页查询所有订单
	let { pageSize=5, page=1, userEmail=''} = req.body
    Order.find({userEmail}).limit(Number(pageSize)).skip(Number((page-1)*pageSize))//默认查询5条跳过(skip)0条
     .then((data)=>{
    	  console.log(data)
    	  		res.send({massage:"查询成功",status:1,data})
    	 
     })
     .catch((err)=>{
    	 console.log(err)
    	  res.send({massage:"查询失败",status:0})
     })
})

router.post('/getOrderByTime',(req, res, next)=> {//按订单号查询订单
	let { time } = req.body
    Order.find({time})
     .then((data)=>{
    	 console.log(data)
    	 res.send({massage:"查询成功",status:1,data})
    	 
     })
     .catch((err)=>{
    	 console.log(err)
    	  res.send({massage:"查询失败",status:0})
     })
})

router.post('/getQrCode',(req, res, next)=> {//二维码测试
	let {price,payType} = JSON.parse(req.body.data)
	
	console.log(price,payType)
	Order.find({price,payType,'status':0})//查询
	  .then((data)=>{
	 	  console.log(data)
		  if(data.length>0){
			 res.send({url:"http://49.235.80.50/m/a.png"})
		  }else{
			  res.send({message:"链接失效",status:0})
		  }
	  })
	  .catch((err)=>{
	 	  console.log(err)
		   res.send({message:"内部错误",status:0})
	  })
	  
});

module.exports=router