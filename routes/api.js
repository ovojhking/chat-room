var express = require('express');
var router = express.Router();
const jwtAuth = require('../middlewares/jwtAuth');
const userController = require('../controllers/user.controller');

router.post('/login', userController.login);
router.get('/users', jwtAuth.auth, userController.readAll);
router.post('/user', userController.create);

module.exports = router;