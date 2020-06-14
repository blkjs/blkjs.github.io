const puppeteer = require('puppeteer');
const express = require('express')
const router = express.Router()
const fs = require('fs')

/**
 * @api {GET} /download 文件下载
 * @apiName 文件下载
 * @apiGroup 文件下载
 * @apiSuccess {string} url 文件地址.
 */
router.get('/', (req, res) => {
	let { url } = req.query
	 var filePath = url;
	 fs.readFile(filePath,(isErr, data)=>{  
		 var index = url.lastIndexOf("\/");
		 var fileNme = url.substring(index + 1,url.length);//从url中截取文件名字
	        if (isErr) {  
	               res.end("Read file failed!");  
	               return;  
	         }  
	         res.writeHead(200,{  
	               'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
	               'Content-Disposition': 'attachment; filename=' + fileNme, //告诉浏览器这是一个需要下载的文件  
	         });  
	         res.end(data)  
	 })
})
module.exports=router