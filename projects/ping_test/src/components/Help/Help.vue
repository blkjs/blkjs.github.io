<template>
	<div>
		  <el-button icon="el-icon-arrow-left" style="float: left;margin-left: 1.25rem;" @click="Home">首页</el-button>
      <el-button icon="el-icon-arrow-left" style="float: left;margin-left: 1.25rem;" @click="permis">提示没有权限待解决方法</el-button>
		<div>

			<h1>IE浏览器开启ActiveX</h1>
			<div>
				<h3>第一步：打开设置</h3><br>
				<img src="../../../static/img/1.png" class="img"/>
			</div>
			<div>
				<h3>第二步：选择internet选项</h3><br>
				<img src="../../../static/img/2.png" class="img"/>
			</div>
			<div>
				<h3>第三步：选择安全</h3><br>
				<img src="../../../static/img/3.png" class="img"/>
			</div>
			<div>
				<h3>第四步：选择internet，把下面勾去掉，选择自定义级别</h3><br>
				<img src="../../../static/img/4.png" class="img"/>
			</div>
			<div>
				<h3>第五步：找到“对未标记可安全执行脚本的ActiveX”这项选择启用</h3><br>
				<img src="../../../static/img/5.png" class="img"/>
			</div>
			<div>
				<h3>第六步：点击确定</h3><br>
				<img src="../../../static/img/6.png" class="img"/>
				<h3>完</h3><br><br><br>
			</div>
      <el-button type="primary" icon="el-icon-upload2" v-if="btnFlag" class="go-top" @click="backTop">回到顶部</el-button>

		</div>
	</div>
</template>

<script>
	export default {
	  name: 'Home',
		  data () {
				return {
					btnFlag:'',
				}
			},methods:{
        permis(){
          this.$router.push({name:'permis'})
        },
				Home(){
					 this.$router.push({
						name: 'Home'
					})
				},backTop () {
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
        }
			},mounted() {
           window.addEventListener('scroll', this.scrollToTop);
        },destroyed () {
        window.removeEventListener('scroll', this.scrollToTop)
      },
		}
</script>

<style>
	.img{
		width: 80%;
		height: auto;
		-moz-box-shadow:10px 10px 10px #C0C4CC;
		-webkit-box-shadow:10px 10px 10px #C0C4CC;
		box-shadow:10px 10px 10px #C0C4CC;
	}

 .go-top{
position:fixed; *position:absolute;  bottom:20%; right:2%; margin:-50px 0 0 -50px;
 }
</style>
