const express =require('express')
const app=express()
const router =express.Router()
var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./apiStatic/talking');
const Post = require('../db/model/postModel.js')
// const ObjectID = require('mongodb').ObjectID;
let codes={}//通过内存保存邮箱验证码,邮箱,时间戳

//调用文件遍历方法
//fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath,res,searchContent){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,(err,files)=>{
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach((filename)=>{
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,(eror, stats)=>{
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){// 读取文件内容
                            console.log(filedir);
                            var content = fs.readFileSync(filedir, 'utf-8');
							var arr=content.split('E')//分割成数组
							var indexArr=[]//存放查找到的的下标
							arr.forEach((item,index,x)=>{
								if(item.indexOf(searchContent)!==-1){
									indexArr.push(item)
								}
							})
                            console.log(indexArr);
							res.send({message:"请求成功",status:1,result:indexArr})
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
	
}



/**
 * @api {post} /talkingSkill/search 搜索话术
 * @apiName 搜索话术
 * @apiGroup user
 * @apiSuccess {String} userEmail 用户邮箱号.
 * @apiSuccess {String} searchContent  要搜索的内容.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "userEmail": "2155655@qq.com",
 *       "userPass": "123456",
 *       "code":"s55g"
 *     }
 */
//搜索接口
router.post('/search',(req,res)=>{
	let times=new Date().getTime()//时间戳
	let {userEmail,searchContent} = req.body//邮箱号
	let {cum}  = {cum:userEmail+'-cum'}//设置次数名字
	let {time} = { time:userEmail+"-time"}//本次请求时间名=邮箱+'-time'	
	let {lastTime}  = {lastTime:userEmail+'-lastTime'}//上次请求时间的名字
	let {lastTime1}  = {lastTime1:userEmail+'-lastTime1'}//上上次请求时间的名字
	console.log(req.body)
	if(!userEmail || !searchContent){
		res.send({message:"缺少参数",status:0})
		return false
	}
	if((times-codes[lastTime1])<300000 && codes[cum]>=20){//5分钟只能请求20次接口,当前时间-上上次时间
		return res.json({
		 	 status:'0',
		 	message:'5分钟内只能请求20次接口',
			time:300000-(times-codes[lastTime1])
		 })
	}
	if((times-codes[time])<10000){//10秒只能请求一次接口
		return res.json({
		 	 status:'0',
		 	message:'请求过于频繁',
			time:10000-(times-codes[time])
		 })
	}
	//codes[userEmail]=code//通过内存保存验证码,重启接口后会丢失
	codes[cum]= ((typeof(codes[cum])=='number' ? codes[cum] : 0) +1) >=4  ?  1:((typeof(codes[cum])=='number' ? codes[cum] : 0) +1),
	codes[lastTime]= codes[time] ? codes[time] : times,//存在上次请求时间则
	codes[lastTime1]= codes[lastTime],//把上次请求时间,改成上上次请求时间
	codes[time]=times
	var result = new fileDisplay(filePath,res,searchContent);
	

})

/**
 * @api {post} /user/reg 用户发帖
 * @apiName 发帖
 * @apiGroup user
 * @apiSuccess {String} userEmail 用户邮箱号.
 * @apiSuccess {Array} arr  发帖内容的数组.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "userEmail": "2155655@qq.com",
 *       "userPass": "123456",
 *       "code":"s55g"
 *     }
 */
//发帖接口
router.post('/posts',(req,res)=>{ 
	let {userEmail,arr}=req.body
	if(!arr){
		res.send({message:"缺少参数",status:0})
		return false
	}
	 var timestamp = (new Date()).getTime();
	 var posts = new Post();
	 posts.arr=arr;
	 posts.email=userEmail;
	 posts.time=timestamp;
	 posts.save(()=>{
		 res.send({message:"发布成功",status:1,data:req.body})
	 })
	 
})

/**
 * @api {post} /user/userIfo 查询帖子信息
 * @apiName 查询帖子信息
 * @apiGroup user
 * @apiSuccess {String} email 用户邮箱号,查询该用户下的帖子(所有字段非必须传，什么都不传返回最新发帖).
 * @apiSuccess {String} _id  帖子ID，精确查找帖子.
 * @apiSuccess {String} page  当前页数
 * @apiSuccess {String} num  每次接收多少条数据
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"s55g"
 *     }
 */
router.post('/postsIfo',(req,res)=>{//查询帖子信息
	let {email,_id,page,num}=req.body
	whereStr = {_id:ObjectID(req.body._id)}//mongo的默认_id是比较特殊的数据类型，需要手动定义、转换
	var get=(type,page,num)=>{
		console.log(type)
		if(type===null){
			Post.find()//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
			  .then((data)=>{
					res.send({message:"查询成功",status:1,data:data})
			  })
			 .catch((err)=>{
				  console.log(err)
				  res.send({message:"查询失败",status:0,error:err})
			 })
		}else if(type==="_id"){
			
			Post.find({_id:whereStr})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
			  .then((data)=>{
					res.send({message:"查询成功",status:1,data:data})
			  })
			 .catch((err)=>{
				  console.log(err)
				  res.send({message:"查询失败",status:0,error:err})
			 })
		}
		
	}
	if(!email && !_id){
		get(null,page,num)
		console.log("1111111111")
	}else if(email){
		get("email",page,num)
	}else if(_id){
		get("_id",page,num)
	}

});

module.exports=router