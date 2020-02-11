const express =require('express')
const app=express()
const router =express.Router()
const User=require('../db/model/userModel')//引入用户表的Schema模型
const Mail=require('../utils/mail')
var svgCaptcha = require('svg-captcha');
let codes={}//通过内存保存邮箱验证码,邮箱,时间戳
let VCode={}//通过内存保存图片验证码客户端ip,sessionID,请求次数,时间戳



/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
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
//注册接口
router.post('/reg',(req,res)=>{ 
	let {userEmail,userPass,code}=req.body
	if(!userEmail || !userPass || !code){
		res.send({massage:"缺少参数",status:0})
		return false
	}
	 if(codes[userEmail]===code){//判断验证码是否正确
	}else{
		res.send({massage:"验证码错误",status:0})
		return false
	}
	
	
	User.find({userEmail})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
	  .then((data)=>{
		  if(data.length===0){
			 return User.insertMany({userEmail,userPass})//增加{userEmail,userPass}==={userEmail:userEmail,userPass:userPass}
		  }else{
			  res.send({massage:"该邮箱已经被注册",status:0})
			  return false
		  }
	  })
	 .then((data)=>{
		  console.log(data)
		  console.log('插入成功')
		  res.send({massage:"注册成功",status:1})
	 })
	 .catch((err)=>{
		  console.log(err)
		  res.send({massage:"注册失败",status:0,error:err})
	 })
	
})

/**
 * @api {post} /user/login 登录接口
 * @apiName 登录接口
 * @apiGroup user
 * @apiSuccess {String} userEmail 用户邮箱号.
 * @apiSuccess {String} userPass  用户密码.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "userEmail": "2155655@qq.com",
 *       "userPass": "123456",
 *     }
 */
//登录接口
router.post('/login',(req,res)=>{
	const sessionCaptcha = req.session.captcha;//服务器生成待验证码
	  console.log(sessionCaptcha,'验证码')
	let {userEmail,userPass}=req.body
	if(!userEmail || !userPass){
		res.send({massage:"缺少参数",status:0})
		return false
	}
	User.find({userEmail,userPass})//查询
	  .then((data)=>{
	 	  console.log(data)
		  if(data.length>0){
			  res.send({massage:"登录成功",status:1})
		  }else{
			  res.send({massage:"用户名或密码不正确",status:0})
		  }
	  })
	  .catch((err)=>{
	 	  console.log(err)
		   res.send({massage:"内部错误",status:0})
	  })
	
})

/**
 * @api {post} /user/getMailCde 邮箱验证码
 * @apiName 邮箱验证码
 * @apiGroup user
 * @apiSuccess {String} userEmail 用户邮箱号.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 1,
 *       "message": "发送成功",
 *     }
 */
//邮箱验证码
router.post('/getMailCde',(req,res)=>{
	let times=new Date().getTime()//时间戳
	let {mail} = req.body//邮箱号
	let {cum}  = {cum:mail+'-cum'}//设置次数名字
	let {time} = { time:mail+"-time"}//本次请求时间名=邮箱+'-time'	
	let {lastTime}  = {lastTime:mail+'-lastTime'}//上次请求时间的名字
	let {lastTime1}  = {lastTime1:mail+'-lastTime1'}//上上次请求时间的名字
	if(!mail){
		res.send({massage:"缺少参数",status:0})
		return false
	}
	if((times-codes[lastTime1])<300000 && codes[cum]>=3){//5分钟只能请求3次接口,当前时间-上上次时间
		return res.json({
		 	 status:'0',
		 	message:'5分钟内只能请求3次接口',
			time:300000-(times-codes[lastTime1])
		 })
	}
	if((times-codes[time])<20000){//10秒只能请求一次接口
		return res.json({
		 	 status:'0',
		 	message:'请求过于频繁',
			time:20000-(times-codes[time])
		 })
	}
	//随机验证码
			  function randomWord(randomFlag, min, max){
				var str = "",
			  	range = min,
				//排除0,1,o,O,i
			  	arr = ['2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			  	// 随机产生
			  	if(randomFlag){
			  		range = Math.round(Math.random() * (max-min)) + min;
			  	}
			  	for(var i=0; i<range; i++){
			  		pos = Math.round(Math.random() * (arr.length-1));
			  		str += arr[pos];
			  	}
			  	return str;
			  }
	var code =randomWord(1,6,6);//随机验证码
	Mail.send(mail,code)
	.then(()=>{
		codes[mail]=code//通过内存保存验证码,重启接口后会丢失
		codes[cum]= ((typeof(codes[cum])=='number' ? codes[cum] : 0) +1) >=4  ?  1:((typeof(codes[cum])=='number' ? codes[cum] : 0) +1),
		codes[lastTime]= codes[time] ? codes[time] : times,//存在上次请求时间则
		codes[lastTime1]= codes[lastTime],//把上次请求时间,改成上上次请求时间
		codes[time]=times
		console.log(codes)
		return res.json({
		 	 status:'1',
		 	message:'发送成功',
		 })
	})
	.catch(()=>{
		return res.json({
		 	 status:'0',
		 	message:'发送失败'
		 })
	})
})

/**
 * @api {post} /user/VCode 图形验证码
 * @apiName 图形验证码
 * @apiGroup user
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 1,
 *       "message": "成功",
 *       "codeData":{
 *        "img":"<svg>...</svg>"
 *       }
 *     }
 */

router.post('/VCode', function(req, res){
	let ips=req.ip || undefined //通过内存保存,重启接口后会丢失
	let sessionIDs=req.sessionID
	let {ip} ={ip:ips+'-ip'}
	let {sessionID}={sessionID:sessionIDs+'-sessionID'}
	let times=new Date().getTime()//时间戳
	let {cum}  = {cum:sessionIDs+'-cum'}//设置次数名字
	let {firstTime} = { firstTime:sessionIDs+"-firstTime"}
	let {time} = { time:sessionIDs+"-time"}//本次请求时间名=sessionID+'-time'	
	if((times-VCode[firstTime])<300000 && VCode[cum]>=25){//5分钟只能请求20次接口,当前时间-第一次次时间
		return res.json({
		 	 status:'0',
		 	message:'请勿频繁请求,'+(300000-(times-VCode[firstTime]))/1000+"秒后再试",
			time:300000-(times-VCode[firstTime])
		 })
	}else{
		VCode[firstTime]=times
	}
	
 var captcha = svgCaptcha.create({
      inverse: 40, // 字体大小
      noise: 3, // 噪声线条数
      width: 100, // 宽度
      height: 50, // 高度
      size: 5,// 验证码长度
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      color: true,
      background:'＃9BAA9B'// svg图像的背景颜色
    });
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    console.log(req.session.captcha,req.sessionID)
    var codeData = {
        img:captcha.data
    }
	  VCode[ip]=req.ip || undefined //通过内存保存,重启接口后会丢失
	  VCode[sessionID]=req.sessionID
	  VCode[cum]=VCode[cum] ? (VCode[cum]>=25 ? 1:(VCode[cum]+1)) : 1 
	  VCode[firstTime]=VCode[firstTime] ? VCode[firstTime] : times
	  VCode[time]=times
	  console.log(VCode)
	  return res.json({
	   	 status:'1',
	   	message:'成功',
		codeData:codeData
	   })
});

module.exports=router