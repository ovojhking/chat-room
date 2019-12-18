var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/account-management', function(req, res, next) {
	res.render(__dirname + '/../views/account/accountManagement');
});

router.get('/account-management/:id/edit', function(req, res, next) {
	res.render(__dirname + '/../views/account/accountEditor');
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.get('/login', function(req, res, next) {
	res.render('login');
});

module.exports = router;
