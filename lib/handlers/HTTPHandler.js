"use strict";

var Constants = require("../Consts");
var request = require("request")

class HTTPHandler {
    constructor(data) {
        this.uri = Constants.API_URL
    }
    
    sendRequest(method, endpoint, body, auth, isJSON) {
        request({ "method": method,
            "uri": `${this.uri}${endpoint}`,
            "body": body,
            headers: {
                'Authorization': auth
            },
            json: isJSON
        }, (error, response, body) => {
            return new Promise((resolve, reject) => {
                if (!error && response.statusCode == 429) {
                    reject(new Error("You are being Rate Limited!")) 
                }
                
                if (error) {
                    reject(error);
                }
            });
        });
    }
}

module.exports = HTTPHandler;