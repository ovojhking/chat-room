var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var app = express();
const messageController = require('./controllers/message.controller');
// var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');
const jwtAuth = require('./auths/jwtAuth');

// socket.io
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
