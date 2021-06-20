<template>
	<div :style="{'width': width,'height': height,'background-image':background}">

		<div class="child">
      <div @click="cloose"><li class="cha"></li></div>
			<h2 style="margin-top: 1.25rem;">登录</h2>
			<div class="span">账号：</div><div class="input"><el-input  placeholder="请输入邮箱" v-model="email" clearable></el-input></div><br />
			<div class="span">密码：</div><div class="input"><el-input type="password" placeholder="请输入密码" v-model="passworld" clearable></el-input></div><br />
			<div class="span">验证码：</div><div class="input"><el-input  style="width: 100%;" placeholder="请输入验证码" v-model="VCode" clearable></el-input></div><br />
    <div class="span"></div><div class="input"><div @click="Verification" style="width:2.5rem;height:1rem;background-color: #DFDFDF;"><div v-html="VCode_img"></div></div ></div><br />

			<div class="span">
				<el-button >注册</el-button>
				<el-button type="primary" style="margin-left: 15px;" @click="login">登录</el-button>
			</div>
		</div>
	</div>
</div>
</template>

<script>

	export default {
	  name: 'Home',
	  data () {
	    return {
	       email:localStorage.getItem("email"),
		   passworld:'',
		   VCode:'',
       VCode_img:'',
       width:'100%',
       height:'',
       background: 'linear-gradient(to bottom , #C0C4CC, #909399)',

	    }
	  },

	  methods:{
      cloose(){
       this.$router.push({
       	name: 'Home'
       })
      },
      Verification(){
        var params = new URLSearchParams();
        					params.append('username', this.email);
        					params.append('password', this.passwd);
        				  this.$http.post(this.Public.interfaceAPI +'/VCode/VCode', params,{
        					  withCredentials:true,
        					  withCredentials:'include'
        				  })
                   .then((value)=> {
                      console.log(value)
                      this.VCode_img = value.data.img;
                  })
      },
		  login(){

				var params = new URLSearchParams();
					params.append('username', this.email);
					params.append('password', this.passworld);
           params.append('VerificationCode', this.VCode);
					console.log(this.email,this.passworld)
				  this.$http.post(this.Public.interfaceAPI +'/login', params,{
				  })
            .then((value)=> {
			console.log(value)
						if(value.data.status==1){
							localStorage.setItem("username",value.data.data.username);
							localStorage.setItem("email",value.data.data.email);
							localStorage.setItem("InvitationCode",value.data.data.InvitationCode);
							localStorage.setItem("headerImg",value.data.data.headerImg);
							localStorage.setItem("user_status",value.data.data.user_status);
							console.log(value.data.data.user_status)
							this.$message({
							    message: '登录成功',
							    type: 'success'
							  });
							this.$router.push({
								name: 'Home'
							})
						}else if(value.data.status==0){
							this.$message({
							    message: value.data.message,
							    type: 'success'
							  });

						}else{
							this.$message({
							    message: '登录失败',
							    type: 'error'
							  });
						}

            		})
					.catch((error)=> {
						this.$message({
						    message: error,
						    type: 'error'
						  });
					})

		  }
	  },mounted() {
	    this.Verification();
      var h = document.documentElement.clientHeight || document.body.clientHeight;
      this.height=h+'rem'
       console.log(h)
        //this.curHeight =h - height; //减去页面上固定高度height
	  }
	  }
</script>

<style lang="less">

	.child{
    background-image:linear-gradient(to bottom , #E6A23C, #7A88FF);
		border: 1px solid #DCDFE6;
	    position: fixed;
	    width: 40%;
	    height: 600px;
	    top:50%;
	    left: 30%;
	    margin-top: -20%;

      .cha{
        list-style:none;
      	width: 20px;
      	height: 20px;
      	margin: auto;
      	position: absolute;
        right: 10px;
        top: 10px
      }
      .cha::before,
      .cha::after{
        content: "";
        position: absolute;  /*方便进行定位*/
        height: 20px;
        width: 1.5px;
        top: 2px;
        right: 9px;  /*设置top和right使图像在20*20框中居中*/
       background: #FFFFFF;
      }
      .cha::before{
        transform: rotate(45deg);  /*进行旋转*/
      }
      .cha::after{
        transform: rotate(-45deg);
      }

		.span{
		   display: inline-block;
		   margin-top: 30px;
		   width: 40%;
	   }
	   .input{
		   display: inline-block;
		   margin-top: 30px;
		   width: 30%;
	   }

	}
</style>
