var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');
let models  = require('../models');

router.post('/login', function(req, res, next) {
	let {name, password} = req.body;
	models.users.findOne({where: {name}}).then(user => {
		var data = user.dataValues;
		if(data){
			bcrypt.compare(password, data.password).then(success => {
				if(success){
					const payload = {
						uuid: data.uuid,
					};
					const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, jwtAuth.key);
					res.json({
						success: true,
						token
					})
				}else{
					res.json({ success: false });
				}
			});
		}else{
			res.json({ success: false });
		}
	});
});

router.get('/users', jwtAuth.auth, async (req, res, next) => {
	const users = await models.users.findAll().map(
			element=>({id: element.dataValues.id, name: element.dataValues.name})
		);
	res.json({ success: true, users});
});

router.post('/user', function(req, res, next) {
	models.users.create({
		uuid: uuid.v4(),
		name: req.body.name,
		password: bcrypt.hashSync(req.body.password,10)
	}).then(()=>{
		res.redirect('../login');
	});
});

module.exports = router;