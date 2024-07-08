const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

let users = {};

app.use(express.static('public'));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('send-location', (data) => {
    const { id, latitude, longitude } = data;
    users[id] = { latitude, longitude };
    io.emit('receive-location', users);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
    delete users[socket.id];
    io.emit('receive-location', users);
  });
});

app.get("/", function(req,res){
    res.render("index");
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});