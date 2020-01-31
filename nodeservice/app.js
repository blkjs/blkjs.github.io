var link = require('./link');//引入连接数据库文件
var md5=require('md5-node');
var session = require('express-session');
var express = require('express');
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');//转base64要用到
const FileStore = require('session-file-store')(session);
var CronJob = require('cron').CronJob;//定时任务
const nodemailer = require('nodemailer');//邮件功能
var app = express();


app.use(session({
	 name: '123',
store:new FileStore({reapInterval: 60 * 1000,}),//数据持久化方式，这里表示本地文件存储
 cookie: {maxAge: 14*24*60*60*1000},//两次请求的时间差 即超过这个时间再去访问 session就会失效
 secret: 'random_string_goes_here',////加密key 可以随意书写
 duration: 5*24*60 * 60 * 1000,//过期时间
 activeDuration: 5*24*60 * 60 * 1000,// 激活时间，这个时间内再次请求就重新计算
 reapInterval:5*24*60 * 60 * 1000,// 间隔以秒为单位清除过期的会话，如果不需要则为-1。默认为1 hour
 ttl:5*24*60 * 60 * 1000,//默认3600秒
 reapAsync:true ,//使用不同的工作进程来删除陈旧的会话。默认为false
 reapSyncFallback:true,// 如果不能异步执行，则同步收到过时会话。默认为false
}));
	var bodyParser = require('body-parser')
		app.use(bodyParser.urlencoded({limit:'5000kb',extended:true}))
		app.use(bodyParser.json({limit:"5000kb"}))
 //设置跨域访问
app.all('*', function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);//接收cookie
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
	res.header("Access-Control-Allow-Credentials", true)
    next();
});

app.use('/leavemsg',require('./api/leavemsg/leavemsg.js'));//留言无需登陆

//登陆拦截
app.use(function (req, res, next) {
  console.log(req.sessionID);
  if(req.session.cookie.username){
     var username = req.session.cookie.username;
    var userifo ={'username':username}
      req.session.cookie = userifo;
    	console.log("已经登陆");
     var arr = req.url.split('/');
    // 去除 GET 请求路径上携带的参数

    for (var i = 0, length = arr.length; i < length; i++) {
      arr[i] = arr[i].split('?')[0];
    }

    if (arr.length > 1  && (arr[1] == 'register' || arr[1] == 'login' || arr[1] == 'logout' || arr[1] == 'VCode' || arr[1] == 'getip')) {//请求api为这些的时候跳过拦截
      next();
    }else{

      	/* return	res.json({
      		 status:'1',
      	}) */
        next();
    }
  }else{
  	console.log("未登陆");
/*  		return res.json({
  					 status:'0',
  				}) */

          var arr = req.url.split('/');
          // 去除 GET 请求路径上携带的参数

          for (var i = 0, length = arr.length; i < length; i++) {
            arr[i] = arr[i].split('?')[0];
          }
           console.log(req.url)

          if (arr.length > 1 && arr[1] == '') {
              next();
            } else if (arr.length > 1  && (arr[1] == 'register' || arr[1] == 'login' || arr[1] == 'logout' || arr[1] == 'VCode' || arr[1] == 'getip')) {// 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
              next();
            } else {  // 登录拦截
             return res.json({
            			 status:'0',
                   message:'请先登录'
            		})
                 return false;
              req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
              //req.flash('error', '请先登录');
              res.redirect('/login');  // 将用户重定向到登录页面

          }
  }

});

app.use('/about',require('./api/changePasswd.js'));
app.use('/upload',require('./api/uploadimg/headerimg.js'));
app.use('/getip',require('./api/ip/getip.js'));
app.use('/postip',require('./api/ip/postip.js'));
app.use('/place_order',require('./api/place_order/place_order.js'));
app.use('/queryAllOdrder',require('./api/order/queryAllOder.js'));
app.use('/cancelOrder',require('./api/order/cancelOrder.js'));
app.use('/VCode',require('./api/VCode/VCode.js'));
app.use('/revise',require('./api/userInfo/reviseUserInfo.js'));


app.post('/register',(req,res,next) => {
    const username = JSON.stringify(req.body.username);
	 const password = JSON.stringify(md5(req.body.password));
	  const email = JSON.stringify(req.body.email);
	   const email1 = req.body.email;
	   console.log(req.body)
	  //生成随机10位数uid
		   const max =1000000000;
		  const min = 9999999999;
		  parseInt(Math.random()*(max-min+1)+min,10);
		  const uid= Math.floor(Math.random()*(max-min+1)+min);
		//随机邀请码
				/*
			randomWord 产生任意长度随机字母数字组合
			randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
			xuanfeng 2014-08-28
			*/
			function randomWord(randomFlag, min, max){
			var str = "",
				range = min,
				arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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
			var InvitationCode =JSON.stringify(randomWord(1,8,8));//邀请码
			//var InvitationCode ='66666';
			console.log(InvitationCode)
			const sql = 'SELECT * FROM users where InvitationCode ='+InvitationCode
			var a= '123'
			 link.query(sql,InvitationCode,(err,results) => {
			    if(err) return res.json({message:'获取数据失败'})
			})

			//查询邮箱是否已经被注册
			const sqlEmail = 'SELECT email FROM users where email ='+email
			link.query(sqlEmail,email,(err,results) => {
				console.log(results)
				console.log(err)
			      if(!results[0]){
					  reg();//邮箱未被注册，调用注册方法
					  }else{
					  return  res.json({
					  				status:'0',
					  				message:'该邮箱已被注册',
					  				email:email1,
					  					})
				  }

			})

  //写入注册数据
  var reg = () => {
	   const sqlStr = 'INSERT INTO users (username, password,email,uid,InvitationCode,status,phone,birthday) VALUES ('+username+','+password+','+email+','+uid+','+InvitationCode+','+ '0' + ',' +'0'+ ',' +'0'+ ')'
	  link.query(sqlStr,username,(err,results) => {
	      if(err) return res.json({message:'获取数据失败'})
		  
		  //创建一个SMTP客户端配置
		  let mailTransport = nodemailer.createTransport({
		      // host: 'smtp.qq.email',
		      service:'qq',
		      secure: true,	//安全方式发送,建议都加上
		      auth: {
		          user: 'blkjs@qq.com',
		          pass: 'qhvnbwlxpuqybggi'
		      }
		  })
		  let options = {
		          from: ' "板栗壳技术有限公司" <blkjs@qq.com>',
		          to: '<1051011877@qq.com>',
		          bcc: '密送',
		          subject: '板栗壳官网有新用户注册',
		          text:'',
		          html: '<h1>板栗壳官网有新用户注册啦,请前往服务器查看!</h1>'
		      };
		      mailTransport.sendMail(options,function(err,msg) {
		          if(err) {
		              console.log(err);
		             // res.send(err);
		          } else {
		             // res.send('success');
		          }
		      })
			  
	     return res.json({
	  		status:'1',
	          message:'注册成功',
	  		email:email1,
	  		username:req.body.username,
	  		InvitationCode:InvitationCode,
	  		uid:uid,
	      })
	  })
  };

})


app.post('/login',(req,res) => {
  const sessionCaptcha = req.session.captcha;//服务器生成待验证码
  console.log(sessionCaptcha,req.body.VerificationCode);
  const VerificationCode = req.body.VerificationCode;//用户输入待验证码

    const email = JSON.stringify(req.body.username);
	const email1 = req.body.username;
	const password = JSON.stringify(md5(req.body.password));
	const name = JSON.stringify(req.body.name);

	  const sqlStr = 'SELECT * FROM users where email ='+email+'AND password='+password
//console.log(name)
	if(name){
				if(!req.session){
						return res.json({
							 status:'0',
							data:'无效的请求',
						})
					}
		console.log('注销登录')
		 console.log(req.session);
		console.log(req.sessionID);
		req.session.destroy();//清除session
				if(!req.session){
					return res.json({
						 status:'1',
						data:'注销成功',
					})
				}else{
					return res.json({
						 status:'0',
						data:'注销失败',
					})
				}
	}else{
    if(!VerificationCode){
      return res.json({
      	 status:'0',
      	message:'请填写验证码！',
      })
    }else if(sessionCaptcha!=VerificationCode){
      console.log(sessionCaptcha)
      console.log(VerificationCode)
       return res.json({
       	 status:'0',
       	message:'验证码错误！',
       })
    }
		 link.query(sqlStr,email,(err,results) => {
       console.log(email)
       console.log(password)
       console.log(err)
		    if(err) return res.json({err_code:1,message:'获取数据失败',affectedRows:0})
		    if(results.length !== 1) return res.json({status:'0',err_code:1,message:'账号或密码错误',affectedRows:0})
				var userifo ={'username':email,'iflogin':true}
				  req.session.cookie = userifo;
				  console.log('登录')
				   console.log(req.session);
				   console.log(req.sessionID);
				   let headerImg='';

					fs.access('./user_image/'+email1+'/headerImg.png',(err)=>{
						console.log(err ?  '目录/文件不存在': '文件存在,可以进行读写');
						if(err){
							console.log("999")
							dl();//登陆
						}else{
							let filePath = path.resolve('./user_image/'+email1+'/headerImg.png');
							let data = fs.readFileSync(filePath);
							data = new Buffer.from(data).toString('base64');
							 headerImg = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
							  //console.log(headerImg)
							  dl();//登陆
						}
					});

				  var dl =()=>{//登陆
					  if(results.length == 1) return res.json({
					  				 status:'1',
					  					data:{
					  						headerImg:headerImg,
					  						username:results[0].username,
					  						email:results[0].email,
					  						uid:results[0].uid,
					  						InvitationCode:results[0].InvitationCode,
											user_status:results[0].status,
                      phone:results[0].phone,
                      birthday:results[0].birthday,
					  						},
					  				 })
				  }


		})
	}


})


app.post('/iflogin',(req,res)=>{//检查是否登陆
console.log(req.session.cookie)
console.log(req.sessionID);
 if(req.session.cookie.username){
	 /* var username = req.session.cookie.username;
	var userifo ={'username':username}
	  req.session.cookie = userifo; */
		console.log("已经登陆");

/* new CronJob('10 22 18 * * *',()=>{
   
    console.log(req.session.cookie.username);
}, null, true); */

		return	res.json({
			 status:'1',
		})

}else{
	console.log("未登陆");
		return res.json({
					 status:'0',
				})
}
});


//配置服务端口
var server = app.listen(3000, function() {

    var host = server.address().address;

    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})
