apidoc自动生成api文档https://apidocjs.com/
按照一定的规则注释即可自动生成文档
/**
 * @api {pst} /user/ Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

命令生成,需要打包的目录./router  打包后台存放的目录./apiDoc
apidoc -i ./router -o ./apiStatic

可视化管理工具推荐ROTO 3T

mongodb数据库常用命令
mongo				cmd命令行进入mongodb
use dbname			切换数据库
show dbs			查询所有数据库
db.version()		查看当前数据库版本
db.getName()		显示当前数据库
use smile			创建数据库(use的时候，系统就会自动创建一个数据库。如果use之后没有创建任何集合。系统就会删除这个数据库。)
db.dropDatabase()	删除数据库(如果没有选择任何数据库，会删除默认的test数据库)

创建集合：
	方法1：
	use smile
	db.createCollection('a') 	集合a,会有默认主键
	db.createCollection('b')	集合b
show collections/db.getCollectionNames()	查看当前数据下的所有集合
	方法2：
	use smile
	db.c.insert({name:'smile'})	当插入一个文档的时候，一个集合就会自动创建。
db.c.renameCollection("smile")	重命名集合
db.a.drop()	
					删除集合
插入记录：
for(i=0;i<10000;i++){ 			  插入1w行数据
	db.log.insert(
		{"uid":i,"name":"mongodb","age":6,"date":new Date()}
	); 
	} 
db.log.find()					查询集合中的查询所有记录

删除集合中的记录数：
db.log.distinct("name") 		查询去掉当前集合中某列的重复数据 [ "mongodb" ] 
db.log.remove({})				删除集合中所有记录

查看集合存储信息
db.log.stats() 					查看数据状态 
db.log.dataSize()				集合中数据的原始大小 
db.log.totalIndexSize()			集合中索引数据的原始大小 
db.log.totalSize()				集合中索引+数据压缩存储之后的大小 
db.log.storageSize()			集合中数据压缩存储的大小

pretty()使用
> db.log.find({uid:1000}).pretty() { "_id" : ObjectId("5a4c5c0bdf067ab57602f7c2"), "uid" : 1000, "name" : "mongodb", "age" : 6, "date" : ISODate("2018-01-03T04:28:59.343Z") }


