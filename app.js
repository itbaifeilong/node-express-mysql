//引入exprssg和mysql
var express = require('express');
var mysql = require('mysql');
var app = express();
//新版引入解决req.body是undefined
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
//解决跨域
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if(req.method == 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
});
//创建sql实例
var connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '08081018',
	database: 'myserver'
})
//打开连接
connection.connect();
//获取数据
app.get('/', function(req, res) {
	//SELECT * FROM websites 所有数据   websites 数据库表名
	connection.query('SELECT * FROM websites', function(err, result) {
		if(err) {} else {
			var str = JSON.stringify(result);
			res.send(str);
		}
	})
})
////添加数据
//app.get('/add',function(req,res,next){
//	res.render('add')
//})
//添加
app.post('/add', function(req, res, next) {
	//前端传来接收的数据
	var name = req.body.name;
	var url = req.body.url;
	var alexa = req.body.alexa;
	var country = req.body.country;
	//websites(name,url,alexa,country)数据库对应的字段名
	//values() //字段名字段，前端传来的数据。
	connection.query("insert into websites(name,url,alexa,country) values('" + name + "','" + url + "','" + alexa + "','" + country + "')", function(err, result) {
		if(err) {
			res.send('新增失败')
			return;
		} else {
			res.send('新增成功');
		}
	})
})
//删除
app.post('/del', function(req, res, next) {
	var id = req.body.id;
	//根据id进行删除
	connection.query('DELETE FROM websites WHERE id = "' + id + '"', function(err, result) {
		if(err) {
			res.send({
				"msg": '删除失败',
				"error": err
			})
		} else {
			res.send({
				"msg": '删除成功',
				"success": result
			})
		}
	});

})
//修改
app.post('/updata',function(req,res,next){
	//更新，根据id来进行数据更新。
	connection.query('UPDATE websites SET name ="'+ req.body.name +'",url ="'+ req.body.url +'" ,alexa = "'+ req.body.alexa +'",country = "'+ req.body.country +'" WHERE id = "'+ req.body.id +'"',function(err,result){
		if(err){
			res.send({"msg":'修改失败',"error":err})
		}else{
			res.send({"msg":'修改成功',"success":result})
		}
	})
})
//关闭数据库连接，这里注释解决了一个bug。先这样。
//connection.end();
//启动接口 3000是端口可修改。
app.listen(3000, function() {
	console.log('server启动........')
})