var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();
var xlsx = require('xlsx')
var mysql = require('mysql')


var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:3306,
  password:'123456789',
  database:'test'
})
//图片上传
app.use(path.join(__dirname,'../public'), express.static('public'));
var upload = multer({
  dest :path.join(__dirname,'../public','images')
})
router.post('/',upload.single('file'),function(req,res){
  var  timer = +new Date();
  var file = req.file;
  var des_file = path.join(__dirname,'../public/images/')+timer+file.originalname;
  fs.readFile(file.path,function(err,data) {
    fs.writeFile(des_file,data,function(err){
      if(err){
        res.send({
          status:500,
          message:'图片上传失败'
        })
      }else{
        file.status = 200;
        file.message = '上传成功'
        file.url = 'http://127.0.0.1:9998/public/images/'+timer+file.originalname;
        res.send(file);
      }
    })
  })
})
router.post('/excel-upload',multipartMiddleware,function(req,res) {
  const workBook = xlsx.readFile(req.files.file.path)
  const {Sheets,SheetNames} = workBook;
  let output = []
  SheetNames.forEach(item=>{
    const arr = xlsx.utils.sheet_to_json(Sheets[item]);
    output.push(arr)
  })
  output = output.flat()
  let data = []
  output.forEach(item=>{
    data.push([item.username,item.password,item.email,item.mobile,item.collect])
  })
  var addSql = 'INSERT INTO users (username,password,email,mobile,collect) values ?';
  connection.query(addSql,[data],function(err,ret){ 
    
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

module.exports = router;