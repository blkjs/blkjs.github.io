 var mongoose =require('mongoose')
 var orderSchema = new mongoose.Schema({
    time : {type:String,required:true},
	price: {type:String,required:true},
	name : {type:String,required:true},
	status :{type:Number,required:true},
	payType :{type:String,required:true},
  });
  
  var Order = mongoose.model('orders', orderSchema);//转化为数据模型,会自动转复数形式foods
  module.exports=Order