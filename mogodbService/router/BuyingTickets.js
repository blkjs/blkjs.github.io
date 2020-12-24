var express = require('express');
var router = express.Router();
var cheerio=require('cheerio')
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

let driver =  new webdriver.Builder().forBrowser('chrome').build(); //windows用这个
//Linux用这个  start
/* var service = new chrome.ServiceBuilder('/www/wwwroot/api/router/chromedriver/chromedriver').build();            
chrome.setDefaultService(service);    
let driver = new webdriver.Builder()
	.setChromeOptions(options)
	.withCapabilities(webdriver.Capabilities.chrome())
	.forBrowser('chrome')
	.build(); */
//end

const async = require('async');
const schedule = require('node-schedule');//定时任务
const Mail=require('../utils/mail')

async function FlyingPig(){
	let url = 'https://www.ctrip.com/'
	driver.manage().window().maximize(); //最大化窗口
	await driver.get(url);
	let search = {
		fromAdd: '济南',
		fromData: '2021-02-11',
		toAdd: '赣州',
		toData:'2021-02-11',
	}
	await driver.findElement(By.css('.searchbox .s_tab .s_tab_nocurrent')).click() //点击
	await driver.findElement(By.css('from .inputSel .s_item_cont_ex .inputSel')).sendKeys(search.fromAdd).then(()=>{})
	await driver.findElement(By.css('.s_item_cont_ex s_item2 input')).sendKeys(search.fromAdd).then(()=>{})
	await driver.findElement(By.css('.s_item_cont_1 .s_item input')).sendKeys(search.toAdd).then(()=>{})
	await driver.findElement(By.css('.s_item_cont_ex .s_disable input')).sendKeys(search.toData).then(()=>{})
	
	/* await driver.findElement(By.id('FD_StartDate')).sendKeys(search.fromAdd).then(()=>{})
	await driver.findElement(By.id('FD_StartDate')).sendKeys(search.fromData).then(()=>{})
	//设置目的地址
	await driver.findElement(By.id('FD_DestCity')).sendKeys(search.toAdd).then(()=>{})
	await driver.findElement(By.id('FD_ReturnDate')).sendKeys(search.toData).then(()=>{}) */
}
FlyingPig()


/**
 * @api {GET} /download 文件下载
 * @apiName 文件下载
 * @apiGroup 文件下载
 * @apiSuccess {string} url 文件地址.
 */
router.get('/', (req, res) => {
	
})

module.exports=router