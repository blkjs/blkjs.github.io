var jwt = require('jsonwebtoken');


/*
 生成token  参数
       payload:基本信息
       secretOrPrivateKey:密钥  casuallaborer
       options：时效
*/
exports.createToken=function (payload,secretOrPrivateKey,options) {
    return new Promise((resolve,reject)=>{
        const token =jwt.sign(payload,secretOrPrivateKey,options);
        resolve(token);
    })

};

/*
    验证token
        token:token值
        secretOrPrivateKey:密钥
 */

exports.verifyToken=function(token,secretOrPrivateKey){
    return new Promise((resolve,reject)=>{
        const info=jwt.verify(token.split(' ')[1],secretOrPrivateKey);
        resolve(info);
    })
}

