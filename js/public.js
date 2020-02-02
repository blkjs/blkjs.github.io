var topurl = "http://49.235.80.50:3000/"

!function(n){
			　　　　var e=n.document,
			　　　　t=e.documentElement,
			　　　　i=900,
			　　　　d=i/100,
			　　　　o="orientationchange"in n?"orientationchange":"resize",
			　　　　a=function(){
			　　　　　　var n=t.clientWidth||320;n>720&&(n=720);
			　　　　　　t.style.fontSize=n/d+"px"
			　　　　};
			　　　　e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
			　　}(window);

var app = (data) => {
	if(data==1){
		window.open("../app/app.html", '_self')
	}else if(data==2){
		window.open("../service/service.html", '_self')
	}else if(data==3){
		window.open("../case/case.html", '_self')
	}else if(data==4){
		window.open("../about/about.html", '_self')
	}else if(data==5){
		window.open("../help/help.html", '_self')
	}
	
}
var login = () => {
	if (!localStorage.getItem("login_msg")) { //跳转登录页面
		window.open("../login/login.html", '_self')
	} else { //已登录

	}

}
var register = () => {
	if (localStorage.getItem("login_msg")) { //退出登录
		localStorage.removeItem("login_msg");
		location.reload()
	} else { //跳转注册页面
		window.open("../register/register.html", '_self')
	}
}

var open_qq = () => {
	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (
			/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE|Nubia/
			.test(navigator.userAgent))) {
		window.location.href = "mqqwpa://im/chat?chat_type=wpa&uin=201747831&version=1&src_type=web&web_src=oicqzone.com"; //判断是否是移动端

	} else {
		document.location.href = "tencent://Message/?websiteName=qzone.qq.com&Menu=yes&Uin=201747831"
	}
}
var leavemsg = () => {
	window.open("../leavemsg/leavemsg.html", '_self')
}

var to_top = () => { //回到顶部
	$('html ,body').animate({
		scrollTop: -10
	}, 400);
}
window.onload = function() {
	if($(".app-title")[0]){
		$(".app-title")[0].style.backgroundColor="yellow"
		$(".app-title")[0].style.color="black"
		$(".app-title")[0].style.fontSize="0.231rem"
		$(".app-title")[0].style.fontWeight="600"
	}
	
	$('#service').mouseover(function() {
		//console.log($('#WeChat')[0].style)
		$('#WeChat')[0].style.display = "block"
	}).mouseout(function() {
		$('#WeChat')[0].style.display = "none"
	})

	if (localStorage.getItem("login_msg")) {
		$.ajax({
			url: topurl + "iflogin",
			type: 'POST',
			async: true,
			xhrFields: {
				withCredentials: true
			},
			data: {},
			success: (data) => {
				var login_msg=JSON.parse(localStorage.getItem("login_msg"));
				var logo ="../../img/logo.png";
				var header_img=login_msg.headerImg ? login_msg.headerImg:logo;
				
				if (data.status == 1) {
					document.getElementById("login").innerHTML = '<img src="' + header_img +
						'" class="header_img" />' + '<span class="username">' + login_msg.username +
						'</span>'; //取出用户名
					document.getElementById("register").innerHTML = '<span class="username">' + "退出登录" + '<span>';
				} else {
					localStorage.clear();
					document.getElementById("login").innerHTML = "登录";
					document.getElementById("register").innerHTML = "注册";
				}

			},
			error: function() {
				alert('服务器发生错误！');
			}
		});

	} else {

	}
}
