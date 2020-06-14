var express = require('express');
var router = express.Router();
var cheerio=require('cheerio')
//var phantom = require('phantom');
var webdriver = require('selenium-webdriver')
    By = webdriver.By
    until = webdriver.until
var chrome = require('selenium-webdriver/chrome');//移动版浏览器
var https=require('https')
var http=require('http')
var fs=require('fs')
const async = require('async');

/* GET users listing. */
router.post('/shiping', function(req, res, next) {
	let {url} = req.body
	var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .setChromeOptions(new chrome.Options().setMobileEmulation({deviceName: 'iPhone X'}))//移动版浏览器
	    .build();
	const actions = driver.actions();
	//driver.wait(()=> {
	async function fn(){
		await driver.get(url)
		var list = []
		await driver.getPageSource()
		 .then((souce)=> {
			let $ = cheerio.load(souce)
			if($('#hide-pagedata').attr('data-pagedata')){
				let kURL = JSON.parse($('#hide-pagedata').attr('data-pagedata')).video.srcNoMark;//快手无水印
				if(kURL){
					list.push(kURL)
				}
			}else{
				$('video').each((index,el)=>{//移动版抖音快手链接检测
					if($(el).attr('src')!==null && $(el).attr('src')!=='' && $(el).attr('src')!==undefined){
						let src=str_geturl($(el).attr('src'))
						list.push(src)
					}
				})
			}
			 $('script').each((index,el)=>{//电脑版抖音链接检测,电脑抖音的视频地址放script标签的
				for (let i in el.children[0]) {
					if(el.children[0][i]!==null && el.children[0][i]!=='' && el.children[0][i]!==undefined){
						var str = el.children[0][i].toString()
						let URL = str_geturl(str)//抖音有水印连接去水印
						if(URL && URL.indexOf("http")!==-1){//数据
							list.push(URL)
						}
					}
				}
				
			})
			if(list.length>0){//返回数据
				//driver.quit() //完全关闭浏览器
				driver.close()//关闭页面
				res.send({
					data:list
				})
			}
		})
		.catch((err)=>{
			console.log(err)
			res.send({
				data:err
			})
		})
	}
	fn()
	//},10)

});

var str_geturl=(str)=>{//检测字符串中的url
	let start=str.indexOf("playAddr")

	let end=str.indexOf("line=0")
	let str1=str.substring((start===-1 ? 0:start+11),end+6);//截取未去水印的下载链接
	
	let start1=str1.indexOf("playwm")
	let result=str1.substring(0,start1+4)+str1.substring(start1+6,end)//去除playwm中的wm
	
	//console.log(str1)
	//console.log(result)
	if(!result){
		//console.log('没有检测到链接')
	}else{
		return result
	}
}

var save_img=(url)=>{
	let name	= new Date().getTime() + Math.floor(Math.random()*10000+1000)//随机数
	let img_url = url
	let save_url ='./public/images/'+name+'.png'
	return new Promise((resolve, reject) => {
		save(img_url,save_url)
		.then((data)=>{
			resolve(save_url)
		})
		.catch((data)=>{
			console.log(data)
			reject(data)
		})

	})
}

var save=(img_url,save_url)=>{//传入图片的网络地址,保存的本地地址
	if(img_url.indexOf('https')==-1 && img_url.indexOf('http')!==-1){
		return new Promise((resolve, reject) => {
			http.get(img_url,(res)=>{
					/* var Stream = fs.createWriteStream(save_url)//创建可写流的写入方式
					res.pipe(Stream) */
					var ws = fs.createWriteStream(save_url, {start: 0});//创建可写流的写入方式
					res.on('data',(chunk)=>{
						ws.write(chunk, 'utf8', function (err, buffer) {
							
						});
					})
					//数据传输完毕
					var end= res.on('end',()=>{
						console.log('数据传输完毕')
					})
			}).on('error',(err)=>{
				console.log(err)
				//return err
				reject(err)
			})
			
		})
		
	}else if(img_url.indexOf('https')!==-1){
		return new Promise((resolve, reject) => {
			https.get(img_url,(res)=>{
				/* var Stream = fs.createWriteStream(save_url)//创建可写流的写入方式
				res.pipe(Stream) */
				var ws = fs.createWriteStream(save_url, {start: 0});//创建可写流的写入方式
				res.on('data',(chunk)=>{
					ws.write(chunk, 'utf8', function (err, buffer) {
					
					});
				})
				//数据传输完毕
				var end= res.on('end',()=>{
					console.log('数据传输完毕')
				})
				
			}).on('error',(err)=>{
				console.log(err)
				//return err
				reject(err)
			})
			
		})
	}else{
		return new Promise((resolve, reject) => {
			https.get('https:'+img_url,(res)=>{
				/* var Stream = fs.createWriteStream(save_url)//创建可写流的写入方式
				res.pipe(Stream) */
				var ws = fs.createWriteStream(save_url, {start: 0});//创建可写流的写入方式
				res.on('data',(chunk)=>{
					ws.write(chunk, 'utf8', function (err, buffer) {
					
					});
				})
				//数据传输完毕
				var end= res.on('end',()=>{
					console.log('数据传输完毕')
				})
				
			}).on('error',(err)=>{
					http.get('http:'+img_url,(res)=>{
						/* var Stream = fs.createWriteStream(save_url)//创建可写流的写入方式
						res.pipe(Stream) */
						var ws = fs.createWriteStream(save_url, {start: 0});//创建可写流的写入方式
						res.on('data',(chunk)=>{
							ws.write(chunk, 'utf8', function (err, buffer) {
							
							});
						})
						//数据传输完毕
						var end= res.on('end',()=>{
							console.log('数据传输完毕')
						})
						
					}).on('error',(err)=>{
						console.log(err)
						//return err
						reject(err)
					})
				reject(err)
			})
			
		})
	}
	
}

var get_url=(url)=>{//获取单页面所有img标签src属性值
		return new Promise((resolve, reject) => {
			var driver = new webdriver.Builder()
					.forBrowser('chrome')
					.build();
			const actions = driver.actions();
			async function fn(){
				await driver.get(url)
				var list = []
				await driver.getPageSource().then((souce)=> {
					let $ = cheerio.load(souce)
					$('img').each((index,el)=>{
						if($(el).attr('src')!==null && $(el).attr('src')!=='' && $(el).attr('src')!==undefined){
							list.push($(el).attr('src'))
						}
					})
					console.log(list)
					if(list.length>0){
						driver.quit() 
						resolve(list)
					}
				})
				.catch((err)=>{
					console.log(err)
					reject('获取网页源码出错!')
				})
			
			}
			fn()
	})
}

router.post('/img', function(req, res, next) {
	let {url} = req.body
	console.log(url)
	get_url(url)
	.then((href)=>{//获取所有img标签的src
			let newArray = href.map((item) => { //map方法进行阻塞式循环
				save_img(item)
				return item;
			})
			res.send({
				data:newArray
			})
	})
	.catch((data)=>{
		console.log(data)
		res.send({
			message:'未找到内容',
			data,
			status:0
		})
	})

});


router.post('/screenshot', function(req, res, next) {//获取网页截图
	let {url} = req.body
	console.log(req.body)
	console.log(url)
	var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .setChromeOptions(new chrome.Options())
	    .build();

	async function fn(){
		await driver.get(url)
		driver.takeScreenshot().then((base64Data)=>{
		    //这里为截图结果的base64字符串
			var dataBuffer = new Buffer.from(base64Data, 'base64');
			var nowDate = new Date().getTime()
			fs.writeFile('./uploads/'+nowDate+'.png', dataBuffer, (err)=> {
			    if(err){
				  console.log(err)
			    }else{
				  res.send({
					  data:'http://49.235.80.50:3000/public/'+nowDate+'.png'
				  })
				  driver.close()//关闭页面
			    }
			});
		});
		}
		fn()

});


module.exports = router;
