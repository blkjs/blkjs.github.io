var topurl = "http://49.235.80.50:3000/"

var app = () => {
	window.open("../app/app.html", '_self')
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
	$('#service').mouseover(function() {
		console.log($('#WeChat')[0].style)
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
				if (data.status == 1) {
					document.getElementById("login").innerHTML = '<img src="' + JSON.parse(localStorage.getItem("login_msg")).headerImg +
						'" class="header_img" />' + '<span class="username">' + JSON.parse(localStorage.getItem("login_msg")).username +
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
