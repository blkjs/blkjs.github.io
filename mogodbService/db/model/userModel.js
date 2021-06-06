 var mongoose =require('mongoose')
 var userSchema = new mongoose.Schema({
    userName : {type:String,required:true},
	userEmail: {type:String},
    openid: {type:String},
    sessionKey: {type:String},
	userPass : {type:String},
	userAge : 	Number,
	sex:		{type:Number,default:1},
	avatar:{type:String},
	diamonds:{type:String,default:15},
	expirationDate:{type:String,default:0},
    city: {type:String},
    province: {type:String},
    country: {type:String},
  });
  
  var User = mongoose.model('users', userSchema,'users');//转化为数据模型,会自动转复数形式users,('模型名称', userSchema,'集合名称')
  module.exports=User