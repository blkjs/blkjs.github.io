 var mongoose =require('mongoose')
 var userSchema = new mongoose.Schema({
    userName : {type:String,required:true},
	userEmail: {type:String,required:true},
	userPass : {type:String,required:true},
	userAge : 	Number,
	sex:		{type:Number,default:1},
	headerImg:{type:String,required:false},
	diamonds:{type:String,required:false,default:15},
	expirationDate:{type:String,required:false,default:0},
  });
  
  var User = mongoose.model('users', userSchema,'users');//转化为数据模型,会自动转复数形式users,('模型名称', userSchema,'集合名称')
  module.exports=User