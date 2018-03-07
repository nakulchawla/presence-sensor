var fs = require('fs')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: false,
  },
  floor: {
    type: Number,
    required: true,
  },
  calendarId: {
    type: String,
    unique: true,
    required: true,
  },
  isEmpty: {
    type: Boolean,
    required: true,
    default: true
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false
  },
  bookedBy: {
    name: String,
    email: String,
    startDate: String,
    endDate: String
  }
})

var Room = mongoose.model('Room',roomSchema);
module.exports = Room

Room.collection.drop();

fs.readFile('./functions/data/rooms.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  var rooms = JSON.parse(content);
  Room.collection.insert(rooms, function(err, docs) {
    if (err) {
      console.log("Failed to add record");
      return;
    }
    console.log("Record Added");
  });
});

// roomSchema.methods.updateRoomBookedStatus = function (status: Boolean) {
//
// }
//
// function updateRoomBookedStatus(status: Boolean) {
//
//       this.isEmpty = request.body.isEmpty;
//
//       room.save();
//
//       response.json(room);
//       return;
//     }
//
//     response.status(404).json({
//       message: 'Room with id ' + roomId + ' was not found.'
//     });
//   });
// }


// var room = new Room({id: 1, name: "Riverrun", capacity: 4})
// room.save(function(err) {
//   if (err) {
//     console.log("Failed to add record");
//   }
//   console.log("Record Added");
// });
