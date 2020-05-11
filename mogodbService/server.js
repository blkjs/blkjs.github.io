const express =require('express')
const app=express()
const path =require('path')
const db=require('./db/connect')//数据库连接
const bodyParser = require('body-parser');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
const router = express.Router()
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据

app.use(session({
	 name: 'www.blkjs.com',
store:new FileStore({reapInterval: 5 * 1000,}),//数据持久化方式，这里表示本地文件存储
 cookie: {maxAge: 24*60*60*1000},//两次请求的时间差 即超过这个时间再去访问 session就会失效
 secret: 'random_string_goes_here',////加密key 可以随意书写
 duration: 10,//过期时间
 activeDuration: 5 * 1000,// 激活时间，这个时间内再次请求就重新计算
 reapInterval:1,// 间隔以秒为单位清除过期的会话，如果不需要则为-1。默认为1 hour
 ttl:10,//默认3600秒
 resave: true,
 reapAsync:true ,//使用不同的工作进程来删除陈旧的会话。默认为false
 reapSyncFallback:true,// 如果不能异步执行，则同步收到过时会话。默认为false
}));

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


app.use('/public',express.static(path.join(__dirname,'./uploads')));//静态资源
 
const userRouter=require('./router/userRouter')
app.use('/user',userRouter)
const foodRouter=require('./router/foodRouter')
app.use('/food',foodRouter)
const fileRouter=require('./router/fileRouter')
app.use('/file',fileRouter)
const noticeRouter=require('./router/noticeRouter')
app.use('/notice',noticeRouter)
const analysisRouter=require('./router/analysisRouter')
app.use('/analysis',analysisRouter)
const gameWebSokect=require('./router/gameWebSokect')
app.use('/game',gameWebSokect)
const talkingSkillRouter=require('./router/talkingSkillRouter')
app.use('/talkingSkill',talkingSkillRouter)
const playRouter=require('./router/playRouter')
app.use('/play',playRouter)
const updateRouter=require('./router/updateRouter')
app.use('/update',updateRouter)
const messageRouter=require('./router/messageRouter')
app.use('/message',messageRouter)

 /* User.insertMany({userName:'张三',userPass:'123456',userAge:24,headerImg:"headerImg"})//增加
  .then((data)=>{
	  console.log(data)
	  console.log('插入成功')
  })
  .catch((err)=>{
	  console.log(err)
  }) */
  
 /* User.find({userName:'张三',userPass:'123456'})//查询
   .then((data)=>{
  	  console.log(data)
  	  console.log('查询成功')
   })
   .catch((err)=>{
  	  console.log(err)
   }) */
   
 /*  User.remove({userName:'张三',userPass:'123456'})//删除
     .then((data)=>{
    	  console.log(data)
    	  console.log('删除成功')
     })
     .catch((err)=>{
    	  console.log(err)
     }) */
	 
	/* var query = { userName: '张三',userPass:'12345678'};
	User.update(query, { userName: '李四1' })//更改
	.then((data)=>{
		 	  console.log(data)
		 	  console.log('更改成功')
	})
	.catch((err)=>{
		 	  console.log(err)
	}) */
	
	//配置服务端口
	var server = app.listen(3000, function() {
	
	    var host = server.address().address;
	
	    var port = server.address().port;
	
	    console.log('Example app listening at http://%s:%s', host, port);
	})
	