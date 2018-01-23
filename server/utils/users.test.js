"use strict";

const expect = require('expect');

const {Users} = require('./users');

describe('Users class', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Mike',
            room: 'Node course'
        }, {
            id: 2,
            name: 'David',
            room: 'React course'
        }, {
            id: 3,
            name: 'John',
            room: 'Node course'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: 1,
            name: 'David',
            room: 'The Office Fans'
        };
        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var user = users.removeUser(1);

        expect(users.users.length).toBe(2);
        expect(user.id).toBe(1);
    });

    it('should not remove a user', () => {
        var user = users.removeUser(44);

        expect(users.users.length).toBe(3);
        expect(user).toBeFalsy();
    });

    it('should find a user', () => {
        var user = users.getUser(2);

        expect(user.id).toBe(2);
        expect(user.name).toBe('David');
    });

    it('should not find a user', () => {
        var user = users.removeUser(44);

        expect(user).toBeFalsy();
    });

    it('should return names for Node course', () => {
        var room = 'Node course';
        var userList = users.getUserList(room);

        expect(userList).toEqual(['Mike', 'John']);
    });

    it('should return names for React course', () => {
        var room = 'React course';
        var userList = users.getUserList(room);

        expect(userList).toEqual(['David']);
    });
});