const express = require('express')
const router = express.Router()
const lotteryModel=require('../db/model/lotteryModel')//引入用户表的lotteryModel模型
/**
 * @api {GET} /download 文件下载
 * @apiName 文件下载
 * @apiGroup 文件下载
 * @apiSuccess {string} url 文件地址.
 */
router.post('/selectLottery', (req, res) => {//查询彩票数据
	lotteryModel.find().then((data)=>{
		res.send({data})
	}).catch((error)=>{
		console.log(error)
		res.send({error})
	})
	
})

router.post('/addLottery', (req, res) => {//添加彩票数据
	let {blueBall,redBall,phase} = req.body
	if(!redBall){
		res.send({code:400,msg:'缺少参数'})
	}
	if(typeof(blueBall)==="string"){
		blueBall = [blueBall]
	}
	if(typeof(redBall)==="string"){
		redBall = [redBall]
	}
	lotteryModel.find({phase:Number(phase)},(err,ret)=>{
		if(err){
			console.log('查询失败')
		} else {
			console.log(ret)
			if(ret.length===0){
			 var lottery = new lotteryModel();
			 lottery.forecastBlueBall=blueBall; //蓝球
			 lottery.forecastRedBall=redBall;//红球
			 lottery.forecast=[{'blueBall':blueBall,'redBall':redBall}];//预测
			 lottery.phase=phase;//第几期
			 lottery.save((data)=>{
				 //console.log(data)
				console.log("保存成功")
				res.send({code:200,msg:'添加成功'})
			 })
			}else if(ret.length>0){
			 lotteryModel.updateOne({phase:Number(phase)},{
				  $push: {
					forecast: {'blueBall':blueBall,'redBall':redBall}
				  }
				},
				err => {
				  if (err) {
					res.send({
					  code: -1,
					  msg: '添加失败'
					})
				  } else {
						res.send({
						  code:200,
							msg:'添加成功'
						}) 
					}
				})
			}
		}
		})
	  /* .then((data)=>{
		  console.log(data)
		  console.log(req.body)
		 if(data.length===0){
			 var lottery = new lotteryModel();
			 lottery.forecastBlueBall=blueBall; //蓝球
			 lottery.forecastRedBall=redBall;//红球
			 lottery.forecast=[{blueBall,redBall}];//预测
			 lottery.phase=phase;//第几期
			 lottery.save((data)=>{
			 	 //console.log(data)
			 	console.log("保存成功")
				res.send({code:200,msg:'添加成功'})
			 })
		 }else if(data.length>0){
			 lotteryModel.updateOne({phase:Number(phase)},(err, response)=> {
			 	if (err){
			 		res.send({message:"添加失败！",err})
			 		return false
			 	  console.log(err);
			 	} else {
					var lottery = new lotteryModel();
					lottery.forecastBlueBall=blueBall; //蓝球
					lottery.forecastRedBall=redBall;//红球
					lottery.phase=phase;//第几期
					lottery.save((data)=>{
						 console.log(data)
						console.log("保存成功1")
						res.send({code:200,msg:'添加成功'})
					})
					 lottery.save()
					}
			   })
		 }
	  }) */
})

module.exports=router