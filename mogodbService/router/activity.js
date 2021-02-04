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

var driver
function qqLogin(qqNum,qqPwd){
	return new Promise(async(resolve, reject) => {
			driver =  new webdriver.Builder().forBrowser('chrome').build(); //windows用这个
			let url = 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&daid=383&style=33&theme=2&login_text=%E6%8E%88%E6%9D%83%E5%B9%B6%E7%99%BB%E5%BD%95&hide_title_bar=1&hide_border=1&target=self&s_url=https%3A%2F%2Fgraph.qq.com%2Foauth2.0%2Flogin_jump&pt_3rd_aid=101481973&pt_feedback_link=https%3A%2F%2Fsupport.qq.com%2Fproducts%2F77942%3FcustomInfo%3D.appid101481973'
			await driver.get(url);
			// resolve()
			// return
			await driver.findElement(By.id("switcher_plogin")).click()
			await driver.findElement(By.css('.inputstyle')).sendKeys(qqNum)
			await driver.findElement(By.css('.password')).sendKeys(qqPwd)
			await driver.findElement(By.id("login_button")).click()
			setTimeout(()=>{
				resolve()
			},1500)
		
	})
}
/**
 * @api {post} /activity/nizhan 活动自动领取
 * @apiName 活动自动领取
 * @apiGroup 解析
 * @apiSuccess {url} url 网页地址.
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "code":"s55g"
 *     }
 */
router.post('/nizhan',  function(req, res, next) {
	qqLogin(201747831,'Fen.13479917471H').then(()=>{
		active1()
		res.send({
			data:"登录成功"
		})
	}).catch(()=>{
		res.send({
			data:"登录失败"
		})
	})
});
function active1(){
	return new Promise(async(resolve, reject) => {
			let url = "https://nz.qq.com/"
			await driver.switchTo().newWindow('tab');
			await driver.switchTo().newWindow('window');
			
			await driver.get(url);
			await driver.executeScript('job(5)');
			setTimeout(async()=>{
				await driver.executeScript('var jfNum = 1000000000,selectItemId=1000000;');
				await driver.executeScript('job(1)');
				await driver.executeScript('job(2)');
				await driver.executeScript('job(3)');
				await driver.executeScript('job(4)');
				await driver.executeScript('job(5)');
				await driver.executeScript('lottAct1()');
				await driver.executeScript('lottAct2()');
				await driver.executeScript('lottAct3()');
				await driver.executeScript('qiyuan()');
				await driver.executeScript('lottAct3()');
				await driver.executeScript('lottAct3()');
				setTimeout(async()=>{
					let alert = await driver.switchTo().alert();
					let alertText = await alert.getText();
					await alert.accept();
				},7000)
				resolve()
			},6000)
			// driver.close();
	})
}
module.exports = router;