<template>
  <div class="index-top">
	  <div class="search animated bounceInDown" v-if="showSearch">
		  <el-input placeholder="请输入音乐名称" v-model="search" class="input-with-select" clearable>
		    <el-select v-model="select" slot="prepend" placeholder="请选择" >
		      <el-option label="网易云音乐" value="1"></el-option>
		      <el-option label="酷狗音乐" disabled="true" value="2"></el-option>
		      <el-option label="QQ音乐" disabled="true" value="3"></el-option>
		    </el-select>
		    <el-button slot="append" @click="startSearch" icon="el-icon-search"></el-button>
		  </el-input>
	  </div>
	 <el-table
		class="res-table"
		v-loading="loading"
	     element-loading-text="拼命加载中"
	     element-loading-spinner="el-icon-loading"
	     element-loading-background="rgba(0, 0, 0, 0.7)"
	    :data="tableData"
	    max-height="100%">
	    <el-table-column
	      fixed
	      prop="name"
	      label="歌曲名"
	     >
	    </el-table-column>
	    <el-table-column
	      prop="id"
	      label="歌曲ID"
	      >
	    </el-table-column>
	    <el-table-column
	      prop="artists[0].name"
	      label="歌手"
	      >
	    </el-table-column>
	    <el-table-column
	      prop="artists[0].img1v1Url"
	      label="封面"
	      >
		  <template scope="scope">
			  <img style="width: 60px;height: 60px;" :src="scope.row.artists[0].img1v1Url" />
		  </template>
	    </el-table-column>
	    <el-table-column
	      prop="album.name"
	      label="专辑"
	      >
	    </el-table-column>
	    <el-table-column
	      label="操作"
	      width="120">
	      <template slot-scope="scope">
	        <el-button
	          @click.native.prevent="downRow(scope)"
	          type="text"
	          size="small">
	          下载
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
  </div>
</template>

<script>
	import { getSongUrl, search } from "../api/seaarch.js"
export default {
  name: 'HelloWorld',
  data () {
    return {
       search: '',
       select: '',
	   tableData: [],
	   loading: false,
	   i : 0,
	   showSearch:true
    }
  },
  mounted () {
	  window.addEventListener('scroll', this.handleScroll, true);  
	   // 监听（绑定）滚轮 滚动事件
  },
  methods:{
	handleScroll(){
		// 页面滚动距顶部距离
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 
				  document.body.scrollTop
		var scroll = scrollTop - this.i;
		this.i = scrollTop;
		if(scroll<0){
			//console.log('up')
			this.showSearch = true
		}else if(scroll>0){
			this.showSearch = false
			//console.log('down')
		}
	},
   downRow(rows) {
		this.loading=true
		this.$get(getSongUrl,{id:rows.row.id})
			.then((res) => {
			  this.loading=false
			  if(!res.data[0].url){
				  this.$notify({
					title: '失败',
					message: "未找到下载地址",
					type: 'error'
				  });
				  return
			  }
			  window.open(res.data[0].url,'_blank') 
			}).catch((res)=>{
				this.loading=false
			})
	},
  startSearch(){
	this.loading=true
   this.$get(search,{keywords:this.search})
	.then((res) => {
	  this.loading=false
	  this.tableData = res.result.songs
	  this.$notify({
		title: '成功',
		message: "查询成功！",
		type: 'success'
	  });
	}).catch((res)=>{
		this.loading=false
	})
  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.index-top{
	padding: 1.041667vw 2.083333vw;
	display: flex;
	justify-content: center;
}
.search{
	width: 40%;
	min-width: 280px;
	height: 50px;
	z-index: 99;
	position: fixed;
}
.res-table{
	margin-top: 50px;
}
</style>
