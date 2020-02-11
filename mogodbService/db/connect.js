var mongoose =require('mongoose')

mongoose.connect('mongodb://localhost/smile',{
	useNewUrlParser:true,
	useUnifiedTopology: true
	},
).then(
  () => { 
	  console.log('连接mongoDB数据库成功!')
  },
  err => { 
	  console.log('连接mongoDB数据库失败!') 
	  }
);
