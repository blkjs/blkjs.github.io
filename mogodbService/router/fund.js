var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/fund', async function(req, res, next) {
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

router.post('/getAllFundName', async function(req, res, next) {
	const url = 'http://fund.eastmoney.com/js/fundcode_search.js'
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var data = body.split("var r =")[1].split(";")[0].replace(/\s*/g,"");//截取指定字符串之后的字符
		res.send({data:JSON.parse(data)})
	  }
	});
})

module.exports = router;