var express = require('express');
var router = express.Router();
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');
const userController = require('../controllers/user.controller');

router.post('/login', userController.login);
router.get('/users', [jwtAuth.auth, aclAuth.addRoles, aclAuth.middleware], userController.readAll);
router.post('/user', userController.create);

module.exports = router;