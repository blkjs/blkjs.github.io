var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/fund', async function(req, res, next) {//查询详情
	const {code} = req.body
	const Time = new Date()
	const nowTime = Time.getFullYear() + '' + Time.getMonth() + '' + Time.getDate() + '' + (Time.getHours() +1) + '' + Time.getMinutes() + '' + Time.getSeconds()
	
	const url = 'http://fund.eastmoney.com/pingzhongdata/' +code+ '.js?v='+nowTime
	console.log(url)
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var data = body.split("var Data_netWorthTrend =")[1].split(";/*累计净值走势*/")[0].replace(/\s*/g,"");//估算涨幅
		var Data_ACWorthTrend = body.split("var Data_ACWorthTrend =")[1].split(";/*累计收益率走势*/")[0]//净值走势
		var Data_assetAllocation = body.split("var Data_assetAllocation =")[1].split(";/*业绩评价")[0].replace(/\s*/g,""); //资产配置
		res.send({
			data:JSON.parse(data),
			Data_ACWorthTrend:JSON.parse(Data_ACWorthTrend),
			Data_assetAllocation:JSON.parse(Data_assetAllocation),
		})
	  }
	});
})

var AllFundName = ''
router.post('/getAllFundName', async function(req, res, next) { //获取全部基金名称
	const url = 'http://fund.eastmoney.com/js/fundcode_search.js'
	if(AllFundName){
		if( (new Date().getTime() - AllFundName.time) < 24 * 60 * 60 * 1000 ){ //一天内只请求一次，其他都用缓存
			res.send({data:AllFundName.data})
			return
		}
	}
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var data = body.split("var r =")[1].split(";")[0].replace(/\s*/g,"");//截取指定字符串之后的字符
		res.send({data:JSON.parse(data)})
		AllFundName = {
			data:JSON.parse(data),
			time:new Date().getTime()
		}
	  }
	});
})

router.post('/getRealTime', async function(req, res, next) { //获取实时基金净值
	const {code} = req.body
	const url = 'http://fundgz.1234567.com.cn/js/'+code+'.js'
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var data = body.split("jsonpgz(")[1].split(");")[0].replace(/\s*/g,"");//截取指定字符串之后的字符
		res.send({data:JSON.parse(data)})
	  }
	});
})

module.exports = router;