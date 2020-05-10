 var mongoose =require('mongoose')
 var playSchema = new mongoose.Schema({
    money : {type:String,required:true},
	time: {type:String,required:true},
	title : {type:String,required:true},
	type :{type:String,required:true},
  });
  
  var Play = mongoose.model('play', playSchema);//转化为数据模型,会自动转复数形式foods
  module.exports=Play