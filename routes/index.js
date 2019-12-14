var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  var db = req.con;
  db.query('SELECT * FROM account', function(err, rows) {
      if (err) {
          console.log(err);
      }
      var data = rows;
      res.render('index', { title: 'Account Information', data: data});
  });
});

// register
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Add User'});
});
router.post('/api/register/user', function(req, res, next) {
  var db = req.con;
  var sql = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,10)
  };
  db.query('INSERT INTO account SET ?', sql, function(err, rows) {
      if (err) {
          console.log(err);
      }
      res.setHeader('Content-Type', 'application/json');
      res.redirect('/');
  });
});

// login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login'});
});

router.post('/login', function(req, res, next) {
  var db = req.con;
  let {email, password} = req.body;
  const routerRes = res;

  db.query("select * from account where email = ?", email, function(err, rows) {
    if (err) {
        console.log('err:  ',err);
    }
    var data = rows[0];

    bcrypt.compare(password, data.password).then(function (res) {
      console.log('res:   ', res); // true
      if(res){
        routerRes.redirect('/');
      }
    });
  });
});

module.exports = router;
