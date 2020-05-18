const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const multipart = require('connect-multiparty') //解决from-data接收不到数据问题...
const multipartyMiddleware = multipart()
const async = require('async');
const qrCode = require('../db/model/qrCodeModel');
var AipOcrClient = require("baidu-aip-sdk").ocr;//百度文字识别
// 设置APPID/AK/SK
var APP_ID = "19713711";
var API_KEY = "o5jpbC2gnfCumAc6FCZeZbUc";
var SECRET_KEY = "dHu46h4hBdXh0iQtBrr6ydkHn6LYMVll";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
var HttpClient = require("baidu-aip-sdk").HttpClient;
// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({
	timeout: 15000
});
// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
	// 查看参数
	//console.log(requestOptions)
	// 修改参数
	requestOptions.timeout = 15000;
	// 返回参数
	return requestOptions;
});


var mk = (folderName) => {
	fs.mkdir('./uploads', (error) => {
		fs.mkdir('./uploads/' + folderName, (error) => {
			if (error) {
				console.log(error);
				return false;
			}
		})
	})
}

var saveimg = (folderName, dataBuffer, fileName) => {
	return new Promise((resolve, reject) => {
		fs.writeFile('./uploads/' + folderName + '/' + fileName + '.png', dataBuffer, (err) => {
			if (err) {
				if (err.errno == -4058) {
					mk(folderName)
				}
				console.log(err)
			} else {
				var path = '/public/' + folderName + '/' + fileName + '.png'
				resolve(path)
			}
		});
	})
}


/**
 * @api {post} /file/upload 上传图片
 * @apiName 上传图片
 * @apiGroup file
 * @apiSuccess {String} userEmail 用户邮箱账号,将作为文件夹名称.
 * @apiSuccess {String} imgBase64  用户上传的Base64图片字符串.
 * @apiSuccess {Number} type  1头像,2其他.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 0,
 *       "message": "上传成功",
 *       "imgURL": "/uploads/123456@qq.com/headerImg.png"
 *     }
 */

//上传图片
router.post('/upload', multipartyMiddleware, (req, res) => {
	let imgs  =  JSON.parse(req.body.data)
	let send = []
	let pList= []
	for(let i=0;i<imgs.length;i++){
		let imgBase64 = imgs[i].file.src.replace(/^data:image\/\w+;base64,/, "")//替换图片前缀 data:image\/\w+;base64,
		let arri= i
		pList.push(new Promise((resolve, reject)=> {
			client.generalBasic(imgBase64).then((result) => { //开始百度图像识别
				let data = JSON.parse(JSON.stringify(result)).words_result
				let money
				for (var i = 0; i < data.length; i++) {
					if (data[i].words.indexOf('￥') > -1) {
						money = data[i].words.slice(1, data[i].words.length)
						let dataBuffer = new Buffer.from(imgBase64, 'base64');
						saveimg('wechat', dataBuffer, money)
						.then((path)=>{
							qrCode.find({money,type:'wechat'}).exec((err,resp)=>{
								if(err){
									console.log(err)
								}
								var time=new Date().getTime()
								if(resp.length>0){
									resp[0].money=money
									resp[0].time=time.toString()
									resp[0].type='wechat'
									resp[0].path=path
									resp[0].save((err)=>{
										if(err){
											console.log('修改失败'+money)
											send.push({ 'money':money, status:0, message:'保存失败', arri:arri })
										}else{
											console.log('修改成功'+money)
											send.push({ 'money':money, status:1, message:'保存成功',  arri:arri })
										}
									})
								}else{
									let QrCode = new qrCode()
									QrCode.money=money
									QrCode.time=time.toString()
									QrCode.type='wechat'
									QrCode.path=path
									QrCode.save((err)=>{
										if(err){
											console.log(err)
											console.log('保存失败'+money)
											send.push({ 'money':money, status:0, message:'保存失败',  arri:arri })
										}else{
											console.log('保存成功'+money)
											send.push({ 'money':money, status:1, message:'保存成功',  arri:arri })
										}
									})
								}
							})
						})
					}
				}
				console.log(money)
				resolve()
			}).catch(function(err) {
				// 如果发生网络错误
				console.log(err);
				reject(err)
			});
		}))
	}
	Promise.all(pList).then((resp)=> {
		setTimeout(()=>{
			res.send(send)
		},1000)
	})
})
router.post('/getQrCode', multipartyMiddleware, (req, res) => {//查询二维码
	let {id}  =  req.body
	console.log(id)
	let pageSize=req.body.pageSize || 5 //默认查询5条
	let page=req.body.page || 1			//默认第1页
	qrCode.find({$and:[{money:{$gte:id}},{money:{$lt:id+10}},{type:'wechat'}]})
	 .then((data)=>{
		  console.log(data)
		  		res.send({massage:"查询成功",status:1,data})
		 
	 })
	 .catch((err)=>{
		 console.log(err)
		  res.send({massage:"查询失败",status:0})
	 })
})

/**
 * @param { delPath：String } （需要删除文件的地址）
 * @param { direct：Boolean } （是否需要处理地址）
 */
function deleteFile(delPath, direct) {
    delPath = direct ? delPath : path.join(__dirname, delPath)
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}
router.post('/delQrCode', multipartyMiddleware, (req, res) => {//查询二维码
	let {_id,path}  =  req.body
	console.log(_id,path)
	qrCode.deleteOne({_id})
	.then((data)=>{
		console.log(data)
		res.send({massage:"操作完成",status:1,data})
		deleteFile('../'+path.replace(/public/, "uploads"),false)
	})
	.catch((err)=>{
		console.log(err)
		res.send({massage:"删除失败",status:0,err:err})
	})
})
module.exports = router