 var mongoose =require('mongoose')
 var qrCodeClassSchema = new mongoose.Schema({
    minMoney : {type:Number,required:true},//最小金额
	maxMoney : {type:Number,required:true},//最大金额
	avatar: {type:String,required:true},//图标
	title: {type:String,required:true},//标题
	remarks : {type:String,required:false},// 备注
	type :{type:String,required:true},//类型，支付宝，微信，qq
  });
  
  var QrCodeClass = mongoose.model('qrCodeClass', qrCodeClassSchema);//转化为数据模型,会自动转复数形式
  module.exports=QrCodeClass