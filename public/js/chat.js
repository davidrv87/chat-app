"use strict";

// Open a connection in a socket, client -> server and server -> client
var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child'); // last message
    // Heights
    var clientHeight = messages.prop('clientHeight'); // visible height of the messages
    var scrollTop = messages.prop('scrollTop'); // distance scrolled from the top
    var scrollHeight = messages.prop('scrollHeight'); // height of the messages (including not visible)
    var newMessageHeight = newMessage.innerHeight(); // height of the last message
    var lastMessageHeight = newMessage.prev().innerHeight(); // height of the second last message

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

// Use regular functions to avoid problems with old browsers
socket.on('connect', function () {
    var params = $.deparam(window.location.search);

    // Emit the join event when someone enters the chat
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('H:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('H:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime,
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users){
    var ol = $('<ol></ol>');
    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = $('[name="message"]');

    // The third argument is a callback that fires when the message arrives to the server
    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});

var locationButton = $('#send-location');

locationButton.on('click', function () {
    // Check geolocation availability in the browser
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    $(this).attr('disabled', true).text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        $(locationButton).removeAttr('disabled').text('Send location');
    }, function() {
        alert('Unable to fetch the location');
        $(locationButton).removeAttr('disabled').text('Send location');
    });
});