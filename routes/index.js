var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
router.get('/api/account-manager/accounts', function(req, res, next) {

	let bearerToken = null;
	const bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' '); // 字串切割
		bearerToken = bearer[1]; // 取得 JWT
	}

	jwt.verify(bearerToken, 'my_secret_key',(err, decoded)=>{
		if(err){
			console.log('jwt err!!!', err);
			res.json({ success: false});
		}else{
			console.log('decoded:   ', decoded.payload);
			var db = req.con;
			db.query('SELECT * FROM account', function(err, rows) {
				if (err) {
					console.log(err);
				}else{
					res.json({ success: true, accounts: rows});
				}
			});
		}
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
		if(data){
			bcrypt.compare(password, data.password).then(function (res) {
				console.log('res:   ', res); // true
				if(res){
					// 產生 JWT
					const payload = {
						user_id: data.id,
					};
					const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, 'my_secret_key');
					console.log('token:   ', token);
					// routerRes.redirect('/');
					routerRes.json({
						success: true,
						token
					})
				}else{
					routerRes.json({ success: false });
				}
			});
		}else{
			routerRes.json({ success: false });
		}
	});
});

module.exports = router;
