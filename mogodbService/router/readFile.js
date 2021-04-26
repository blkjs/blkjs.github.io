var fs = require('fs');
var path = require('path');
var express = require('express');
const router = express.Router()
var exec= require('child_process').exec
var VideoImg = []
function traverseDir( dir) {//读取目录下所有文件的完整路劲
    fs.readdirSync( dir).forEach( file => {
        let fullPath = path.join( dir, file);
        if( fs.lstatSync( fullPath).isDirectory()) {
            // console.log( fullPath);
            traverseDir( fullPath);
        } else {
            // console.log( fullPath);
            if(fullPath.indexOf('.mp4') || fullPath.indexOf('.jpg') || fullPath.indexOf('.png')){
                VideoImg.push(fullPath)
            }
        }
    });
}
traverseDir('F:/迅雷下载/2/8/4/8/5/0');
VideoImg.sort(function() { //随机打乱数组
    return (0.5-Math.random());
});
setTimeout(()=>{
    VideoImg.forEach((item,index)=>{ //清理垃圾
        if(item.indexOf('.mp4')==-1 && item.indexOf('.rmvb')==-1 && item.indexOf('.avi')==-1 && item.indexOf('.png')==-1 && item.indexOf('.jpg')==-1){
             VideoImg.splice(index,1);
        } 
    })
},3000)
function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    return files;
}
var thumbnail = readFileList('./uploads/thumbnail');


router.post('/redVideoImg', async(req, res) => {
    const { pageNum, pageSize} = req.body
    var index = 0
    var index1 = 0
    let list = VideoImg.slice( (pageNum - 1)* pageSize, pageNum*pageSize)
    await list.forEach(async(item,index)=>{
        index1 = index1 + 1
        let item1 = item.replace(/F:/g, "/readFile")
        let filePath = item.replace(/F:/g, "../../..").replace(/\\/g, "/")
        let pos = filePath.lastIndexOf('/');//'/所在的最后位置'
        let fileName = filePath.substr(pos+1).replace(/.mp4/g, "").replace(/.rmvb/g, "").replace(/.avi/g, "")//截取文件名(不含后缀)
        let savePath = "./uploads/thumbnail/"+fileName+".jpg"
        if(thumbnail.indexOf(filePath.substr(pos+1)) > -1){
            list[index] = await {
                video:item1.replace(/\\/g, "/"),
                type:'video',
                img:savePath.replace(/.\/uploads/g, "/uploads")
            }
            return
        }
        if(item1.indexOf('.mp4')>-1 || item1.indexOf('.rmvb')>-1 || item1.indexOf('.avi')>-1){
            await exec("ffmpeg -ss 00:00:10 -i "+filePath+" -y -f image2 -t 0.001 "+savePath,async function() {
                list[index] = await {
                    video:item1.replace(/\\/g, "/"),
                    type:'video',
                    img:savePath.replace(/.\/uploads/g, "/uploads")
                }
            });
        }else if(item1.indexOf('.png')>-1 || item1.indexOf('.jpg')>-1){
            list[index] = await {
               img:item1.replace(/\\/g, "/"),
               type:'img'
            }
        }
    })
    
    var setIntId = setInterval(()=>{
        index = index + 1
        if(index > 10 || index1 > pageSize){
            clearInterval(setIntId)
            let date = {
              total:VideoImg.length,
              VideoImg:list
            }
            res.send(date)
        }
    },500)
})
/* const chattingSkills=require('../db/model/chattingSkills')//引入用户表的Schema模型
// var tmpDate = require('F:/Project/聊天话术/笑话.json'); 
fs.readFile('F:/Project/聊天话术/raw_chat_corpus/raw_chat_corpus/qingyun-11w/12万对话语料青云库.csv','utf-8',(err,data)=>{
    if(err){
        console.error(err);
    }
    else{
        // var tmpDate = data.replace(/M /g,'').split(/[(\r\n)\r\n]+/)
        var tmpDate = data.split(/[(\r\n)\r\n]+/)
        console.log(tmpDate.length)
        var num = 0
        setInterval(()=>{
            console.log('开始第'+(num+1)+'次')
            num = num + 1
            tmpDate.slice(num*50000,(num+1)*50000).forEach((item,index)=>{
                 var arr = item.split('|')
                 var chatting = new chattingSkills();
                 chatting.post = arr[0]; //问
                 chatting.answer = arr[1]; //答
                 chatting.categories = '对话' //分类:评论,对话,笑话
                 chatting.save((err,data)=>{
                     if(err){
                         console.log(err)
                     }else{
                         
                     }
                 })
            })
        },40000)
    }
}); */

module.exports=router