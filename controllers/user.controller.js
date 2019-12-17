var bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');

let models  = require('../models');

const login = (req, res, next) => {
	let {name, password} = req.body;
	models.users.findOne({where: {name}}).then(user => {
		var data = user.dataValues;
		if(data){
			bcrypt.compare(password, data.password).then(success => {
				if(success){
					setRoles(data.id);

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

const setRoles = async id => {
	models.users.belongsToMany(models.roles, {
		through: models.user_roles,
		foreignKey: 'user_id'
	})
	models.roles.belongsToMany(models.users, {
		through: models.user_roles,
		foreignKey: 'role_id'
	})

	const userRoles = await models.users.findAll({
		where: {id},
		include: [{ 
			all: true
		}]
	});

	console.log('----------userRoles0: ', userRoles.length);
	console.log('----------userRoles1: ', userRoles[0]);
	console.log('----------userRoles2: ', userRoles[0].roles);
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
	const users = await models.users.findAll().map(
			element=>({id: element.dataValues.id, name: element.dataValues.name})
		);
	res.json({ success: true, users});
};

module.exports.login = login;
module.exports.create = create;
module.exports.readAll = readAll;
