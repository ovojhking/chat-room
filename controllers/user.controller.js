var bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');
let models  = require('../models');

const login = (req, res, next) => {
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
};

const create = (req, res, next) => {
	models.users.create({
		uuid: uuid.v4(),
		name: req.body.name,
		password: bcrypt.hashSync(req.body.password,10)
	}).then(()=>{
		res.redirect('../login');
	});
};

const readAll = async (req, res, next) => {
	console.log('!!!!!!hihihihihihihih');
	const users = await models.users.findAll().map(
			element=>({id: element.dataValues.id, name: element.dataValues.name})
		);
	res.json({ success: true, users});
};

module.exports.login = login;
module.exports.create = create;
module.exports.readAll = readAll;
