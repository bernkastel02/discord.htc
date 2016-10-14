"use strict";

class Role {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.color = data.color
        this.hoist = data.hoist
        this.position = data.position
        this.permissions = data.permissions
    }
}

module.exports = Role