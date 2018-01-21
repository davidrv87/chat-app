"use strict";

const expect          = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('Generate message', () => {
    it('should generate the correct message object', () => {
        var from = 'David';
        var text = 'This is a test';

        var message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(typeof message.createdAt).toEqual('number');
    });
});

describe('Generate Location Message', () => {
    it('should generate a valid url to Google Maps with lat and long', () => {
        var from = 'David';
        var coords = {
            latitude: 12345,
            longitude: 67890
        };

        var message = generateLocationMessage(from, coords);

        expect(message).toMatchObject({
            from,
            url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
        });
        expect(typeof message.createdAt).toEqual('number');
    });
});