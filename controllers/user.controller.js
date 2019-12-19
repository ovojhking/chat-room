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
				const role = setRole(userRoles.uuid, userRoles.roles);
				const payload = {
					uuid: userRoles.uuid,
				};
				// 15分鐘後過期
				const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, jwtAuth.key);
				// 30秒後過期
				// const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 0.5) }, jwtAuth.key);
				res.json({
					success: true,
					token,
					userName: userRoles.name,
					role: role,
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
		return roleName;
	}
	return '';
};

const create = async (req, res, next) => {
	let user = await models.users.create({
		uuid: uuid.v4(),
		name: req.body.name,
		password: bcrypt.hashSync(req.body.password,10)
	});
	user = {id: user.dataValues.id, name: user.dataValues.name};
	res.json({ success: true, user});
};

const readAll = async (req, res, next) => {
	const users = await models.users.findAll().map(
			element=>({id: element.dataValues.id, name: element.dataValues.name})
		);
	res.json({ success: true, users});
};

const read = async (req, res, next) => {
	const id = req.params.id;
	let user = await models.users.findOne({
		where: {id}
	});

	user = {id: user.dataValues.id, name: user.dataValues.name};
	res.json({ success: true, user});
};

const update = async (req, res, next) => {
	let {name, password} = req.body;
	let data = {name};
	if(password){
		data = {name, password: bcrypt.hashSync(password,10)};
	}
	const id = req.params.id;
	await models.users.update(
		data,
		{where: {id}}
	)
	let user = await models.users.findOne({
		where: {id}
	});

	user = {id: user.dataValues.id, name: user.dataValues.name};
	res.json({ success: true, user});
};

const deleteUser = async (req, res, next) => {
	const id = req.params.id;
	let user = await models.users.findOne({
		where: {id}
	});
	const deletedUser = {id: user.dataValues.id, name: user.dataValues.name};
	if (!user){
		res.json({ success: false});
		return ;
	}
	user.destroy();
	res.json({ success: true, user: deletedUser});
};

module.exports.login = login;
module.exports.create = create;
module.exports.readAll = readAll;
module.exports.read = read;
module.exports.update = update;
module.exports.deleteUser = deleteUser;
