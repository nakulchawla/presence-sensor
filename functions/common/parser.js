var List = require("collections/list")
var IntervalForUpdateRequired = 30 * 1000;

exports.updateRequiredStatus = function (jsonObject, roomId, roomStatus) {
    if (jsonObject.hasOwnProperty(roomId)) {
        var room = jsonObject[roomId];
//        var currentTime = Date.now();
//        if (roomStatus || (currentTime - room.Time) > IntervalForUpdateRequired) {
        room.Time = Date.now();
        room.Status = roomStatus;
//        }
    }
    return jsonObject;
}

exports.convertToClientObject = function (jsonObject) {
    var rooms = new List();
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var room = jsonObject[key];
            var status = room.Status;
            var roomName = key.charAt(0).toUpperCase() + key.slice(1).toLocaleLowerCase();
            rooms.add({key, roomName, status});
        }
    }
    return rooms;
}