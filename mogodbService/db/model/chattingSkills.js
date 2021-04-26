 var mongoose =require('mongoose')
 var chattingSkills = new mongoose.Schema({
    post : {type:String},//问
	answer: {type:String},//答
    categories: {type:String},//分类:评论,对话,笑话
  });
  
  var chatting = mongoose.model('chattingSkills', chattingSkills,'chattingSkills');//转化为数据模型,会自动转复数形式users,('模型名称', userSchema,'集合名称')
  module.exports = chatting