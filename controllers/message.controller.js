const jwt = require('jsonwebtoken');
const jwtAuth = require('../auths/jwtAuth');
const aclAuth = require('../auths/aclAuth');

let models  = require('../models');

const create = async (data) => {
	const dbValue = await models.messages.create({
		user_name: data.userName,
		message: data.message,
	});

	return ({user_name: dbValue.dataValues.user_name, message: dbValue.dataValues.message, createdAt: dbValue.dataValues.createdAt});
};

const readAll = async () => {
	const messages = await models.messages.findAll().map(
			element=>({user_name: element.dataValues.user_name, message: element.dataValues.message, createdAt: element.dataValues.createdAt})
		);
	return messages;
};

module.exports.create = create;
module.exports.readAll = readAll;
