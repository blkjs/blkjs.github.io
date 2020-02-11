const express =require('express')
const router =express.Router()
const fs = require('fs');
const path = require('path');
const multipart = require('connect-multiparty')//解决from-data接收不到数据问题...
const multipartyMiddleware = multipart()

 var saveimg=(email,dataBuffer,type)=>{
	 let name=type===1 ? "headerImg" : "others"
	 return new Promise((resolve,reject)=>{
	  fs.writeFile('./uploads/'+email+'/'+name+'.png', dataBuffer, (err)=> {
	      if(err){
			  reject(err)
	  	  console.log(err)
	      }else{
	        resolve('/uploads/'+email+'/'+name+'.png')
	      }
	  });
	 })
  }
  var mkdirs =(url)=>{//创建目录
  return new Promise((resolve,reject)=>{
	  fs.mkdir(url,(error)=>{
	  	if(error){
			console.log(url+"✘✘✘✘✘✘✘✘✘✘文件创建失败")
			console.log(error);
			 reject()
	  		return false;
	  	}
		console.log(url+"✔✔✔✔✔✔✔✔✔文件创建成功")
		resolve()
	  })
	  })
  }
  var isTures=(file)=>{//检测文件是否存在
    return new Promise((resolve,reject)=>{
	  fs.exists(file,function(exists){
	    if(exists){
			resolve()
	       console.log(file+"✔✔✔✔✔✔✔✔✔文件存在")
	    }
	     if(!exists){
			 reject(file)
	          console.log(file+"✘✘✘✘✘✘✘✘✘✘文件不存在")
	     }
	    })
		
		})
  }
  
	 /**
	  * @api {post} /file/upload 上传图片
	  * @apiName 上传图片
	  * @apiGroup file
	  * @apiSuccess {String} userEmail 用户邮箱账号,将作为文件夹名称.
	  * @apiSuccess {String} imgBase64  用户上传的Base64图片字符串.
	  * @apiSuccess {Number} type  1头像,2其他.
	  * @apiSuccessExample 成功的返回示例:
	  *     HTTP/1.1 200 OK
	  *     {
	  *       "status": 0,
	  *       "message": "上传成功",
	  *       "imgURL": "/uploads/123456@qq.com/headerImg.png"
	  *     }
	  */
	 
	 //上传图片
router.post('/upload',multipartyMiddleware,(req,res)=>{
	let {userEmail,imgBase64,type}=req.body
//过滤data:URL
    var base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
	isTures("./uploads")
	.then(()=>{
		return isTures("./uploads/"+userEmail)
	})
	.then(()=>{
		return saveimg(userEmail,dataBuffer,type)
	})
	.then((URL)=>{
		return res.json({
		 	 status:'0',
		 	message:'上传成功',
			imgURL:URL
		 })	
	})
	.catch((file)=>{
		if(file=='./uploads'){
			mkdirs(file)
			.then(()=>{
				return mkdirs(file+'/'+userEmail)
			})
			.then(()=>{
				return saveimg(userEmail,dataBuffer,type)
			})
			.then((URL)=>{
				return res.json({
				 	 status:'0',
				 	message:'上传成功',
					imgURL:URL
				 })	
			})
			.catch(()=>{
				return res.json({
				 	 status:'0',
				 	message:'上传失败',
					
				 })	
			})
		}else if(file=='./uploads/'+userEmail){
			mkdirs(file)
			.then(()=>{
				return saveimg(userEmail,dataBuffer,type)
			})
			.then((URL)=>{
				return res.json({
				 	 status:'0',
				 	message:'上传成功',
					imgURL:URL
				 })	
			})
			.catch(()=>{
				return res.json({
				 	 status:'0',
				 	message:'上传失败',
					
				 })	
			})
		}else{
			return res.json({
			 	 status:'0',
			 	message:'上传失败'
			 })	
		}
		
	})

})
module.exports=router