const express =require('express')

const router =express.Router()
const Message =require('../db/model/messageModel')//引入Schema模型


/**
 * @api {post} /message/getMessage 分页查询
 * @apiName //分页查询
 * @apiGroup food
 * @apiSuccess {Number} pageSize 每页数据条数.
 * @apiSuccess {Number} page  哪一页.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 * "massage": "查询成功",
 * "status": 1,
 * "data": [
 *   {
 *     "messages": "GV的人工不同发布会",
 *     "userEmail": "10510@qq.com",
 *     "isRead": "0",
 *     "creatTime": "1523465456"
 *   }
 * ]
 *}
 */
//分页
router.post('/getMessage',(req,res)=>{ 
	let {userEmail}=req.body
	var nowTime =new Date().getTime()
	Message.find({
		userEmail,
		creatTime:{
	     "$gte": nowTime-1000*60*60*24*5,//查询5天以内的所有已读和未读消息
	     "$lte":nowTime
		},
	})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
	.then((data)=>{
		  Message.updateMany({userEmail,isRead:0},{isRead:1})
		  .then(()=>{
		  })
		  res.send({massage:"查询成功",status:1,data:data.reverse()})
	 })
	 .catch((err)=>{
		 console.log(err)
		  res.send({massage:"查询失败",status:0,err:err})
	 })
})

module.exports=router