var express = require('express');
var router = express.Router();
var cheerio=require('cheerio')
//var phantom = require('phantom');
var webdriver = require('selenium-webdriver')
    By = webdriver.By
    until = webdriver.until
var chrome = require('selenium-webdriver/chrome');//移动版浏览器
var fs= require("fs");
var path= require("path");

var options = new chrome.Options();
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--headless");


const os = require('os');
if (os.type() == 'Windows_NT') {
	//windows
    let driver =  new webdriver.Builder().forBrowser('chrome').build(); 
} else if (os.type() == 'Darwin') {
	//mac
} else if (os.type() == 'Linux') {
	//Linux
    var service = new chrome.ServiceBuilder('/www/server/nodejs/router/chromedriver/chromedriver').build();
    chrome.setDefaultService(service);    
    let driver = new webdriver.Builder()
    	.setChromeOptions(options)
    	.withCapabilities(webdriver.Capabilities.chrome())
    	.forBrowser('chrome')
    	.build();
} else{
	//不支持提示
}

var https=require('https')
var http=require('http')
const async = require('async');
const schedule = require('node-schedule');//定时任务
const Mail=require('../utils/mail')


/* GET users listing. */
router.post('/shiping', async function(req, res, next) {
	let {url} = req.body
	/* var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .setChromeOptions(new chrome.Options().setMobileEmulation({deviceName: 'iPhone X'}))//移动版浏览器
	    .build(); */
	await driver.get(url)
    var list = []
    setTimeout(async()=>{
        await driver.getPageSource()
         .then(async(souce)=> {
             let $ = await cheerio.load(souce)
             $('script').each((index,el)=>{
                 
                 if($('script')){
                 	let data = $('script').each((index,el)=>{//快手视频地址放script标签的（无水印）
                 	for (let i in el.children[0]) {
                 		let data = el.children[0].data
                 		let start = data.indexOf('"srcNoMark":"http')
                 		if(start>0){
                 			let str = data.slice(start,99999999999)
                 			let end = str.indexOf('.mp4')+4
                 			let str1 = str.slice(13,end)
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
                 
                 $('video').each((index,el)=>{//移动版抖音快手链接检测
                 	if($(el).attr('src')!==null && $(el).attr('src')!=='' && $(el).attr('src')!==undefined){
                 		let src=str_geturl($(el).attr('src'))
                 		list.push(src)
                 	}
                 })
                 
                 if(list.length>0){//返回数据
                 	//driver.quit() //完全关闭浏览器
                 	// driver.close()//关闭页面
                 	res.send({
                 		data:list
                 	})
                 }
                 
             })
         }).catch((err)=>{
			console.log(err)
			res.send({
				data:err
			})
		})
    },4000)

});


router.post('/shiping1', function(req, res, next) {//
	//let {url} = req.body
	(async function example() {
		let driver = await new webdriver.Builder().forBrowser('chrome').build();
		let {url} = req.body 
		let result = []
		await driver.get(url);
		setTimeout(()=>{
			driver.close()//关闭页面
		},60000)
		  //await driver.findElement(By.css('#changeCityBox .checkTips .tab.focus')).click();
		  //await driver.findElement(By.id('search_input')).sendKeys('前端', Key.ENTER);
		  //let items = await driver.findElements(By.className('ball_box01'))
		  let items = await driver.getPageSource()
		  let $ = await cheerio.load(items)
		  let list = await $('.player-video') //快手class取视频地址（无水印）
		  let list1 = await $('video') //通用video标签获取
		  
		  if(result.length===0){
			  console.log("2")
			  list.each((index,el)=>{ //快手class取视频地址（有水印）
				  result.push($(el).attr('src'))
			  })
		  }
		  if(result.length===0){
			  console.log("3")
		  	list1.each((index,el)=>{ //通用video标签获取
		  	result.push($(el).attr('src'))
		  	})	  
		  }
		  
		  if(res && result.length>0){
			  res.send({result})
		  }
		  driver.close()//关闭页面

	})();
});

var str_geturl=(str)=>{//检测字符串中的url
    console.log(str)
    let result = ''
    console.log(str.indexOf("https://aweme.snssdk"))
    if(str.indexOf("https://aweme.snssdk")>-1){
        result = str.replace('playwm', 'play');//去除playwm中的wm
    }else if(str.indexOf('https://')>-1){
        result = str
    }
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
	let {url,className} = req.body
	async function fn(){
		if(!className || !url){
			res.send({
				msg:'请输入css类名或填写url'
			})
		}
		let driver =  new webdriver.Builder().forBrowser('chrome').build(); //windows用这个
		await driver.get(url)
		driver.manage().window().setRect({ width: 1024, height: 8000 }); //设置窗口大小，可以实现截取长图
		console.log(className)
		driver.findElement(By.css(className)).then(()=>{
			driver.findElement(By.css(className)).takeScreenshot().then((base64Data)=>{
				console.log("截图成功！")
				//这里为截图结果的base64字符串
				var dataBuffer = new Buffer.from(base64Data, 'base64');
				var nowDate = new Date().getTime()
				fs.writeFile('./uploads/'+nowDate+'.png', dataBuffer, (err)=> {
				    if(err){
					  console.log(err)
				    }else{
					  res.send({
						  data:'uploads/'+nowDate+'.png'
					  })
				    }
				});
			})
		})
		}
		fn()
});
function scheduleCronstyle(scheduleArr){ //彩票邮件定时任务
	scheduleArr.forEach((item,index,arr)=>{
		schedule.scheduleJob(item,()=>{
			console.log(item)
			let nowTime = new Date().getTime()
			if(!sendEmails.phase || !sendEmails.redBall || !sendEmails.blueBall || (nowTime-sendEmails.data)>1000*60*60*24 ){
				example().then((sendEmaildata)=>{
					 if(sendEmaildata){
						 sendEmail(sendEmaildata)
					 }
				})
			}else{
				sendEmail(sendEmails)
			}
		})
	})
}
let scheduleDate = ['0 30 22 * * 5','0 30 22 * * 5','0 30 22 * * 7']
scheduleCronstyle(scheduleDate);

function sendEmail(sendEmaildata){ //找出要发送邮件的用户发送邮件
	selectData(sendEmaildata).then((res)=>{
		console.log(res)
		res.forEach((item,index,arr)=>{
			let mail = item.email
			if(item.phase===sendEmaildata.phase){
				let myForecast = []
				item.forecast.forEach((item1,index1,arr1)=>{
					if(item1.isSendEmail==='true' && Number(item1.phase)===Number(sendEmaildata.phase)){
						myForecast.push("<span>红球:" +item1.redBall+ '')
						myForecast.push("</span> 蓝球:" +item1.blueBall+ '<br/>')
					}
				})
				if(myForecast.length===0){ //没有订阅的，取消发送
					return
				}
				let html = "<h4>红球： "+sendEmaildata.redBall+"蓝球： "+sendEmaildata.blueBall+"</h4><br/> 我的预测：<br/>"+myForecast+" "
				Mail.sendLottery(mail,html).then((res)=>{
					console.log("邮件发送成功"+new Date())
					console.log(res)
				}).catch((err)=>{
					console.log("邮件发送失败"+new Date())
					console.log(err)
				})
			}
		})
	})
}
 function selectData(query){ //查询mongodb中的彩票数据
	console.log(query)
	return new Promise((resolve, reject) => {
	   Forecast.find({phase:query.phase}).then((data)=>{
	  	resolve(data)
	  }).catch((error)=>{
	  	reject(error)
	  })
	})
}

let sendEmails = { //用于保存当前期彩票数据
			   phase:null,
			   redBall:null,
			   blueBall:null,
			   data:null,
		  }
 function example(res) {//中国福利彩票数据
	return  new Promise(async (resolve, reject)=>{
		let driver = await  new webdriver.Builder().forBrowser('chrome').build();
		var url = "http://www.cwl.gov.cn/kjxx/ssq/kjgg/"
		let result = []
		await driver.get(url);
		  //await driver.findElement(By.css('#changeCityBox .checkTips .tab.focus')).click();
		  //await driver.findElement(By.id('search_input')).sendKeys('前端', Key.ENTER);
		  //let items = await driver.findElements(By.className('ball_box01'))
		  let items = await driver.getPageSource()
		  let $ = await cheerio.load(items)
		  let list = await $('.ball_box01 ul li')
		  if(!list){
			  reject()
		  }
		 await $('.bgzt table tbody tr').each((index,el)=>{
			  let data = {}
			 $(el).children().each((index1,el)=>{
					if(index===0){ //将当前期数据保存到内存
						if(Number(index1)===0){ //第0个tr，第几期
							 sendEmails.phase = Number($(el).html())
						}
						if(Number(index1)===2){ //第2个tr,红球数组
							let redList = []
							$(el).children().each((index,el)=>{
							  if($(el).html() || $(el).html() !== ""){
								  redList.push($(el).html())
							  }
							})
							sendEmails.redBall = redList
						}
						if(Number(index1)===3){ //第3个tr,蓝球
							let blueList = []
							$(el).children().each((index,el)=>{
							  if($(el).html() || $(el).html() !== ""){
								  blueList.push($(el).html())
							  }
							})
							sendEmails.blueBall = blueList
						}
						sendEmails.data=new Date().getTime()
					}
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
		  resolve(sendEmails)
		  driver.close()//关闭页面
		  result.forEach((item,index,arr)=>{ //循环取出保存到数据库
			  Lottery.find({phase:item.phase})//查询邮箱是否存在{userEmail}==={userEmail:userEmail}
			    .then((data)=>{
			  	  if(data.length===0){
			  		 var lottery = new Lottery();
			  		 var nowDate = new Date().getTime()
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
			  			  console.log("查找失败")
			   })
		  })
		})
	}

router.post('/caipiao', function(req, res, next) {//中国福利彩票数据
	example(res)
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

 function custom(req) {//自定义抓取
	return  new Promise(async (resolve, reject)=>{
		let driver = await  new webdriver.Builder().forBrowser('chrome').build();
		/* var service;        
		service = new chrome.ServiceBuilder('/www/wwwroot/api/router/chromedriver/chromedriver').build();            
		chrome.setDefaultService(service);    
		
		let driver = await new webdriver.Builder()
		    .setChromeOptions(options)
		    .withCapabilities(webdriver.Capabilities.chrome())
		    .forBrowser('chrome')
		    .build(); */
			
		let classs = req.body.class
		var url = req.body.url
		let attribute = req.body.attribute || 'src'
		let result = []
		await driver.get(url);
		setTimeout(async()=>{
			//await driver.findElement(By.css('#changeCityBox .checkTips .tab.focus')).click();
			 //await driver.findElement(By.id('search_input')).sendKeys('前端', Key.ENTER);
			 //let items = await driver.findElements(By.className('ball_box01'))
			 let items = await driver.getPageSource()
			 let $ = await cheerio.load(items)
			 //let list = await $('.block-icon-list .icon-twrap img')
			 let list = await $(classs)
			 if(!list){
					reject('没有找到节点')
			 }
			await list.each((index,el)=>{
						console.log($(el).attr(attribute))
						 let data = $(el).attr(attribute)
						 result.push(data)
			 })
			 resolve(result)
			 driver.close()//关闭页面
		},3000)
		})
	}
/**
 * @api {post} /analysis/custom 自定义解析
 * @apiName 自定义解析
 * @apiGroup 解析
 * @apiSuccess {url} url 页面地址.
 * @apiSuccess {attribute} attribute 查找哪个属性的值.
 * @apiSuccess {class} class 要查找的class如：（.block-icon-list .icon-twrap img）.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"s55g"
 *     }
 */
router.post('/custom', function(req, res, next) {//自定义扒取
	console.log(getClientIP(req))
	custom(req).then((respon)=>{
		console.log(respon)
		res.send({
			respon
		})
	}).catch((err)=>{
		console.log(err)
		res.send({
			err
		})
	})
});

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};

var ClientId = [
	{
		id:null,
		progress:0,//服务器上传视频到抖音进度
		length:null,
		status:null
	}
]
router.post('/selectStatus', function(req, res, next) { //查询抖音上传状态
	let result = req.body
	ClientId.forEach((item,index,arr)=>{
		if(result.id == item.id){
			res.send({
				code:200,
				item:item
			})
		}else if(index == ClientId.length-1){
			res.send({
				code:200,
				item:null
			})
		}
	})
})
/* 	var driver1 =  new webdriver.Builder().forBrowser('chrome').build();
	 driver1.get("http://localhost:3000/release");//打开配置页面 */
router.post('/release', async function(req, res, next) {
		let result = req.body
		console.log(result)
		let delayNext =  6000  //下一步等待
		let delaySelf =  6000  //调用自己等待
		let nextRound =  Number(result.time)*1000  //下一轮
		let index = 0  //视频下标
		let num = Number(result.num) //循环次数
		let nowNum = 0 //当前正在执行第几次
		let videos = []
		result.fileList.forEach((item)=>{
			//item.url = 'C:\\vue\\Hbuilder\\gw\\mogodbService\\'+item.url
			// item.url = 'C:\\wwwroot\\49.235.80.50\\mogodbService\\'+item.url
			item.url = '/www/wwwroot/api/'+item.url //Linux路径
			videos.push(item)
		})
		let url = 'https://creator.douyin.com/'
		let driver = await new webdriver.Builder().forBrowser('chrome').build();
		 driver.manage().window().maximize(); //最大化窗口
		 // driver1.manage().window().minimize(); //最小化窗口
		await driver.get(url);
		await driver.findElement(By.css('.login')).click() //点击登录按钮
		await driver.findElement(By.css('.semi-button-content')).click() //确认登录按钮
		function login() { //查找二维码
			driver.findElement(By.css('.qrcode-image img')).then(()=>{
				console.log("已找到登录二维码。")
				driver.findElement(By.css('.qrcode-image img')).takeScreenshot().then((data)=>{
					 console.log("截图成功")
				    res.send({
				    	qrcode:'data:image/jpg;base64,'+data
				    	})
				}).catch((err)=>{
					 console.log("截图失败")
					 console.log(err)
				})
				setTimeout(start, 1500);
				
			}).catch(()=>{
				console.log("正在查找登录二维码。")
				setTimeout(login, delaySelf);
			})
		}
		await login()
		var isClose = 0
		function start() { //开始体验
			driver.findElement(By.css('.semi-modal-body .semi-button-primary')).then(()=>{
				 driver.findElement(By.css('.semi-modal-body .semi-button-primary')).click().then(()=>{
				}).catch(()=>{
					setTimeout(start, delaySelf);
				})
				ClientId.push({
					id:result.id,
					isLogin:true,
					nowNum:0,
					isClose:false,
					progress:0,//服务器上传视频到抖音进度
					length:videos.length*num,
					status:'登录成功,正在准备发布视频'
				})
				 console.log("已找到开始体验。登录成功！")
				 setTimeout(start1, 1500);
			}).catch(()=>{
				console.log("正在查找开始体验。")
				isClose += 1
				if(isClose>30){
					driver.close()//关闭页面
				}
				setTimeout(start, delaySelf);
			})
		}
		function start1() { //下一步
			driver.findElement(By.css('.popoverFooter--10YW2 .semi-button-primary')).then(()=>{
				 driver.findElement(By.css('.popoverFooter--10YW2 .semi-button-primary')).click().then(()=>{
				}).catch(()=>{
					setTimeout(start1, delaySelf);
				})
				 console.log("已找到下一步。")
				 setTimeout(start2, 1500);
			}).catch(()=>{
				console.log("正在查找下一步。")
				setTimeout(start1, delaySelf);
			})
		}
		function start2() { //下一步1
			driver.findElement(By.css('.popoverFooter--10YW2 .semi-button-primary')).then(()=>{
				 driver.findElement(By.css('.popoverFooter--10YW2 .semi-button-primary')).click().then(()=>{
				}).catch(()=>{
					setTimeout(start2, delaySelf);
				})
				 console.log("已找到下一步(1)。")
				 setTimeout(goRelease, 1500);
			}).catch(()=>{
				console.log("正在查找下一步(1)。")
				setTimeout(start2, delaySelf);
			})
		}
		
		function goRelease() { //点击发布视频按钮
			driver.findElement(By.css('.semi-navigation-header .semi-button-primary')).then(()=>{
				 driver.findElement(By.css('.semi-navigation-header .semi-button-primary')).click().then(()=>{
				}).catch(()=>{
					setTimeout(goRelease, delaySelf);
				})
				 setTimeout(upload, delayNext);
			}).catch(()=>{
				console.log("正在查找发布视频按钮。")
				setTimeout(goRelease, delaySelf);
			})
		}
		var desc = ''
		function upload() { //找到上传按钮并上传文件
			driver.findElement(By.css('.upload-btn-input--1NeEX')).then(()=>{
				console.log("已找到上传按钮。")
				ClientId.forEach((item)=>{
					if(result.id == item.id){
						item.nowNum = nowNum+1
						item.status='准备上传第'+ (nowNum+1) +'个视频'
					}
				})
				driver.findElement(By.css('.upload-btn-input--1NeEX')).sendKeys(videos[index].url).then(()=>{
					setTimeout(input, delayNext);
					desc = videos[index].desc
					console.log(index)
					if(index < (videos.length-1)){
						index = index + 1
						console.log('index==='+index)
					}else{
						index = 0
					}
				}).catch(()=>{
					setTimeout(upload, delaySelf);
				})
				
			}).catch(()=>{
				console.log("正在查找上传按钮...")
				setTimeout(upload, delaySelf);
			})
		}
		
		let progress = 0 
		function input() { //输入视频描述
			ClientId.forEach((item)=>{
				if(driver.findElement(By.css('.progress-text--11wpp'))){
					driver.findElement(By.css('.progress-text--11wpp')).getText().then((res)=>{
						progress = res
						ClientId.forEach((item)=>{
							if(result.id == item.id){
								item.progress = res
							}
						})
					})
				}
				if(result.id == item.id){
					item.status='正在上传第'+ (nowNum+1) +'个视频,进度'+progress
				}
			})
			driver.findElement(By.css('.public-DraftEditor-content')).then(()=>{
				console.log("已找到输入框。")
				ClientId.forEach((item)=>{
					if(result.id == item.id){
						item.status='正在输入视频描述'
					}
				})
				driver.findElement(By.css('.public-DraftEditor-content')).sendKeys(desc).then(()=>{
					driver.findElement(By.css('.public-DraftEditor-content')).getText().then((res)=>{
						console.log("值为："+res)
					})
					setTimeout(()=>{
						setTimeout(release, delayNext);
					}, 3000);
				})
			}).catch(()=>{
				console.log("正在查找输入框...")
				setTimeout(input, delaySelf);
			})
		}
		
		function release() { //发布视频
			driver.findElement(By.css('.button--1SZwR')).then(()=>{
				console.log("已找到发布按钮")
				 driver.findElement(By.css('.button--1SZwR')).click().then(()=>{
					 nowNum = nowNum + 1
					 console.log("第"+nowNum+"次视频发布成功！")
					 if(num*videos.length-1 >= nowNum){
						ClientId.forEach((item)=>{
						 	if(result.id == item.id){
						 		item.nowNum=nowNum
						 		item.status="第"+ nowNum +"个发布视频成功！等待"+nextRound/1000+"秒"
						 	}
						 })
						 setTimeout(cancel, 2000);
						 setTimeout(goRelease, 20000);
					 }else{
						 ClientId.forEach((item)=>{
						 	if(result.id == item.id){
						 		item.nowNum=nowNum
						 		item.status="第"+ nowNum +"个发布视频成功！全部任务已完成！"
								item.over = true
								item.isClose = true
						 	}
						 })
						 console.log("任务完成")
						 setTimeout(cancel, 2000);
						 setTimeout(()=>{
						 		driver.close()//关闭页面
								ClientId.forEach((item)=>{
									if(result.id == item.id){
										item.over = false
										item.isClose = true
									}
								})
						 },20000)
					 }
				}).catch(()=>{
					setTimeout(release, delaySelf);
				})
			}).catch(()=>{
				console.log("正在查找发布按钮...")
				setTimeout(release, delaySelf);
			})
		}
		
		function cancel() { //不同步到西瓜视频
			driver.findElement(By.css('.semi-modal-footer .semi-button-tertiary')).then(()=>{
				 driver.findElement(By.css('.semi-modal-footer .semi-button-tertiary')).click().then(()=>{
				}).catch(()=>{
					setTimeout(cancel, delaySelf);
				})
				 setTimeout(cancel1, delayNext);
			}).catch(()=>{
				setTimeout(cancel, delaySelf);
			})
		}
		
		function cancel1() { //不同步到西瓜视频
			driver.findElement(By.css('.icon--3ap82')).then(()=>{
				 driver.findElement(By.css('.icon--3ap82')).click().then(()=>{
				}).catch(()=>{
					setTimeout(cancel, delaySelf);
				})
			}).catch(()=>{
				setTimeout(cancel1, delaySelf);
			})
		}
		
		//driver.close()//关闭页面
})



module.exports = router;
