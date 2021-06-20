import { Message } from 'element-ui';
const interfaceAPI='http://45.248.71.217:3000';//后台接口api
let Public={

post(){

console.log('post')

},
checkLogin(vue){
				//使用方法：
				//一定要写	var vue = this;
									var params = new URLSearchParams();
									params.append('username', vue.email);
								  vue.$http.post(interfaceAPI +'/iflogin', params)
				           .then((value)=> {
				               //console.log(value);
												if(value.data.status==1){

												}else{
													localStorage.clear('username','email','InvitationCode','headerImg','user_status');
												}
				           })
				           .catch((reason)=> {
				               console.log(reason);
													//vue.$message({ message: '请求失败',  type: 'error'});

				           });

},

}

export default
{
interfaceAPI,//用户地址
Public,//用户token身份

}
