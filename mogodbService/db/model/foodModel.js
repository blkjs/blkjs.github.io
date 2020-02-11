 var mongoose =require('mongoose')
 var foodSchema = new mongoose.Schema({
    foodName : {type:String,required:false},
	price: {type:String,required:true},
	img : {type:String,required:true},
	cum :Number,
  });
  
  var Food = mongoose.model('foods', foodSchema);//转化为数据模型,会自动转复数形式foods
  module.exports=Food