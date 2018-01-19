"use strict";

// Open a connection in a socket, client -> server and server -> client
var socket = io();

// Use regular functions to avoid problems with old browsers
socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'David',
        text: 'An awesome message from the client'
    });
});

socket.on('newMessage', function(message) {
    console.log('New message arrived!');
    console.log(JSON.stringify(message, undefined, 2));
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});
