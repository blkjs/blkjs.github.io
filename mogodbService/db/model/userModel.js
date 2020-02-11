 var mongoose =require('mongoose')
 var userSchema = new mongoose.Schema({
    userName : {type:String,required:false},
	userEmail: {type:String,required:true},
	userPass : {type:String,required:true},
	userAge : 	Number,
	sex:		{type:Number,default:0},
	headerImg:{type:String,required:false}
  });
  
  var User = mongoose.model('users', userSchema);//转化为数据模型,会自动转复数形式users
  module.exports=User