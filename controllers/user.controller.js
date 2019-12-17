var bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');

let models  = require('../models');

const login = async (req, res, next) => {
	let {name, password} = req.body;

	models.users.belongsToMany(models.roles, {
		through: models.user_roles,
		foreignKey: 'user_id'
	})
	models.roles.belongsToMany(models.users, {
		through: models.user_roles,
		foreignKey: 'role_id'
	})

	let userRoles = await models.users.findAll({
		where: {name},
		include: [{ 
			all: true
		}]
	});
	userRoles = userRoles[0].dataValues;

	if(userRoles){
		bcrypt.compare(password, userRoles.password).then(success => {
			if(success){
				setRole(userRoles.uuid, userRoles.roles);
				const payload = {
					uuid: userRoles.uuid,
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
};
const setRole = (id, roles) => {
	const roleName = 'admin'
	const isAdmin =	roles.some(role => role.dataValues.name === roleName);
	if(isAdmin){
		aclAuth.addRoles(id, roleName);
	}
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
