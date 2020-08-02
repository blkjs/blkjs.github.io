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
const lotteryModel=require('../db/model/lotteryModel')//引入用户表的lotteryModel模型
/**
 * @api {post} /analysis/shiping 解析快手视频
 * @apiName 视频解析
 * @apiGroup 解析
 * @apiSuccess {url} url 视频地址.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"s55g"
 *     }
 */

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
			if($('script')){
				let data = $('script').each((index,el)=>{//电脑版抖音链接检测,电脑抖音的视频地址放script标签的
				for (let i in el.children[0]) {
					let data = el.children[0].data
					let start = data.indexOf('"srcNoMark":"http')
					if(start>0){
						let str = data.slice(start,99999999999)
						let end = str.indexOf('.mp4')+4
						let str1 = str.slice(13,end)
						console.log(str1)
						if(str1.length > 40){
							list.push(str1)
							res.send({
								data:[str1]
							})
							break
						}
					}
					
				 }
				
				})
			}
			setTimeout(()=>{
				console.log($('video'))
				console.log('123')
				$('video').each((index,el)=>{//移动版抖音快手链接检测
					if($(el).attr('src')!==null && $(el).attr('src')!=='' && $(el).attr('src')!==undefined){
						let src=str_geturl($(el).attr('src'))
						list.push(src)
					}
				})},6000)
			 /* $('script').each((index,el)=>{//电脑版抖音链接检测,电脑抖音的视频地址放script标签的
				for (let i in el.children[0]) {
					if(el.children[0][i]!==null && el.children[0][i]!=='' && el.children[0][i]!==undefined){
						var str = el.children[0][i].toString()
						let URL = str_geturl(str)//抖音有水印连接去水印
						if(URL && URL.indexOf("http")!==-1){//数据
							list.push(URL)
						}
					}
				}
				 
				})*/
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

/**
 * @api {post} /analysis/img 解析网页图片
 * @apiName 图片解析
 * @apiGroup 解析
 * @apiSuccess {url} url 网页地址.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"s55g"
 *     }
 */

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
					  data:'http://localhost:3000/uploads/'+nowDate+'.png'
				  })
				  driver.close()//关闭页面
			    }
			});
		});
		}
		fn()

});

router.post('/caipiao', function(req, res, next) {//中国福利彩票数据
	//let {url} = req.body
	(async function example() {
		let driver = await new webdriver.Builder().forBrowser('chrome').build();
		var url = "http://www.cwl.gov.cn/kjxx/ssq/kjgg/"
		let result = []
		await driver.get(url);
		  //await driver.findElement(By.css('#changeCityBox .checkTips .tab.focus')).click();
		  //await driver.findElement(By.id('search_input')).sendKeys('前端', Key.ENTER);
		  //let items = await driver.findElements(By.className('ball_box01'))
		  let items = await driver.getPageSource()
		  let $ = await cheerio.load(items)
		  let list = await $('.ball_box01 ul li')
		  $('.bgzt table tbody tr').each((index,el)=>{
			  let data = {}
			  $(el).children().each((index1,el)=>{
					if(Number(index1)===0){ //第0个tr，第几期
						data.phase = $(el).html()
					}else if(Number(index1)===1){ //第1个tr,开奖日期
						data.data = $(el).html()
					}else if(Number(index1)===2){ //第2个tr,红球数组
						let redBall = []
						$(el).children().each((index,el)=>{
						  if($(el).html() || $(el).html() !== ""){
							  redBall.push($(el).html())
						  }
						})
						data.redBall = redBall
					}else if(Number(index1)===3){ //第3个tr,蓝球
						let blueBall = []
						$(el).children().each((index,el)=>{
						  if($(el).html() || $(el).html() !== ""){
							  blueBall.push($(el).html())
						  }
						})
						data.blueBall = blueBall
					}else if(Number(index1)===4){ //第4个tr,总销售额
						data.sales = $(el).html()
					}else if(Number(index1)===5){ //第5个tr,一等奖中奖注数
						data.winPrize1 = $(el).html()
					}else if(Number(index1)===6){ //第6个tr,一等奖中奖金额
						data.winPrize1Money = $(el).html()
					}else if(Number(index1)===7){ //第7个tr,二等奖中奖注数
						data.winPrize2 = $(el).html()
					}else if(Number(index1)===8){ //第8个tr,二等奖中奖金额
						data.winPrize2Money = $(el).html()
					}else if(Number(index1)===9){ //第9个tr,三等奖中奖注数
						data.winPrize3 = $(el).html()
					}else if(Number(index1)===10){ //第10个tr,三等奖中奖金额
						data.winPrize3Money = $(el).html()
					}else if(Number(index1)===11){ //第11个tr,奖池金额
						data.jackpot = $(el).html()
					}else{
						//result.push($(el).html())
					}
			  })
			  result.push(data)
		  })
		  if(res){
			  res.send({result})
		  }
		  driver.close()//关闭页面
		  result.forEach((item,index,arr)=>{ //循环取出保存到数据库
			  lotteryModel.find({phase:item.phase})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
			    .then((data)=>{
			  	  if(data.length===0){
			  		 var lottery = new lotteryModel();
			  		 var nowDate = new Date().getTime()
					 console.log(item.redBall)
			  		 lottery.redBall=item.redBall;
					 lottery.blueBall=item.blueBall;
			  		 lottery.phase=item.phase;
					 lottery.data=item.data;
					 lottery.name="双色球";
			  		 lottery.getTime=nowDate
			  		 lottery.type=1;
					 lottery.sales=JSON.stringify(item.sales)//总销售额
					 lottery.winPrize1=JSON.stringify(item.winPrize1)  //一等奖中奖注数
					 lottery.winPrize1Money=JSON.stringify(item.winPrize1Money)//一等奖中奖金额
					 lottery.winPrize2=JSON.stringify(item.winPrize2)//二等奖中奖注数
					 lottery.winPrize2Money=JSON.stringify(item.winPrize2Money)//二等奖中奖金额
					 lottery.winPrize3=JSON.stringify(item.winPrize3) //三等奖中奖注数
					 lottery.winPrize3Money=JSON.stringify(item.winPrize3Money) //三等奖中奖金额
					 lottery.jackpot=JSON.stringify(item.jackpot) //奖池金额
			  		 lottery.save((data)=>{
						 //console.log(data)
			  			console.log("保存成功")
			  		 })
			  	  }else{
			  			console.log("该期已经存在")
			  	  }
			    })
			   .catch((err)=>{
			  	  console.log(err)
			  			  console.log("保存失败")
			   })
		  })
	})();
});

router.get('/caipiao2', function(req, res, next) {//500彩票数据
	//let {url} = req.body
	(async function example() {
		let driver = await new webdriver.Builder().forBrowser('chrome').build();
		var phase = req.query.phase //第几期
		var url = "http://kaijiang.500.com/shtml/ssq/"+phase+".shtml"
		let result = []
		let order = ""
		await driver.get(url);
		  //await driver.findElement(By.css('#changeCityBox .checkTips .tab.focus')).click();
		  //await driver.findElement(By.id('search_input')).sendKeys('前端', Key.ENTER);
		  //let items = await driver.findElements(By.className('ball_box01'))
		  let items = await driver.getPageSource()
		  let $ = await cheerio.load(items)
		  let list = await $('.ball_box01 ul li')
		  $('.ball_box01 ul li').each((index,el)=>{
			result.push($(el).html())
		  })
		  $('kj_tablelist02 tr:nth-child(1) td table tbody tr:nth-child(1) td:nth-child(1)').each((index,el)=>{
			console.log($(el).html())
			order = $(el).html()
		  })
		  console.log(result)
		  if(res){
			  res.send({result,phase,order})
		  }
		  driver.close()//关闭页面

		  lotteryModel.find({phase})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
		    .then((data)=>{
		  	  if(data.length===0){
		  		 var lottery = new lotteryModel();
				 var nowDate = new Date().getTime()
		  		 lottery.lotteryNumber=result;
		  		 lottery.phase=phase;
		  		 lottery.userAge=req.body.userAge;
		  		 lottery.getTime=nowDate
		  		 lottery.type=1;
				 lottery.order=order;
		  		 lottery.save(()=>{
					 console.log("保存成功")
		  		 })
		  	  }else{
				  console.log("该期已经存在")
		  	  }
		    })
		   .catch((err)=>{
		  	  console.log(err)
			  console.log("保存失败")
		   })
	})();
	
});
module.exports = router;
