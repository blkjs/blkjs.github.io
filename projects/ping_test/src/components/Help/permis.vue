<template>
	<div>
		  <el-button icon="el-icon-arrow-left" style="float: left;margin-left: 1.25rem;" @click="Home()">首页</el-button>
		<div>

			<h1>操作etc目录提示没有权限的解决方法</h1>
			<div>
				<h3>第一步：找到目录C:\Windows\System32\drivers</h3><br>
				<img src="../../../static/img/permis1.png" class="img"/>
			</div>
			<div>
				<h3>第二步：选择确定</h3><br>
				<img src="../../../static/img/permis2.png" class="img"/>
			</div>
			<div>
				<h3>第三步：设置访问权限</h3><br>
				<img src="../../../static/img/permis3.png" class="img"/>
			</div>
			<div>
				<h3>第四步：取消只读</h3><br>
				<img src="../../../static/img/permis4.png" class="img"/>
			</div>
			<div>
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
