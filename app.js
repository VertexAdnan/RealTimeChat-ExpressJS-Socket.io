const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var session = require('express-session')
var bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');

app.use(bodyParser.urlencoded());


app.get('/message', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/t', (req,res) => {
    res.render('index.ejs',  {username: session.username})
})

app.post('/join' ,(req, res) => {
    console.log(req.body)
    session.username = req.body.username;

    return res.redirect('/t');
    //res.send(session.username)
})

app.get('/', (req,res) => {
    res.render('join.ejs');
}) 



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("chat message", (arg) => {
        console.log(arg); // world
        socket.broadcast.emit('chat message', username + arg)
        socket.emit('chat message', username + arg)
      });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});