var express = require('express');
var Room = require('../models/room');
var googleCalendar = require('./GoogleCalendar.js');
var roomRouter = express.Router();
const { check, validationResult } = require('express-validator/check');

roomRouter
  .route('/v1/rooms')
  .get(function(request, response){
    console.log('GET /rooms');

    Room.find(function(error, items){
      if (error) {
          response.status(500).send(error);
          return;
      }
      // console.log(items);
      response.json(items);
    });
  })

roomRouter
  .route('/v1/room/:roomId')
  .post([
    check('isEmpty').isBoolean()
  ],
  function(request, response){

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.mapped() });
    }
    var roomId = request.params.roomId;

    Room.findOne({id: roomId}, function(error, room) {

      if (error) {
        // console.log('error');
        response.status(500).send(error);
      }

      if (room) {
        room.isEmpty = request.body.isEmpty;

        room.save();

        console.log("Status changed for " + room.name + " to " + (room.isEmpty ? "empty" : "not empty") + " at " + (new Date()));
        response.json(room);
        return;
      }

      response.status(404).json({
        message: 'Room with id ' + roomId + ' was not found.'
      });
    });
  })
  .get(function(request, response){
    var roomId = request.params.roomId;
    Room.findOne({id: roomId}, function(error, room) {

      if (error) {
        console.log('error');
        response.status(500).send(error);
      }

      if (room) {
        response.json(room);
        return;
      }

      response.status(404).json({
        message: 'Room with id ' + roomId + ' was not found.'
      });
    });
  });


roomRouter
  .route('/v1/room/:roomId/book')
  .post(function(request, response){
    response.status(400).json({
      message: 'API not available'
    });
  });

module.exports = roomRouter;
