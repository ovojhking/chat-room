var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Chat room'});
});

router.get('/account-management', function(req, res, next) {
	res.render('accountManagement', { title: 'Account Information'});
});

router.get('/register', function(req, res, next) {
	res.render('register', { title: 'Add User'});
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'login'});
});

module.exports = router;
