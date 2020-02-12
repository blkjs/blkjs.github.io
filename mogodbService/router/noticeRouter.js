const express =require('express')
const router =express.Router()


/**
 * @api {ws} ws://ip:3001 chat
 * @apiName 登录接口
 * @apiGroup chat
 * 
 * @apiSuccess {String} message 用户发送的消息.
 * 
 * @apiSuccessExample 成功的返回示例:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "脚底板",
 *       "times": "1782220023",
 *       "id":"13156131513",
 *       "name":"大奔"
 *     }
 * 
 *     实时在线人数返回示例
 *     HTTP/1.1 200 OK
 *     {
 *       "num": "8",
 *     }
 */
//chat
var events = require('events');
var eventEmitter = new events.EventEmitter();
const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 3001 });
 var arr = [];
 var data ='';
setInterval(()=>{
	//if(arr.length !== data){
		var list =[];
		arr.forEach(function each(client) {
			list.push(client.id);
		});
		arr.forEach(function each(client) {
			client.send(JSON.stringify({
					"num":arr.length,
					"list":list
			}));
		});
		
		 data = arr.length
	//}
	
},3000)
 function websocket_add_listener(client_sock,req) {
	
 	client_sock.on("message", function(data) {
 		if(arr.indexOf(client_sock) === -1){//未找到则返回 -1
			client_sock.id=JSON.parse(data).join
 			arr.push(client_sock);
 		}
		console.log(arr.length)
 		arr.forEach(function each(client) {
 		  if (client !== client_sock && client.readyState === WebSocket.OPEN) {
 			client.send(data);
 		  }
 		});
 	});
 	// close事件
 	client_sock.on("close", function() {
 		var n = arr.indexOf(client_sock);
 		arr.splice(n,1)//从索引n开始删除1个元素
 	});
 	 
 	// error事件
 	client_sock.on("error", function(err) {
 		console.log("client error", err);
 		var n = arr.indexOf(client_sock);
 		arr.splice(n,1)//从索引n开始删除1个元素
 	});
 }

// connection 事件, 有客户端接入进来;
function on_server_client_comming (client_sock,req) {
	console.log("连接");
	websocket_add_listener(client_sock,req);
}
wss.on("connection", on_server_client_comming);


module.exports=router