 var mongoose =require('mongoose')
 var messageSchema = new mongoose.Schema({
    messages : {type:String,required:true},
	userEmail:{type:String,required:true},
	isRead:{type:Number,default:0},
	creatTime:{type:String,required:false},
	diamonds:{type:String,required:false},//本次兑换后剩余钻石数量，不代表最终数量
  });
  
  var Message = mongoose.model('messages', messageSchema,'messages');//转化为数据模型,会自动转复数形式users,('模型名称', userSchema,'集合名称')
  module.exports=Message