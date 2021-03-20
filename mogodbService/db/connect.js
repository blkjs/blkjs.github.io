var mongoose =require('mongoose')

mongoose.connect('mongodb://root:root123456@localhost/admin',{
	useNewUrlParser:true,
	useUnifiedTopology: true,
	},
).then(
  () => { 
	  console.log('连接mongoDB数据库成功!')
  },
  err => { 
	  console.log('连接mongoDB数据库失败!') 
	  }
);