"use strict";

const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var object = {
            name: 'David',
            age: 30
        };

        expect(isRealString(object)).toBeFalsy();
        expect(isRealString(object.age)).toBeFalsy();
    });

    it('should reject strings with only spaces', () => {
        expect(isRealString('    ')).toBeFalsy();
    });

    it('should allow strings with spaces characters', () => {
        expect(isRealString(' David Rubio ')).toBeTruthy();
    });
});