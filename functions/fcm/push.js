var FCM = require('fcm-node');
var serverKey = 'AIzaSyD0OGVK0vVx19p-LDJ08Afj0kBBCj_2y1g'
var fcm = new FCM(serverKey);
var FS = require("fs");

exports.fireNotifications = function () {
    var path = process.cwd() + "/functions/data/tokens.json";
    try {
        FS.readFile(path, 'utf-8', function (err, data) {
            data = JSON.parse(data);
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    fireNotification(data[key]);
                }
            }
        });
    } catch (e) {
        console.log(e.message)
    }
}
function fireNotification (registrationId) {
    var message = {
        to: registrationId,
        collapse_key: 'none',

        data: {
            my_key: 'Room Status Updated',
            my_another_key: 'Status Changed'
        }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Push failed!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}