"use strict";

// Open a connection in a socket, client -> server and server -> client
var socket = io();

// Use regular functions to avoid problems with old browsers
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $(`<a target="_blank">I'm here</a>`);

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    var textBox = $('[name="message"]');

    // The third argument is a callback that fires when the message arrives to the server
    socket.emit('createMessage', {
        from: 'User',
        text: textBox.val()
    }, function(data) {
        console.log(data);
        textBox.val('');
    });
});

var locationButton = $('#send-location');

locationButton.on('click', function (e) {
    // Check geolocation availability in the browser
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch the location');
    });
});