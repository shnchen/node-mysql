var express = require('express');
var http = require('http');
var mysql = require('mysql');
var cors = require('cors');
var router = express.Router();
var app = express();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'123456789',
  database:'test'
})
//链接数据库
connection.connect(function(err) {
  if(err){
    throw err;
  }
  console.log('数据库连接成功');
})
//创建数据库
app.get('/createdb',function(req,res){
  let sql = 'CREATE DATABASE test';
  connection.query(sql,function(err,ret){
    if(err){
      console.log(err,'err');
    }else{
      console.log(ret,'success');
    }
  })
})
//建表
app.get('/createtable',function(err,ret){
  var sql = 'CREATE TABLE userInfo(id int AUTO_INCREMENT,name VARCHAR(16),gender int,age int,registryTime DATE,headUrl VARCHAR(255),PRIMARY KEY(ID) )';
  connection.query(sql,function(err,ret){
    if(err){
      console.log(err);
    }else{
      console.log(ret);
    }
  })
})
//新增用户
app.post('/add-user',function(req,res) {
  var data = req.body;
  console.log(data);
  data.headUrl = JSON.stringify(data.headUrl)
  var addSql = 'INSERT INTO userInfo SET ?';
  var addSqlParams = {name:data.name,gender:data.gender,age:data.age,registryTime:data.registryTime,headUrl:data.headUrl};
  connection.query(addSql,addSqlParams,function(err,ret){
    if(err){
      res.send({
        status:500,
        message:err.message
      })
    }else{
      res.send({
        status:200,
        message:'添加成功'
      });
    }
    
  })
})
//获取列表
app.get('/user-list',function(req,res){
  var countSql ='SELECT COUNT(*) FROM userInfo';
  var total;
  connection.query(countSql,function(err,ret){
    total=ret[0]['COUNT(*)'];
  })
  var sql = 'SELECT * FROM userInfo limit '+(req.query.pageNum-1)*req.query.pageSize+','+req.query.pageSize;
  connection.query(sql,function(err,ret){
    if(err){
      res.send({
        status:500,
        message:'服务报错'
      })
    }else{
      res.send({
        status:200,
        data:{
          list:ret,
          total,
        }
      })
    }
  })
})
//获取单个用户
app.get('/user-detail',function(req,res){
  var sql = 'SELECT * FROM userInfo WHERE id='+req.query.id
  connection.query(sql,function(err,ret){
    if(err){
      res.send({
        status:500,
        message:err
      })
    }else{
      res.send({
        status:200,
        data:ret[0]
      })
    }
  })
})
//编辑
app.put('/update-user',function(req,res){
  var data = req.body;
  let sql = "UPDATE userInfo SET name="+"'"+data.name+"'"+',gender='+"'"+data.gender+"'"+',age='+"'"+data.age+"'"+',registryTime='+"'"+data.registryTime+"'"+',headUrl='+"'"+JSON.stringify(data.headUrl)+"'" + 'WHERE id='+data.id;
  
  connection.query(sql,function(err,ret) {
    if(err){
      console.log(err);
      res.send({
        status:500,
        message:err
      })
    }else{
      res.send({
        status:200,
        message:'更新成功'
      })
    }
  })
})
//删除单条
app.delete('/del-user',function(req,res){
  console.log(req.body);
  var sql = 'DELETE  FROM userInfo WHERE id='+req.body.id;
  connection.query(sql,function(err,ret){
    if(err){
      res.send({
        status:500,
        message:err
      })
    }else{
      res.send({
        status:200,
        message:'删除成功'
      })
    }
  })
})
//图片上传
app.use('/public', express.static('public'));
var upload = multer({
  dest :path.join(__dirname,'public')
})
app.post('/upload',upload.single('file'),function(req,res){
  var file = req.file;
  console.log(file);
  var des_file = __dirname+'/public/'+file.originalname;
  fs.readFile(file.path,function(err,data) {
    fs.writeFile(des_file,data,function(err){
      if(err){
        res.send({
          status:500,
          message:'图片上传失败'
        })
      }
      file.status = 200;
      file.message = '上传成功'
      file.url = 'http://127.0.0.1:9998/public/'+file.originalname;
      res.send(file);
    })
  })
  
})
http.createServer(app).listen(9998,function(){
  console.log('服务启动');
})
