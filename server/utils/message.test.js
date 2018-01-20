"use strict";

const expect          = require('expect');
var {generateMessage} = require('./message');

describe('Generate message', () => {
    it('should generate the correct message object', () => {
        var from = 'David';
        var text = 'This is a test';

        var message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(typeof message.createdAt).toEqual('number');
    });
});