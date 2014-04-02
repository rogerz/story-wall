var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('begin', {text: 'story begin'});

  // ugly hacking to emit event from socket by johnny-five
  var five = require('johnny-five');
  var board = new five.Board();

  board.on('ready', function () {
    sensor = new five.Sensor({
      pin: 'A0',
      freq: 250
    });

    var last;
    var threshold = -20;
    sensor.scale([0, 100]).on('data', function () {
      console.log(this.value, this.raw);
      if (!last) {
        last = this.value;
      } else {
        var story = this.value - last;
        last = this.value;
        if (story < threshold) {
          console.log(story);
          socket.emit('story', {text: story});
        }
      }
    });

    board.repl.inject({
      sensor: sensor,
      threshold: threshold
    });

  });

});
