 var mongoose =require('mongoose')
 var lotterySchema = new mongoose.Schema({ //数据表
	redBall : {type:Array},//红球
	blueBall : {type:Array},//蓝球
	phase:{type:Number,required:true},//第几期
	getTime: {type:Number},//爬取时间
	order : {type:Array},//开奖顺序
	type :{type:Number},//彩票类型
	sales :{type:String},//总销售额
	winPrize1 :{type:String},//一等奖中奖注数
	winPrize1Money :{type:String},//一等奖中奖金额
	winPrize2 :{type:String},//二等奖中奖注数
	winPrize2Money :{type:String},//二等奖中奖金额
	winPrize3 :{type:String},//三等奖中奖注数
	winPrize3Money :{type:String},//三等奖中奖金额
	jackpot:{type:String},//奖池金额
	remarks:{type:String}//备注
});
  
var forecastSchema = new mongoose.Schema({ //预测表
   forecastBlueBall : {type:Array},//预测蓝球
   forecastRedBall : {type:Array},//预测红球
   forecast :{type:Array},//预测
   email :{type:String,required:true},//邮件
   isSendEmail:{type:Boolean},//是否发送邮件通知
   phase:{type:Number,required:true},//第几期
})

var Lottery = mongoose.model('lottery', lotterySchema);
var Forecast = mongoose.model('forecast', forecastSchema);

module.exports={
  Lottery,
  Forecast
}