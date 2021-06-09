 var mongoose =require('mongoose')
 var logSchema = new mongoose.Schema({
    operatorId : {type:String,required:true},//操作者ID
    Interface: {type:String},//操作的接口
    time:{type:String},//时间
     userName:{type:String},//用户名
     avatar: {type:String},//头像
     openid: {type:String},//
     sessionKey: {type:String},
     city: {type:String},
     province: {type:String},
     country: {type:String},
  });
  
  var Logs = mongoose.model('logs', logSchema,'logs');
  module.exports=Logs