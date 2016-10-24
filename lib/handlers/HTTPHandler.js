"use strict";

var Constants = require("../Consts");
var request = require("request")
var uri = Constants.API_URL

class HTTPHandler {
    sendRequest(method, endpoint, body, auth, isJSON) {
        request({ "method": method,
            "uri": `${uri}${endpoint}`,
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