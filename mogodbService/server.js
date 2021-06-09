const express =require('express')
var ejs = require('ejs');
const app=express()
const path =require('path')
const db=require('./db/connect')//数据库连接
const bodyParser = require('body-parser');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
const router = express.Router()
var expressJwt =require('express-jwt');//token
var token = require('./utils/token');
const logModel = require('./db/model/logModel')
var logs = require('./utils/logs');//记录日志数据

app.use(session({
	 name: 'www.blkjs.com',
store:new FileStore({reapInterval: 5 * 1000,}),//数据持久化方式，这里表示本地文件存储
 cookie: {maxAge: 24*60*60*1000},//两次请求的时间差 即超过这个时间再去访问 session就会失效
 secret: 'random_string_goes_here',////加密key 可以随意书写
 duration: 10,//过期时间
 activeDuration: 5 * 1000,// 激活时间，这个时间内再次请求就重新计算
 reapInterval:10000,// 间隔以秒为单位清除过期的会话，如果不需要则为-1。默认为1 hour
 ttl:36000,//默认3600秒
 resave: true,
 reapAsync:true ,//使用不同的工作进程来删除陈旧的会话。默认为false
 reapSyncFallback:true,// 如果不能异步执行，则同步收到过时会话。默认为false
}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.set('views','./views');
app.set('view engine','ejs');
//为html扩展名注册ejs
app.engine('html',ejs.renderFile);
app.get('/payImg',function(req,res){
    res.render('pay_qrCode.html',req.query);
})
app.get('/release',function(req,res){
    res.render('index.html',req.query);
})
 //设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, content-type,Authorization,X-Requested-With,token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);//接收cookie
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/uploads',express.static(path.join(__dirname,'./uploads')));//静态资源，在线引用
app.use('/public',express.static(path.join(__dirname,'./uploads')));//静态资源，在线引用
app.use('/readFile',express.static(path.join(__dirname,'../../../')));//静态资源，在线引用

// 解析token信息
app.use(function (req,res,next) {
  var tokenstr = req.headers['authorization'];
  if (!tokenstr){
	  console.log("请求未携带token  请求地址："+req.url)
    return next();
  }
  else {
    token.verifyToken(tokenstr,'zhangdada').then((data)=>{
      logs.saveLogs(data.userifo,req)
      req.data=data;
      return next();
    }).catch((err)=>{
      return next();
    })
  }
});

// 校验token是否过期，并且去除该地址不用校验
app.use(expressJwt({secret:'zhangdada',algorithms: ['HS256']}).unless({
  path:['/user/login','/user/weixinLogin','/user/getMailCde','/user/VCode','/music/song/url','/music/search', '/update/update','/user/reg',
  '/play/creatOrder','/play/test','/analysis/shiping','/readFile/redVideoImg','/readFile/','/fund/fund',
  '/fund/getAllFundName','/fund/getRealTime','/analysis/screenshot']
}))
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
        code:401,
        message:"请先登录"
    });
  }
});
 
const download=require('./router/download')
app.use('/download',download) //文件下载
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
const imgRecognition=require('./router/imgRecognition')
app.use('/imgRecognition',imgRecognition)
const lottery=require('./router/lottery')
app.use('/lottery',lottery)
const PuppeteerRouter=require('./router/activity')
app.use('/activity',PuppeteerRouter)
const fund=require('./router/fund')
app.use('/fund',fund)
const music=require('./router/music')
app.use('/music',music)

	//配置服务端口
	var server = app.listen(3000, function() {
	
	    var host = server.address().address;
	
	    var port = server.address().port;
	
	    console.log('Example app listening at http://%s:%s', host, port);
	})
	