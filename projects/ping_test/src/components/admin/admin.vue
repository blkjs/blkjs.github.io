<template>
  <div>
    <el-button icon="el-icon-arrow-left" style="float: left;margin-left: 1.25rem;" @click="Home()">首页</el-button>
    <div style="padding-top: 5rem;">
      输入IP：<el-input type="textarea"  autosize placeholder="请输入ip" v-model="ips" style="width: 2.5rem;"></el-input>
      输入域名：<el-input type="textarea"  autosize placeholder="请输入域名" v-model="hostname" style="width: 2.5rem;"></el-input>
      ip位置:<el-select v-model="value4" clearable placeholder="请选择ip" @change="change" style="width:2.5rem;margin-right: 1rem;"> <el-option   v-for="item in options"   :key="item.value"  :label="item.label"   :value="item.value"> </el-option> </el-select>
      <el-button type="primary" @click="writein()" style="margin-right: 0.5rem;">写入数据库</el-button>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
      ips: '',
      hostname: '',
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
       label:'',
       email:localStorage.getItem("email"),
      }
    },methods:{
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
        this.$message({ message: this.label,  type: 'success'});
      },
      Home(){
      	 this.$router.push({
      		name: 'Home'
      	})
      },
       writein(){
         if(this.textarea=='' || this.textarea1==''){
            this.$message({ message: "ip或域名不能为空",  type: 'error'});
           return false;
         }
        	var params = new URLSearchParams();
        	params.append('hostname', this.hostname);
          params.append('ip', this.ips);
          params.append('position', this.label);
          params.append('email', this.email);
         this.$http.post(this.Public.interfaceAPI+'/postip/postip',params)
              .then(resp => {
                if(resp.data.status==1){
                  this.$message({ message: '写入成功！',  type: 'success'});
                }else if(resp.data.status==0){
                   this.$message({ message: "写入失败"+resp.data.message,  type: 'error'});
                }

                 // console.log(resp.data)
              }).catch(err => {
                  console.log(err);
                   this.$message({ message: err,  type: 'error'});
              })
      },
      },
      }
</script>

<style>
</style>
