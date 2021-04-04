var fs = require('fs');
var path = require('path');
var express = require('express');
const router = express.Router()
var exec= require('child_process').exec
var VideoImg = []
function traverseDir( dir) {
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
setTimeout(()=>{
    VideoImg.sort(function() { //随机打乱数组
        return (0.5-Math.random());
    });
    setTimeout(()=>{
        VideoImg.forEach((item,index)=>{
            if(item.indexOf('.mp4')==-1 && item.indexOf('.rmvb')==-1 && item.indexOf('.avi')==-1 && item.indexOf('.png')==-1 && item.indexOf('.jpg')==-1){
                 VideoImg.splice(index,1);
            } 
        })
    },3000)
},6000)

router.post('/redVideoImg', async(req, res) => {
    const { pageNum, pageSize} = req.body
    console.log(req.body)
    let list = VideoImg.slice( (pageNum - 1)* pageSize, pageNum*pageSize)
    await list.forEach(async(item,index)=>{
        let item1 = item.replace(/F:/g, "/readFile")
        if(item1.indexOf('.mp4')>-1 || item1.indexOf('.rmvb')>-1 || item1.indexOf('.avi')>-1){
            let filePath = item.replace(/F:/g, "../../..").replace(/\\/g, "/")
            let pos = filePath.lastIndexOf('/');//'/所在的最后位置'
            let fileName = filePath.substr(pos+1).replace(/.mp4/g, "").replace(/.rmvb/g, "").replace(/.avi/g, "")//截取文件名(不含后缀)
            let savePath = "./uploads/thumbnail/"+fileName+".jpg"
            await exec("ffmpeg -ss 00:00:10 -i "+filePath+" -y -f image2 -t 0.001 "+savePath,async function() {
                list[index] = await {
                    video:item1.replace(/\\/g, "/").toString(),
                    type:'video',
                    img:savePath.replace(/.\/uploads/g, "/uploads")
                }
                console.log(savePath)
            });
        }else if(item1.indexOf('.png')>-1 || item1.indexOf('.jpg')>-1){
            list[index] = await {
               img:item1.replace(/\\/g, "/"),
               type:'img'
            }
        }
    })
    var index = 0
    var setIntId = setInterval(()=>{
        index = index + 1
        if(list.length>=pageSize || index > 3){
            clearInterval(setIntId)
            res.send({
              total:VideoImg.length,
              VideoImg:list
            })
        }
    },3000)
})
module.exports=router