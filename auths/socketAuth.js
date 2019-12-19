const timer = require('long-timeout')
const jwt = require('jsonwebtoken');
const jwtAuth = require('./jwtAuth');

const auth = (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, jwtAuth.key, function(err, decoded) {
        if(err){
          return next(new Error('Authentication error'));
        }
        const expiresIn =  (decoded.exp - Date.now() / 1000) * 1000
        timer.setTimeout(() => {
          console.log('disconnect now');
          socket.emit("expired", 'token expired');
          socket.disconnect(true);
        }, expiresIn);
  
        return next();
      });
    } else {
      return next(new Error('Authentication error'));
    }    
};

module.exports.auth = auth;