 var mongoose =require('mongoose')
 var qrCodeSchema = new mongoose.Schema({
    money : {type:Number,required:true},//金额(元)
	time: {type:String,required:true},//存放时间戳
	remarks : {type:String,required:false},// 备注
	type :{type:String,required:true},//类型，支付宝，微信，qq
	path :{type:String,required:true}//存放图片的相对路径
  });
  
  var QrCode = mongoose.model('qrCode', qrCodeSchema);//转化为数据模型,会自动转复数形式foods
  module.exports=QrCode