"use strict";

require('./config/config');

const path       = require('path');
const http       = require('http');
const express    = require('express');
const socketIO   = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
var port         = process.env.PORT;

// Note how we use server to listen below
var app    = express();
var server = http.createServer(app);
// Create a websocket server
var io     = socketIO(server);

// Serve the public directory
app.use(express.static(publicPath));

// Register an event
io.on('connection', (socket) => {
    console.log('New user connected');

    // Greet the new user
    // socket.emit() emits an event to a single connection, the calling socket
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

    // Inform the rest of the users
    // socket.broadcast.emit() will emit the event to everybody but the calling socket
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat'));

    // The second argument in the function is the callback specified in the socket.emit(o, cb) in the client
    socket.on('createMessage', (newMessage, callback) => {
        console.log('Received new message!');
        console.log(JSON.stringify(newMessage, undefined, 2));

        // io.emit() emits an event to every single connection
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});