"use strict";

require('./config/config');

const path       = require('path');
const http       = require('http');
const express    = require('express');
const socketIO   = require('socket.io');

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

    socket.on('createMessage', function(newMessage) {
        console.log('Received new message!');
        console.log(JSON.stringify(newMessage, undefined, 2));
        // io.emit() emits an event to every single connection
        // socket.emit() emits an event to a single connection
        io.emit('newMessage', {
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});