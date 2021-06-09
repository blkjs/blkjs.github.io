const logModel = require('../db/model/logModel')

exports.saveLogs = function(data,req) { //记录操作日志
    try{
        var logs = new logModel();
        logs.operatorId = data._id
        logs.Interface = req.url
        logs.time = new Date().getTime()
        logs.userName = data.userName
        logs.avatar = data.avatar
        logs.openid = data.openid
        logs.sessionKey = data.sessionKey
        logs.city = data.city
        logs.province = data.province
        logs.country = data.country
        logs.save()
    }catch(err){
    }
}