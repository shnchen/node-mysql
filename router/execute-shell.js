var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
router.get('/', (req, res) => {
 
  exec('sh test.sh', (err, stdout, stderr) => {
  if (err) {
  res.send('error');
  return;
  }
  res.send('ok');
  });
 });

 module.exports = router;