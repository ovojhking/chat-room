var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');

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
					const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, jwtAuth.key);
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

router.get('/account-manager/accounts', jwtAuth.auth, function(req, res, next) {
	var db = req.con;
	db.query('SELECT * FROM account', function(err, rows) {
		if (err) {
			console.log('!!err:  ', err);
		}else{
			res.json({ success: true, accounts: rows});
		}
	});
});

router.post('/account-manager/account', function(req, res, next) {
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
		res.redirect('../login');
	});
});

module.exports = router;