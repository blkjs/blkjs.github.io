const express =require('express')

const router =express.Router()
const foodModel=require('../db/model/foodModel')//引入Schema模型




/**
 * @api {post} /food/addFood 增加食物
 * @apiName 增加食物
 * @apiGroup food
 * @apiSuccess {String} foodName 食物名.
 * @apiSuccess {String} price  价格.
 *  * @apiSuccess {String} img  图片.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "userEmail": "2155655@qq.com",
 *       "userPass": "123456",
 *     }
 */
//增加食物
router.post('/addFood',(req,res)=>{
	let {foodName,price,img,cum}=req.body
	if(!foodName || !price || !img || !cum){
		res.send({massage:"缺少参数",status:0})
		return false
	}
	foodModel.insertMany({foodName,price,img,cum})//增加
	 .then((data)=>{
		  console.log(data)
		  if(data.length>0){
		  		res.send({massage:"添加成功",status:1})
		  }else{
		  		res.send({massage:"添加失败",status:0})
		  }
	 })
	 .catch((err)=>{
		 console.log(err)
		  res.send({massage:"内部错误",status:0})
	 })
})

/**
 * @api {post} /food/getInfoByPage 分页查询
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
 *     "_id": "5e3c28acc8769d12ec772707",
 *     "foodName": "宫保鸡丁",
 *     "price": "23",
 *     "img": "/public/images/2.png",
 *     "cum": 8,
 *     "__v": 0
 *   },
 *   {
 *     "_id": "5e3c28b1c8769d12ec772708",
 *     "foodName": "胡萝卜",
 *     "price": "23",
 *     "img": "/public/images/2.png",
 *     "cum": 8,
 *     "__v": 0
 *   },
 *   {
 *     "_id": "5e3c28b3c8769d12ec772709",
 *     "foodName": "小白菜",
 *     "price": "23",
 *     "img": "/public/images/2.png",
 *     "cum": 8,
 *     "__v": 0
 *   }
 * ]
 *}
 */
//分页
router.post('/getInfoByPage',(req,res)=>{ 
	let pageSize=req.body.pageSize || 5 //默认查询5条
	let page=req.body.page || 1			//默认第1页
	foodModel.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))//默认查询5条跳过(skip)0条
	 .then((data)=>{
		  console.log(data)
		  		res.send({massage:"查询成功",status:1,data})
		 
	 })
	 .catch((err)=>{
		 console.log(err)
		  res.send({massage:"查询失败",status:0})
	 })
})

module.exports=router