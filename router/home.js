var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var app = express();

app.use(express.json());
app.use(express.urlencoded());
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'123456789',
  database:'test'
})
// //链接数据库
connection.connect(function(err) {
  if(err){
    throw err;
  }
  console.log('数据库连接成功');
})
//创建数据库
router.get('/createdb',function(req,res){
  let sql = 'CREATE DATABASE test1';
  connection.query(sql,function(err,ret){
    if(err){
      console.log(err,'err');
    }else{
      console.log(ret,'success');
    }
  })
})
//建表
router.get('/createtable',function(err,ret){
  var sql = 'CREATE TABLE userInfo1(id int AUTO_INCREMENT,name VARCHAR(16),gender int,age int,registryTime DATE,headUrl VARCHAR(255),PRIMARY KEY(ID) )';
  connection.query(sql,function(err,ret){
    if(err){
      console.log(err);
    }else{
      console.log(ret)
    }
  })
})
//新增用户
router.post('/add-user',function(req,res) {
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
router.get('/user-list',function(req,res){
  var countSql ='SELECT COUNT(*) FROM userInfo';
  var total;
  connection.query(countSql,function(err,ret){
    total=ret[0]['COUNT(*)'];
  })
  var sql = 'SELECT * FROM userInfo limit '+(req.query.pageNum-1)*req.query.pageSize+','+req.query.pageSize;
  connection.query(sql,function(err,ret){
    if(err){
      console.log(err)
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
router.get('/user-detail',function(req,res){
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
router.put('/update-user',function(req,res){
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
// //删除单条
router.delete('/del-user',function(req,res){
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
router.get('/get-imgs',function(req,res){
  res.send({
    status:200,
    list:[
      'http://127.0.0.1:9998/public/images/1646891967586WechatIMG6.jpeg',
      'http://127.0.0.1:9998/public/images/1646890639727logo192.png',
      'http://127.0.0.1:9998/public/images/16468919967101625105210401_E4934060-581F-4ADB-A150-F886B8C1624A.png',
      'http://127.0.0.1:9998/public/images/22_画板.png',
      'http://127.0.0.1:9998/public/images/cd53f03685c1db36ab8cea9406dfc19a.png'
    ]
  })
})
module.exports = router;