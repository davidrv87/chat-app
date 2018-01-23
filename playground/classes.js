"use strict";

class Person {

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    getUserDescription() {
        return `${this.name} is ${this.age} year(s) old`;
    }

}

var me = new Person('David', 30);
console.log(me.getUserDescription());