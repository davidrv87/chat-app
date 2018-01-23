"use strict";

require('./config/config');

const path       = require('path');
const http       = require('http');
const express    = require('express');
const socketIO   = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
var port         = process.env.PORT;

// Note how we use server to listen below
var app    = express();
var server = http.createServer(app);
// Create a websocket server
var io     = socketIO(server);
var users  = new Users();

// Serve the public directory
app.use(express.static(publicPath));

// Register an event
io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        // socket.join() let you create 'rooms'. To leave use socket.leave()
        // To target a specific socket (room) we chain io.to(room).emit() or socket.to(room).emit()
        socket.join(params.room);
        // Remove the user from any other chat room and add it to the new one
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Greet the new user
        // socket.emit() emits an event to a single connection, the calling socket
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

        // Inform the rest of the users
        // socket.broadcast.emit() will emit the event to everybody but the calling socket
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    // The second argument in the function is the callback specified in the socket.emit(o, cb) in the client
    socket.on('createMessage', (newMessage, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(newMessage.text)) {
            // io.emit() emits an event to every single connection
            socket.broadcast.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
            socket.emit('newMessage', generateMessage('Me', newMessage.text));
            callback();
        }
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            socket.broadcast.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords));
            socket.emit('newLocationMessage', generateMessage('Me', coords));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});