const jwt = require('jsonwebtoken');
const key = 'my_secret_key';

const auth = (req, res, next) => {
    let bearerToken = null;
	const bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		bearerToken = bearer[1];
	}

	jwt.verify(bearerToken, key,(err, decoded)=>{
		if(err){
			console.log('jwt err!!!', err);
			res.json({ success: false});
		}else{
			console.log('decoded:   ', decoded.payload);
			req.uuid = decoded.payload.uuid;
			next();
		}
	});
}

module.exports.key = key;
module.exports.auth = auth;
