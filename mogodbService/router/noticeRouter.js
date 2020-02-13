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
	if(arr.length !== data){
		var list =[];
		arr.forEach(function each(client) {
			list.push(client.id);
		});
		arr.forEach(function each(client) {
			client.send(JSON.stringify({
					"num":arr.length,//在线人数
					"list":list,//在线人员id
			}));
		});
		
		 data = arr.length
	}
	
},2000)
 function websocket_add_listener(client_sock,req) {
	
 	client_sock.on("message", function(data) {
 		if(arr.indexOf(client_sock) === -1){//未找到则返回 -1
			client_sock.id=JSON.parse(data).join;
 			arr.push(client_sock);
 		}
		console.log('当前在线人数:'+arr.length)
 		arr.forEach(function each(client) {
			if(JSON.parse(data).modify_name){
				var n = arr.indexOf(client_sock);
				arr[n].id=JSON.parse(data).modify_name
				client.send(data);//发送修改昵称消息给所有人
				var list =[];
				arr.forEach(function each(client) {
					list.push(client.id);
				});
				client.send(JSON.stringify({//更新在线人员列表
						"num":arr.length,//在线人数
						"list":list,//在线人员id
				}));
			}else if(client !== client_sock && client.readyState === WebSocket.OPEN) {//转发除自己外的所有消息
				client.send(data);
 		  }
 		});
 	});
 	// close事件
 	client_sock.on("close", function() {
		//console.log(client_sock.id)
 		var n = arr.indexOf(client_sock);
		arr.forEach(function each(client) {
			if(client !== client_sock && client.readyState === WebSocket.OPEN) {//发送退出者id消息,除退出者自己以外的所有人
			client.send(JSON.stringify({
						close:client_sock.id,
			}));
		  }
		});
 		var t = arr.splice(n,1)//从索引n开始删除1个元素
		//console.log(t[0].id)
 	});
 	 
 	// error事件
 	client_sock.on("error", function(err) {
 		console.log("client error", err);
 	});
 }

// connection 事件, 有客户端接入进来;
function on_server_client_comming (client_sock,req) {
	console.log("连接");
	websocket_add_listener(client_sock,req);
}
wss.on("connection", on_server_client_comming);


module.exports=router