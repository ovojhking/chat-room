var express = require('express');
var router = express.Router();
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');
const userController = require('../controllers/user.controller');

router.post('/login', userController.login);

router.get('/users', [jwtAuth.auth, aclAuth.middleware.bind(null,2)], userController.readAll);

router.post('/user', userController.create);
router.get('/user/:id', [jwtAuth.auth, aclAuth.middleware.bind(null,2)], userController.read);
router.put('/user/:id', [jwtAuth.auth, aclAuth.middleware.bind(null,2)], userController.update);
router.delete('/user/:id', [jwtAuth.auth, aclAuth.middleware.bind(null,2)], userController.deleteUser);

module.exports = router;