const express = require('express');
const jwt = require('jsonwebtoken');
const messageController = require('../controllers/message.controller');
const jwtAuth = require('../auths/jwtAuth');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const timer = require('long-timeout')

const socketMiddleware = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, jwtAuth.key, function(err, decoded) {
      const expiresIn =  (decoded.exp - Date.now() / 1000) * 1000
      timer.setTimeout(() => {
        console.log('disconnect now');
        io.emit("expired", 'token expired!!');
        socket.disconnect(true);
      }, expiresIn);

      return next()
    });
  } else {
    io.emit("error", 'Authentication error');
    return next()
  }    
};

io.use(socketMiddleware).on('connection', async(socket) => {
  console.log('a user connected');
  const socketid = socket.id;
  const messages = await messageController.readAll();

  io.to(socketid).emit('history', messages);

  socket.on("message", async (obj) => {
    const message = await messageController.create(obj);
    io.emit("message", message);
  });
});

server.listen(3001);