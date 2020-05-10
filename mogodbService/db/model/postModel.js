 var mongoose =require('mongoose')
 var postSchema = new mongoose.Schema({
    arr : {type:Array,required:true},
	email:{type:String,required:true},
	time:{type:String,required:true},
	good:{type:Number,required:false,default:0},//点赞次数
	collections:{type:Number,required:false,default:0},//收藏次数
	comment:{type:Number,required:false,default:0},//评论次数
	browseNum:{type:Number,required:false,default:0},//浏览次数
	forwardNum:{type:Number,required:false,default:0},//转发次数
  });
  
  var Post = mongoose.model('posts', postSchema,'posts');//转化为数据模型,会自动转复数形式posts,('模型名称', postSchema,'集合名称')
  module.exports=Post