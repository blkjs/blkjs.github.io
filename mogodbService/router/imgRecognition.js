const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const multipart = require('connect-multiparty') //解决from-data接收不到数据问题...
const multipartyMiddleware = multipart()
const async = require('async');
const qrCode = require('../db/model/qrCodeModel');
const qrCodeClass = require('../db/model/qrCodeClass');
var AipOcrClient = require("baidu-aip-sdk").ocr; //百度文字识别
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
		var nowTime=new Date().getTime()
		fs.writeFile('./uploads/' + folderName + '/' + nowTime + '.png', dataBuffer, (err) => {
			if (err) {
				if (err.errno == -4058) {
					mk(folderName)
				}
				console.log(err)
			} else {
				var path = '/public/' + folderName + '/' + nowTime + '.png'
				resolve(path)
			}
		});
	})
}


/**
 * @api {post} /file/upload 上传图片并识别图 
 * @apiName 上传图片的同时识别图片金额
 * @apiGroup 收款码管理
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
	let imgs = JSON.parse(req.body.data)
	let send = []
	let pList = []
	for (let i = 0; i < imgs.length; i++) {
		let imgBase64 = imgs[i].file.src.replace(/^data:image\/\w+;base64,/, "") //替换图片前缀 data:image\/\w+;base64,
		let arri = i
		pList.push(new Promise((resolve, reject) => {
			setTimeout(()=>{
				client.numbers(imgBase64)
								.then((result) => { //开始百度图像识别
									console.log(result)
									if(!result.words_result[0]){
										return
									}
									let monetStr = result.words_result[0].words
									let money = monetStr.slice(0, monetStr.length - 2) + '.' + monetStr.slice(monetStr.length - 2, monetStr.length)
									let dataBuffer = new Buffer.from(imgBase64, 'base64');
										saveimg('wechat', dataBuffer, money)
										.then((path) => {
											qrCode.find({
												money,
												type: 'wechat'
											}).exec((err, resp) => {
												if (err) {
													console.log(err)
												}
												var time = new Date().getTime()
												if (resp.length > 0) {
													resp[0].money = money
													resp[0].time = time.toString()
													resp[0].type = 'wechat'
													resp[0].path = path
													resp[0].save((err) => {
														if (err) {
															console.log(err)
															console.log('修改失败' + money)
															send.push({
																'money': money,
																status: '0',
																message: '保存失败',
																arri: arri
															})
														} else {
															console.log('修改成功' + money)
															send.push({
																'money': money,
																status: '1',
																message: '保存成功',
																arri: arri
															})
														}
													})
												} else {
													let QrCode = new qrCode()
													QrCode.money = money
													QrCode.time = time.toString()
													QrCode.type = 'wechat'
													QrCode.path = path
													QrCode.save((err) => {
														if (err) {
															console.log(err)
															console.log('保存失败' + money)
															send.push({
																'money': money,
																status: '0',
																message: '保存失败',
																arri: arri
															})
														} else {
															console.log('保存成功' + money)
															send.push({
																'money': money,
																status: 1,
																message: '保存成功',
																arri: arri
															})
														}
													})
												}
											})
										})
									resolve()
								}).catch(function(err) {
									// 如果发生网络错误
									//console.log(err);
									//reject(err)
								});
			},1000*i)
		}))
	}
	Promise.all(pList).then((resp) => {
		setTimeout(() => {
			res.send(send)
		}, 1000)
	})
})


/**
 * @api {post} /file/getQrCode 查询二维码
 * @apiName 查询二维码
 * @apiGroup 收款码管理
 * @apiSuccess {Number} id 要查询的金额.
 * @apiSuccess {String} pageSize  查询数据条数.
 * @apiSuccess {Number} page  第几页.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *			massage: "查询成功",
 *			status: 1,
 *			data:""
 *		}
 */

router.post('/getQrCode', multipartyMiddleware, (req, res) => { //查询二维码
	let {
		id
	} = req.body
	console.log(id)
	let minMoney = Number(id)
	let maxMoney = Number(id) + 10
	let pageSize = req.body.pageSize || 5 //默认查询5条
	let page = req.body.page || 1 //默认第1页
	qrCode.find({
			$and: [{
				money: {
					$gte: minMoney
				}
			}, {
				money: {
					$lt: maxMoney
				}
			}, {
				type: 'wechat'
			}]
		})
		.then((data) => {
			console.log(data)
			res.send({
				massage: "查询成功",
				status: 1,
				data
			})

		})
		.catch((err) => {
			console.log(err)
			res.send({
				massage: "查询失败",
				status: 0
			})
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
/**
 * @api {post} /file/delQrCode 删除二维码
 * @apiName 删除二维码
 * @apiGroup 收款码管理
 * @apiSuccess {String} _id 二维码id.
 * @apiSuccess {String} path  二维码路劲.
 *     HTTP/1.1 200 OK
 *     {
 *			massage: "操作完成",
 *			status: 1,
 *			data:""
 *		}
 */
router.post('/delQrCode', multipartyMiddleware, (req, res) => { //删除二维码
	let {
		_id,
		path
	} = req.body
	console.log(_id, path)
	qrCode.deleteOne({
			_id
		})
		.then((data) => {
			console.log(data)
			res.send({
				massage: "操作完成",
				status: 1,
				data
			})
			deleteFile('../' + path.replace(/public/, "uploads"), false)
		})
		.catch((err) => {
			console.log(err)
			res.send({
				massage: "删除失败",
				status: 0,
				err: err
			})
		})
})


/* 超过位数的直接截取，采用四舍五入（若不采用四舍五入，截取2位，则把Math.round改为Math.floor）
例如
2       →     2.00
2.3     →     2.30
2.321   →     2.32
2.328   →     2.33 */
function changeTwoDecimal_f(x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		return 0;
	}
	var f_x = Math.floor(x * 100) / 100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	return s_x;
}

function updateFileName(url, name) {
	fs.readdir(url, 'utf8', (err, fileList) => {
		if (err) throw err;
		fileList.forEach((item, name) => {
			let length = item.split('.').length;
			//获取文件后缀名
			let type = '.' + item.split('.')[length - 1];
			let oldName = item;
			//新名称,根据需求修改名称，可以使用正则等等
			let newName = name + type;
			console.log(newName)
			fs.rename(url + oldName, url + newName, (err) => {
				throw err;
				return newName
			});
		})
	})
}
/**
 * @api {post} /file/delQrCode 修改二维码金额
 * @apiName 修改二维码金额
 * @apiGroup 收款码管理
 * @apiSuccess {String} _id 二维码id.
 * @apiSuccess {String} money  要修改的金额.
 *     HTTP/1.1 200 OK
 *     {
 *			massage: "操作完成",
 *			status: 1,
 *			data:""
 *		}
 */
router.post('/updateMoney', multipartyMiddleware, (req, res) => { //修改二维码金额
	let {
		_id,
		money
	} = req.body
	console.log(_id, money)
		qrCode.updateOne({_id}, {money})
		.then((data) => {
			console.log(data)
			res.send({
				massage: "操作完成",
				status: 1,
				data
			})
			
		})
		.catch((err) => {
			console.log(err)
			res.send({
				massage: "更新失败",
				status: 0,
				err: err
			})
		})
})

/**
 * @api {post} /file/addClass 添加分类
 * @apiName 添加分类
 * @apiGroup 收款码管理
 * @apiSuccess {String} minMoney 最小金额.
 * @apiSuccess {String} title  标题.
 * @apiSuccess {String} remarks  备注.
 * @apiSuccess {String} type  类型，支付宝，微信，qq.
 *     HTTP/1.1 200 OK
 *     {
 *			massage: "操作成功",
 *			status: 1,
 *			data:""
 *		}
 */
router.post('/addClass', multipartyMiddleware, (req, res) => { //修改二维码金额
	let { minMoney, maxMoney, title,remarks = '', type, avatar} = req.body
	if( !minMoney || !title || !type || !avatar ){
		res.send({
			massage: "缺少参数",
			status: 0
		})
	}
	console.log(Number(minMoney),title,remarks,type)
		var classs = new qrCodeClass();
		qrCodeClass.find({minMoney})
			.then((data) => {
				console.log(data)
				if(data.length>0){
					res.send({
						massage: "添加失败，该类已经存在",
						status: 0,
						err: err
					})
				}else{
					classs.minMoney=minMoney;
					classs.maxMoney=maxMoney;
					classs.title=title;
					classs.remarks=remarks;
					classs.type=type
					classs.avatar=avatar
					classs.save()
					.then(()=>{
						res.send({
							massage: "添加成功",
							status: 1,
							data
						})
					})
					.catch((err)=>{
						console.log(err)
						res.send({
							massage: "添加失败",
							status: 0,
							err
						})
					})
				}
		
			})
			.catch((err) => {
				console.log(err)
				res.send({
					massage: "添加失败，该类已经存在",
					status: 0
				})
			})
})

/**
 * @api {post} /file/delQrCode 更新分类
 * @apiName 更新分类
 * @apiGroup 收款码管理
 * @apiSuccess {String} minMoney 最小金额.
 * @apiSuccess {String} title  标题.
 * @apiSuccess {String} remarks  备注.
 * @apiSuccess {String} type  类型，支付宝，微信，qq.
 *     HTTP/1.1 200 OK
 *     {
 *			massage: "操作成功",
 *			status: 1,
 *			data:""
 *		}
 */
router.post('/updateClass', multipartyMiddleware, (req, res) => { //修改二维码金额
	let { minMoney, maxMoney, title,remarks = '', type } = req.body
	if( !minMoney || !title || !remarks || !type ){
		res.send({
			massage: "缺少参数",
			status: 0
		})
	}
	console.log(Number(minMoney),title,remarks,type)
		var classs = new qrCodeClass();
		qrCodeClass.find({minMoney})
			.then((data) => {
				console.log(data)
				if(data.length>0){
					qrCodeClass.updateOne({'minMoney':minMoney}, {'minMoney':minMoney,'maxMoney':maxMoney,'title':title,'remarks':remarks,'type':type})
					.then((data) => {
						console.log(data)
						res.send({
							massage: "操作成功",
							status: 1,
							data
						})
						
					})
					.catch((err) => {
						console.log(err)
						res.send({
							massage: "更新失败",
							status: 0,
							err: err
						})
					}) 
				}else{
					res.send({
						massage: "更新失败，不存在该分组",
						status: 0,
						err
					})
				}
		
			})
			.catch((err) => {
				console.log(err)
				res.send({
					massage: "查询失败",
					status: 0
				})
			})
})

router.post('/getClass', multipartyMiddleware, (req, res) => { 
	let { type } = req.body
	if(!type){
		res.send({
			massage: "缺少参数",
			status: 0
		})
	}
	var classs = new qrCodeClass();
	qrCodeClass.find({type})
		.then((data) => {
			res.send({
				massage: "查询成功",
				status: 1,
				data
			})
		})
		.catch((err)=>{
			res.send({
				massage: "查询失败",
				status: 0,
				err
			})
		})
})


router.post('/delClass', multipartyMiddleware, (req, res) => { 
	let { _id } = req.body
	if(!_id){
		res.send({
			massage: "缺少参数",
			status: 0
		})
	}
	var classs = new qrCodeClass();
	qrCodeClass.deleteOne({_id})
		.then((data) => {
			res.send({
				massage: "删除成功",
				status: 1,
				data
			})
		})
		.catch((err)=>{
			res.send({
				massage: "删除失败",
				status: 0,
				err
			})
		})
})

module.exports = router
