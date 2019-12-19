const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socketAuth = require('../auths/socketAuth');
const messageController = require('../controllers/message.controller');

io.use(socketAuth.auth).on('connection', async(socket, err) => {
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