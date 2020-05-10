const express =require('express')
const app=express()
const router =express.Router()
var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹



/**
 * @api {post} /update/update 检查更新
 * @apiName 检查更新
 * @apiGroup update
 * @apiSuccess {String} type 平台（1101是安卓，1102是IOS）.
 * @apiSuccess {String} version  当前客户端APP版本号.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {// 内容以空格换行 
		"success": true,
		"data": { 
			"versionCode": "126",
			"versionName": "1.2.6",
			"versionInfo": "本次更新内容： 1、初始版本a",
			"forceUpdate": true,
			 "downloadUrl": "http://49.235.80.50:3000/public/1051011877@qq.com/android_debug.apk" ,
		 } 
	}
 */
//搜索接口
router.post('/update',(req,res)=>{
	let {type,version} = req.body
	console.log(type,version)
	 /* 接口入参说明
	  * version: 应用当前版本号（已自动获取）
	  * type：平台（1101是安卓，1102是IOS）
	  * version:app版本号
	  */
	 let serverVersion = "100"
	 let serverVersionName = "1.0.0"
	 console.log(parseInt(version) < parseInt(serverVersion))
	if(parseInt(version) < parseInt(serverVersion) && type==="1101"){//安卓更新
		res.send({// 内容以空格换行
			"success": true,
			"data": { 
				"versionCode": serverVersion,
				"versionName": serverVersionName,
				"versionInfo": "本次更新内容： \r 1、初始版本a",
				"forceUpdate": true,//是否强制更新
				 "downloadUrl": "http://49.235.80.50:3000/public/1051011877@qq.com/android_debug.apk" ,
			 } 
		})
	}

})
module.exports=router