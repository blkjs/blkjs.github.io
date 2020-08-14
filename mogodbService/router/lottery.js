const express = require('express')
const router = express.Router()
const {Lottery,Forecast}=require('../db/model/lotteryModel')//引入用户表的lotteryModel模型
/**
 * @api {GET} /download 文件下载
 * @apiName 文件下载
 * @apiGroup 文件下载
 * @apiSuccess {string} url 文件地址.
 */
router.post('/selectLottery', (req, res) => {//查询彩票数据
	Lottery.find().then((data)=>{
		res.send({data,code:200})
	}).catch((error)=>{
		console.log(error)
		res.send({error})
	})
	
})
router.post('/selectForecast', (req, res) => {//查询预测彩票数据
	let {email} = req.body
	if(!email){
		res.send({code:400,msg:'缺少参数'})
	}
	Forecast.find({email}).then((data)=>{
		res.send({data,code:200})
	}).catch((error)=>{
		console.log(error)
		res.send({error})
	})
	
})

router.post('/addLottery', (req, res) => {//添加彩票数据
	let {blueBall,redBall,phase,email} = req.body
	if( !blueBall || !redBall || !email || !phase){
		res.send({code:400,msg:'缺少参数'})
	}
	if(typeof(blueBall)==="string"){
		blueBall = [blueBall]
	}
	if(typeof(redBall)==="string"){
		redBall = [redBall]
	}
	Forecast.find({email},(err,ret)=>{
		if(err){
			console.log('查询失败')
		} else {
			console.log(ret)
			if(ret.length===0){
			 var Lottery = new Forecast();
			 Lottery.forecastBlueBall=blueBall; //蓝球
			 Lottery.forecastRedBall=redBall;//红球
			 Lottery.forecast=[{'blueBall':blueBall,'redBall':redBall,phase}];//预测
			 Lottery.email=email;//邮箱
			 console.log(Lottery)
			 Lottery.save((data)=>{
				 //console.log(data)
				console.log("保存成功")
				res.send({code:200,msg:'添加成功'})
			 })
			}else if(ret.length>0){
			 Forecast.updateOne({email},{
				  $push: {
					forecast: {'blueBall':blueBall,'redBall':redBall,phase}
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

})

module.exports=router