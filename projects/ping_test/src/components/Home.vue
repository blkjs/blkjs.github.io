<template style="height: 100%;">
  <div style="height: 100%;">

<el-container width="100%" height="auto">
  <div class="left">
    <div style="width: 100%;height: 1rem;margin: 0;padding: 0;"><el-button type="text">首页</el-button></div>
    <div style="width: 100%;height: 1rem;margin: 0;padding: 0;"> <el-button type="text" @click="admin">admin</el-button></div>
    <div style="width: 100%;height: 1rem;margin: 0;padding: 0;"><el-button type="text" @click="help">帮助文档</el-button></div>
  </div>

  <el-container>
    <div class="top">
      HOST域名解析系统
      <div style="position: absolute;right: 4%; cursor:pointer;">
        <span v-if="!username" @click="login" style="margin-right: 0.625rem;">登陆</span>
        <span v-if="!username">注册</span>
        <span v-if="username">{{username}}</span>
        <span v-if="username" @click="loginout">退出登录</span>
      </div>
    </div>

    <div class="right"><div class="inner">
                      <span>ip:</span>
                 	    <el-input	type="textarea"	 style="width: 40%;margin-top: 0.8rem;"	:rows="5"	placeholder="请输入ip,多ip以英文逗号隔开如:192.168.1.1,10.10.10.10"	v-model="IPs" ></el-input>
                 			<span style="width:2.5rem;">域名:</span>
                      <el-input	type="textarea"	 style="width: 40%;margin-top: 0.8rem;"	:rows="5"	placeholder="请输入域名如:baidu.com,只能填写一个域名"	v-model="domain_name" ></el-input>
                 			<br>
                 			<el-button plain @click="CMDping(',')" style="width:2.5rem;margin-top: 1rem;">输入逗号(英文)</el-button>
                 		  <span style="width:2.5rem;">ip:</span>
                      <el-select v-model="value4"  placeholder="请选择ip" @change="change" style="width:2.5rem;"> <el-option   v-for="item in options"   :key="item.value"  :label="item.label"   :value="item.value"> </el-option> </el-select>
                      <span style="width:2.5rem;">发包个数：</span>
                      <el-input placeholder="数据包个数"  v-model="data_packet" style="width: 2.5rem;" clearable></el-input>
                 			<el-button plain @click="file('ping')" style="width:2.5rem;">网页ping测</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="file('backhost')" >备份host文件</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="file('open')" >打开host所在目录</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="file('host')" >更新至本地host文件</el-button>
                      <br><span style="width:2.5rem;">CMD参数：</span>
                      <el-input placeholder="如:-t -d -h等"  v-model="CMDing_parameter" style="width:2.5rem;" clearable></el-input>
                      <span style="width:2.5rem;margin-top: 0.8rem;">自动关闭窗口：</span>
                      <el-radio style="width:1.25rem;margin-top: 0.8rem;" v-model="radio" label="/k">否</el-radio>
                      <el-radio style="width:1.25rem;margin-top: 0.8rem;" v-model="radio" label="/c">是</el-radio>
                 			<el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="CMDping('ping')">CMD命令ping测</el-button>
                 			<el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="CMDping('tracert')">CMD路由追踪</el-button>
                      <el-input  style="width:2.5rem;margin-top: 0.8rem;" placeholder="输入端口号" v-model="testPort" clearable></el-input>
                      <br><el-input  style="width:2.5rem;margin-top: 0.8rem;" placeholder="输入端口号" v-model="portNumber" clearable></el-input>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="port('modify')" >修改远程端口</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="clientInfo" >本机信息</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="runcalc" >打开计算器</el-button>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="port('look')" >本机远程端口</el-button><br>
                      <el-button style="width:2.5rem;margin-top: 0.8rem;" plain @click="port('mstsc')" >打开远程工具</el-button><br>

                 			<div>
                 				<el-card v-for="(i,index) in IPlength" class="box-card" style="float: left;" :key="index">
                 					<div v-for="item in ping_requry" style="height: 0.25rem;margin-bottom: 0.75;" v-if="item.i==(i-1)">
                 						{{item.req}}
                 					</div>
                 					<div style="width: 3.75rem;height: 0.5rem;"></div>
                 				</el-card>
                 			</div>
                 			<el-button round icon="el-icon-upload2" v-if="btnFlag" class="go-top" @click="backTop">回到顶部</el-button>


            </div>
    </div>
    <el-main :style="mounted">
				</el-main>
  </el-container>
</el-container>


 </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      btnFlag:'',//回到顶部
			IPs:'',
			data_packet:'',
			IPlength:'',
			domain_name:'',
			ping_requry:[],
			start:'',
			finish:'',
			 options: [{
          value: '选项1',
          label: '华东'
        }, {
          value: '选项2',
          label: '华北'
        }, {
          value: '选项3',
          label: '华中'
        }, {
          value: '选项4',
          label: '华南'
        }, {
          value: '选项5',
          label: '香港/国际'
        }],
        value4: '',
		label: '',
		CMDing_parameter:'',
		mounted:{'width':'100%','height':'100%','margin':'0','padding':'0'},
    username:localStorage.getItem("username"),
     radio: '/k',//是否自动关闭cmd命令窗口，取值为k不自动关闭，取值为c自动关闭cmd命令窗口
     portNumber:'',//远程端口号

    }
  },methods:{
    port(data){
      this.checkActiveX();//检查是否开启kActiveX
      let _this = this;
    if(data=='look'){//查看本机远程端口号
      var myreadreg=new ActiveXObject("WScript.shell");

      	var port = toString(myreadreg.RegRead("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\Wds\\rdpwd\\Tds\\tcp\\PortNumber"));
       console.log(port)
      /* try{

      }catch(e){
        console.log(e)
      	alert("读取的值不存在！");
      } */
    }else if(data=='modify'){//修改远程端口
      if(_this.portNumber==''){
        alert("端口号不能为空！");
        return false;
      }else if(!typeof(_this.portNumber)===Number){
        console.log(typeof(_this.portNumber))
        alert("数据类型错误！");
        return false;
      }
      var mywritereg = new ActiveXObject("WScript.shell");
        /* try {//这种操作方法直接操作注册列表
          mywritereg.RegWrite("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\Wds\\rdpwd\\Tds\\tcp\\PortNumber",this.portNumber);//REG_QWORD
          mywritereg.RegWrite("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp\\Tds\\tcp\\PortNumber",this.portNumber);
          alert("写入成功！");
        } catch (e) {
          console.log(e)
          alert("写入路径不正确！");
        } */

        //CMD命令行操作操作注册列表
      var reg = ' reg ADD "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\Wds\\rdpwd\\Tds\\tcp" /v "PortNumber" /d ' +_this.portNumber+ ' /t REG_QWORD /f'//注意反斜杠是转义字符，所以要两个
      var reg1 = ' reg ADD "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp" /v "PortNumber" /d ' +_this.portNumber+ ' /t REG_QWORD /f'//注意反斜杠是转义字符，所以要两个
      console.log(reg)
      var cmd='cmd '+_this.radio+reg;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
      var cmd1='cmd '+_this.radio+reg1;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
        //使用 && 连接符 拼接多条命令  REG ADD HKLM\Software\MyCo                                                              /v Data /t REG_BINARY /d fe340ead
        //参数 0 为窗口在后台执行，不会弹出
        var c =mywritereg.Run(cmd+'&'+cmd1);//执行多条cmd命令
        if(c===0){
          alert("操作完成！请自行验证是否成功");
        }else{
          alert("操作失败！");
        }

    }else if(data=='mstsc'){
      var s=new ActiveXObject("WScript.Shell");
      var cmd="mstsc";///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
      //使用 && 连接符 拼接多条命令
      //参数 0 为窗口在后台执行，不会弹出
      s.Run(cmd);
    }

    },
     clientInfo(){//查看客户端信息
     this.checkActiveX();//检查是否开启kActiveX
        var WshNetwork = new ActiveXObject("WScript.Network");
        var strClientInfo=
      " <div style='text-align: -moz-center;text-align: center;'>"+"<br>"+
      "Domain = " + WshNetwork.UserDomain+"<br>"+
      "User Name = " + WshNetwork.UserName+"<br>"+
      "Computer Name = " + WshNetwork.ComputerName+"<br>"+
      "availHeight=      "+window.screen.availHeight+"<br>"+
      "availWidth=      "+window.screen.availWidth+"<br>"+
      "bufferDepth=      "+window.screen.bufferDepth+"<br>"+
      "colorDepth=      "+window.screen.colorDepth+"<br>"+
      "colorEnable=      "+window.navigator.cookieEnabled+"<br>"+
      "cpuClass=      "+window.navigator.cpuClass+"<br>"+
      "height=      "+window.screen.height+"<br>"+
      "javaEnable=      "+window.navigator.javaEnabled()+"<br>"+
      "platform=      "+window.navigator.platform+"<br>"+
      "systemLanguage=      "+window.navigator.systemLanguage+"<br>"+
      "userLanguage=      "+window.navigator.userLanguage+"<br>"+
      "width=      "+window.screen.width;+
      "</span>"

       this.$alert(strClientInfo, '客户端信息', {
              dangerouslyUseHTMLString: true
            });
    },
    runcalc(){   //打开计算器
    this.checkActiveX();//检查是否开启kActiveX
      var calc=new ActiveXObject("WScript.shell");
      calc.Run("calc");
    } ,
    login(){
      this.$router.push({
        name:'login'
      })
    },
    loginout(){//注销登陆
      var params = new URLSearchParams();
      					params.append('username', this.username);
      					params.append('email', this.email);
      					params.append('name', 'loginout');
      					console.log(this.email,this.username)
      				  this.$http.post(this.Public.interfaceAPI +'/login', params)
                 .then((value)=> {
                     		console.log(value);
      						if(value.data.status=='1'){

                     this.$message({ message: "注销成功！",  type: 'error'});

      							this.$router.push({
      								name: 'login'
      							})
      						}else{
                    this.$message({ message: "注销失败，请重试！",  type: 'error'});

      						}

                 })
                 .catch((reason)=> {

                 this.$message({ message: "注销失败，请重试！",  type: 'error'});
                 });
    },
    admin(){
      this.$router.push({
      	name: 'admin'
      })
    },
    getip(){
      	var params = new URLSearchParams();
      	params.append('position', this.label);
       this.$http.post(this.Public.interfaceAPI+'/getip/getip',params)
            .then(resp => {
              if(resp.data.status==1){
                for (var i=0;i<resp.data.results.length;i++)
                  {
                      this.IPs=this.IPs+resp.data.results[i].ip+',';

                  }
              }else if(resp.data.status==0){
                 this.$message({ message: "选择失败"+resp.data.message,  type: 'error'});
                 return false
              }

               // console.log(resp.data)
            }).catch(err => {
                console.log(err);
                 this.$message({ message: err,  type: 'error'});
                   return false
            })
    },

	  help(){
		  this.$router.push({
		  	name: 'Help'
		  })
	  },
	  CMDping(name){
      this.checkActiveX();//检查是否开启kActiveX
		  if(name==","){
		  	this.IPs = this.IPs +',';
			return;
		  }
	  		   var IPs = this.IPs.replace(/[\r\n]/g,"");//ip去回车
	  		   this.IPs =IPs.replace(/\ +/g,"");//ip去空格
	  		   var IP = this.IPs.split(',');
	  		   if(this.IPs==''||this.IPs==' '){
	  		   	 this.$message({ message: '请选择ip或输入ip！',  type: 'error'});
	  		   	return false;
	  		   }

	  		   for(var i=0;i<IP.length;i++){
	  		   	if(IP[i]==','){

	  		   	}else if(IP[i]==''){
	  		   		return false;
	  		   	}else if(name=='ping'){

	  		   		var s=new ActiveXObject("WScript.Shell");
	  		   		var cmd="cmd "+this.radio+" ping " +IP[i]+ " "+this.CMDing_parameter;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
	  		   		//使用 && 连接符 拼接多条命令
	  		   		//参数 0 为窗口在后台执行，不会弹出
	  		   		var c =s.Run(cmd);

	  		   	}else if(name=='tracert'){
                var s=new ActiveXObject("WScript.Shell");
                var cmd="cmd "+this.radio+" tracert "+this.CMDing_parameter+" "+IP[i];///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
                //使用 && 连接符 拼接多条命令
                //参数 0 为窗口在后台执行，不会弹出
                s.Run(cmd);
            }

	  		   }
	  },
	  change(){
		  if(this.value4=="选项1"){
			  this.label="华东";
		  }else if(this.value4=="选项2"){
			  this.label="华北";
		  }else if(this.value4=="选项3"){
			  this.label="华中";
		  }else if(this.value4=="选项4"){
			  this.label="华南";
		  }else if(this.value4=="选项5"){
			  this.label="香港/国际";
		  }
      this.getip();
		  //this.$message({ message: this.label,  type: 'success'});
	  },
		 writeFile(filename,filecontent){
       this.checkActiveX();//检查是否开启kActiveX
            var fso, f;
            fso = new ActiveXObject("Scripting.FileSystemObject");
            f = fso.OpenTextFile(filename, 8, true);
            f.WriteLine(filecontent);
            f.Close();
        },
				file(name){
          this.checkActiveX();//检查是否开启kActiveX
				var IPs = this.IPs.replace(/[\r\n]/g,"");//ip去回车
				this.IPs =IPs.replace(/\ +/g,"");//ip去空格
				var IP = this.IPs.split(',');
        //document.domain = '127.0.0'
				var filename='C:\\Windows\\System32\\drivers\\etc\\hosts';
				if(name=='host'){
						for(var i=0;i<IP.length;i++){
						console.log(IP[i])
						if(IP[i]==','){

						}else if(IP[i]=='' || this.domain_name==''){

               this.$message({ message: '请重新填写ip和域名！',  type: 'error'});
							return false;
						}else{
							var filecontent = '\r\n' +IP[i] + '	' + this.domain_name;
							this.writeFile(filename,filecontent);
						}

					}
					this.$message({ message: '写入完成'	,  type: 'success'});
					this.domain_name=this.domain_name;//重新赋值一遍
					this.IPs=this.IPs;
				}else if(name=='ping'){
					if(this.IPs==''||this.IPs==' '){
						 this.$message({ message: '请选择ip或输入ip！',  type: 'error'});
						return false;
					}
					this.IPlength=IP.length;
					for(var i=0;i<IP.length;i++){
						console.log(IP[i])
						if(IP[i]==','){

						}else if(IP[i]==''){
							return false;
						}else{
							this.ping_requry=[];
							this.ping(IP[i],i);
						}

					}

				}else if(name=="backhost"){
          var myDate = new Date()
          var year= myDate.getFullYear();//获取当前年份
          var month =myDate.getMonth()+1;//获取当前月份0-11，0代表1月
           var date =myDate.getDate();//获取当前日期1-31
          var hours = myDate.getHours(); // 小时
          var minutes = myDate.getMinutes(); // 分
          var s = myDate.getSeconds();//秒
           console.log(year,month,date,hours,minutes,s)


              this.$confirm('请选择备份方式', '提示', {
                  confirmButtonText: 'CMD命令',
                  cancelButtonText: 'fso方式',
                  type: 'warning',
                  center: true
                }).then(() => {
                      var host = "C:\\Windows\\System32\\drivers\\etc\\hosts"
                      var cmd='cmd '+_this.radio+' copy '+host+' '+host+year+month+date+hours+minutes+s+".txt";///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
                      var mywritereg = new ActiveXObject("WScript.shell");
                      var c =mywritereg.Run(cmd,0);//执行多条cmd命令用&连接//参数 0 为窗口在后台执行，不会弹出
                      return false;
                }).catch(() => {
                  try{
                      var fso, f2;
                      fso = new ActiveXObject("Scripting.FileSystemObject");
                      f2 = fso.GetFile("C:\\Windows\\System32\\drivers\\etc\\hosts");
                      f2.Copy("C:\\Windows\\System32\\drivers\\etc\\hosts"+year+month+date+hours+minutes+s+".txt");
                  }catch(e){
                  	alert(e.message);
                    var host = "C:\\Windows\\System32\\drivers\\etc"
                    var cmd='cmd /c explorer '+host;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
                    var mywritereg = new ActiveXObject("WScript.shell");
                    var c =mywritereg.Run(cmd,0);//执行多条cmd命令用&连接//参数 0 为窗口在后台执行，不会弹出
                  	return false;
                  }
                   this.$message({ message: 'host备份完成',  type: 'success'});
                    return false;
                });



        }else if(name=="open"){
          try{

                var host = "C:\\Windows\\System32\\drivers\\etc"
                //copy host host+year+month+date+hours+minutes+s+".txt"
                var cmd='cmd /c explorer '+host;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
                // var cmd1='cmd '+_this.radio+reg1;///c 新建一个命令运行完成后自动关闭窗口 /k  新建一个不自动关闭的窗口
                //使用 && 连接符 拼接多条命令  REG ADD HKLM\Software\MyCo                                                              /v Data /t REG_BINARY /d fe340ead

                var mywritereg = new ActiveXObject("WScript.shell");
                var c =mywritereg.Run(cmd,0);//执行多条cmd命令用&连接//参数 0 为窗口在后台执行，不会弹出
                return false;
          }catch(e){
            this.$message({ message: e.message,  type: 'error'});
          }
        }

				},
		//替换
			//var f1 = fso.createtextfile("C:\\Users\\Administrator\\Desktop\\hosts",true);
			//var f1 = fso.createtextfile("C:\\Windows\\System32\\drivers\\etc\\hosts.txt",true);
			//f1.write(b[i] + "	www.baidu.com"+"\r\n");  */
			//读取
		//var openf1 = fso.OpenTextFile("C:\\Users\\Administrator\\Desktop\\hosts");
		//var str = openf1.ReadLine();
		//console.log("里面的内容为'" + str + "'");
		//console.log(openf1)
    // 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18



		ping(ip,i) {
			var i = i;
			var ip =ip;
			var clear = setInterval(()=>{
				clearTimeout(timer);
			},this.data_packet ? (this.data_packet+1)*100:6000)//6秒发送5次数据包
			var timer = setInterval(()=>{
				    var img = new Image();
				var flag = false;
				var isCloseWifi = true;
				var hasFinish = false;

		    img.onload = function() {
		        if ( !hasFinish ) {
		            flag = true;
		            hasFinish = true;
		            img.src = 'X:\\';
		            console.log('Ping ' + ip + ' success. ');
		        }
		    };

		    img.onerror = ()=> {
		        if ( !hasFinish ) {
		            if ( !isCloseWifi ) {
									this.finish = new Date().getTime();
		                flag = true;
		                img.src = 'X:\\';
										var time =(this.finish-this.start);
										//this.ping_requry.push({req:'Reply from ' + ip + ' success. time='+time+'ms',i:i});
										console.log(this.ping_requry)
										//this.ping_requry[0].push({i:i});
										this.ping_requry.push({req:'Reply from ' + ip + ' success. time='+time+'ms',i:i,ip:ip});
										console.log(this.ping_requry)
		            } else {
		                console.log('network is not working!');
										this.ping_requry.push({req:'传输过期',i:i,ip:ip});
		            }
		            hasFinish = true;
		        }
		    };

		    setTimeout(()=>{
		        isCloseWifi = false;
		        console.log('network is working, start ping...');
		    },2);
				this.start = new Date().getTime();
		    img.src = 'http://' + ip + '/' +this.start;
		    var timer = setTimeout(()=> {
		        if ( !flag ) {
		            hasFinish = true;
		            img.src = 'X://';
		            flag = false ;
		            console.log('Ping ' + ip + ' fail. ');
								this.ping_requry.push({req:'请求超时',i:i,ip:ip});
		        }
		    }, 1500);
				},1000)
		},getwidth(){
			console.log()
			this.$set(this.mounted,'width',(window.screen.width)-(window.screen.width)/100*15+'rem');//获取浏览器宽
		}, backTop () {
      const that = this
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
  },

  // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
  scrollToTop () {
    const that = this
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    that.scrollTop = scrollTop
    if (that.scrollTop > 60) {
      that.btnFlag = true
    } else {
      that.btnFlag = false
    }
  },checkActiveX(){//检查是否开启kActiveX
     try{
        var mywritereg = new ActiveXObject("WScript.shell");
      }catch(e){
         this.$confirm('您的浏览器未开启ActiveX控件，请使用ie浏览器访问并开启ActiveX控件,否则多数功能将无法使用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '查看帮助文档',
          type: 'warning',
          center: true
        }).then(() => {

        }).catch(() => {
          this.$router.push({
            name:'Help'
          })
        });

    }
    return false;
  },
	addTrust(){
      var WshShell=new ActiveXObject("WScript.Shell");

          //添加信任站点ip

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\","");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\http","2","REG_DWORD");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\:Range","www.blkjs.com");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\","");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\http","2","REG_DWORD");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\:Range","45.248.71.217");

          //修改IE ActiveX安全设置
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1001","0","REG_DWORD");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1004","0","REG_DWORD");

          //运行ActiveX控件和插件
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1200","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1200","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1200","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1200","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1200","0","REG_DWORD");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1201","0","REG_DWORD");

          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1405","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1405","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1405","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1405","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1405","0","REG_DWORD");
          //IE 将“通过域访问数据源”设置为启用(注册表)----解决IE浏览器Script5拒绝访问
          //start*********
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1406","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1406","0","REG_DWORD");//xp系统下
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1406","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1406","0","REG_DWORD");//xp系统下
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1406","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1406","0","REG_DWORD");//xp系统下
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1406","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1406","0","REG_DWORD");//xp系统下
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1406","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1406","0","REG_DWORD");//xp系统下
          //end************

          //文件下载 启用
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1803","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1803","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1803","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1803","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\1803","0","REG_DWORD");

          //ActiveX安全提示弹出阻止 禁用
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\2201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\2201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\2201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\2201","0","REG_DWORD");
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\4\\2201","0","REG_DWORD");
          //禁用xinxp弹出窗口阻止程序
          WshShell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows\\PopupMgr","no");


    }

	},mounted() {
		this.addTrust();//添加进信任站点，设置ActiveX安全项
    this.checkActiveX();//检查是否开启kActiveX
		this.getwidth();
     window.addEventListener('scroll', this.scrollToTop);
	},destroyed () {
  window.removeEventListener('scroll', this.scrollToTop)
},beforeCreate() {
  var _this = this;
  this.Public.Public.checkLogin(_this);
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,body,.parent{height:100%;overflow:hidden;}

  .parent{position:relative;}

  .top{position:absolute;top:0;left:0;right:0;height:70px;background-color: #C0C4CC}

  .left{position:absolute;left:0;top:70px;bottom:0;width:20%;background-color:#DCDFE6}

  .right{position:absolute;left:20%;right:0;top:70px;bottom:0;overflow:auto;background-color: #EBEEF5}



  .right .inner{min-height:1000px;}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

//布局样式开始
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
	/* 布局样式结束 */
	/* ping_requry样式开始 */
	.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 0px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 480px;
	height: auto;
	padding: 0;
	margin: 0;
  margin-left: 2%;
  margin-top: 2%;
  }
		/* ping_requry */

 .go-top{
position:fixed; *position:absolute;  bottom:20%; right:5%; margin:-50px 0 0 -50px;
opacity:0.7;/* 透明度 */
 }
</style>
