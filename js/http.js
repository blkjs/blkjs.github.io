
function $http(api,data,type){
	return new Promise((resolve, reject)=>{
		var login_msg = JSON.parse(localStorage.getItem("login_msg"))
        $.ajax({
        	url: topurl + api,
        	type: type,
        	async: true,
        	xhrFields: {
        		withCredentials: true
        	},
             beforeSend: function (xhr) {
                 if(login_msg){
                     xhr.setRequestHeader("Authorization", "Bearer "+login_msg.result.token); //头部写入token
                 }
                 // xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
            },
        	data,
        	success: (data)=> {
        		resolve(data)
        	},
        	error: function(err) {
                /* if(err.responseJSON.code == 401){
                    alert("请先登录!")
                    location.href = "../../unpackage/login/login.html"
                    register()
                    return
                } */
                reject(err.responseJSON)
        	}
        });
	})
}