const express = require('express');
const app = express();
const moment = require('moment')
    //导入cors模块,该模块为跨域所用
const cors = require('cors');
app.use(cors());

//解析表单的插件
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))


//创建数据库连接对象
/* const mysql = require('mysql');
var conn = mysql.createConnection({
    host: '127.0.0.1',//数据库地址
    user: 'web',//账号
    password: '1051011877@qq.com',//密码
    database: 'web',//库名
    multipleStatements: true //允许执行多条语句
}) */
var mysql  = require('mysql');

var pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "1051011877@qq.com",
    database: "web",
    ssl: false,
    dateStrings: true
});


var query=function(sql,options,callback){

    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,options,function(err,results,fields){
                //事件驱动回调
                callback(err,results,fields);
            });
            //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
            conn.release();
			console.log("释放连接")
        }
    });
};


module.exports={

query,
};
