var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var cron = require('node-cron');
var Room = require('../models/room');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('functions/client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), scheduleCalenderCheck);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


function scheduleCalenderCheck(auth){
  cron.schedule('*/1 * * * *', function(){
    checkStatusForAllRooms(auth);
  });
}

function checkStatusForAllRooms(auth) {
  console.log(checkStatusForAllRooms);
  Room.find(function(error, items){
    if (error) {
      response.status(500).send(error);
      return;
    }
    items.forEach(function(value) {
      checkIfRoomBooked(auth, value);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function checkIfRoomBooked(auth, room) {
  var calendar = google.calendar('v3');

  calendar.events.list({
    auth: auth,
    calendarId: room.calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err + ' ' + (new Date()).toISOString());
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      room.isBooked = false;
      room.save();
    } else {
      var event = events[0];
      var currentTime = new Date();
      var eventStartTime = new Date(event.start.dateTime);
      var eventEndTime = new Date(event.end.dateTime);

      var eventStartDate = new Date(event.start.date);
      var eventEndDate = new Date(event.end.date);

      if (event.start.dateTime && event.end.dateTime) {
        // console.log(room.name);
        // console.log('Start Time : ' + event.start.dateTime);
        // console.log('End Time : ' + event.end.dateTime);
        // console.log('Event Name: ' + event.summary)
        // console.log('Organiser : ' + event.organizer.email + " " + event.organizer.displayName)
        if (eventStartTime <= currentTime && eventEndTime > currentTime) {
          // console.log('%s - %s', eventStartTime, event.summary);
          room.isBooked = true;
          room.bookedBy = {name: event.creator.displayName, email: event.creator.email, startDate: event.start.dateTime, endDate: event.end.dateTime};
          room.save();
        }else {
          room.isBooked = false;
          room.bookedBy = undefined;
          room.save();
        }
      } else if (eventStartDate && eventEndDate) {
        // console.log(room.name);
        // console.log('Start Date : ' + event.start.date);
        // console.log('End Date : ' + event.end.date);
        // console.log('Event Name: ' + event.summary)
        // console.log('Organiser : ' + event.organizer.email + " " + event.organizer.displayName)
        if (eventStartDate <= currentTime && eventEndDate > currentTime) {
          // console.log('%s - %s', eventStartTime, event.summary);
          room.isBooked = true;
          room.bookedBy = {name: event.creator.displayName, email: event.creator.email, startDate: event.start.date, endDate: event.end.date};
          room.save();
        }else {
          room.isBooked = false;
          room.bookedBy = undefined;
          room.save();
        }
      }


      //if (room.calendarId == "quovantis.com_2d3335323438363337343334@resource.calendar.google.com") {

      //}
      // for (var i = 0; i < events.length; i++) {
      //   var event = events[i];
      //   var start = event.start.dateTime || event.start.date;
      //   console.log('%s - %s', start, event.summary);
      // }
    }
  });
}
