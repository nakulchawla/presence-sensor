
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var roomRouter = require('./routers/room');
var userRouter = require('./routers/user');
var http = require('http');
//
var app = express();
var server = http.createServer(app);





var HOST_NAME = 'localhost';
var DATABASE_NAME = 'presencesensor';
var PRIMARY_MASTER_KEY = 'eeA5Y70slx4gyLu51OhTN5c84YcwC46J3uDHkqWhHCJiGwIOiTO6cbr81SIjQ0cLaFtFfBDVmxHdvlw66JGHxQ=='

var mongoUri = 'mongodb://' + DATABASE_NAME + ':' +
                encodeURIComponent(PRIMARY_MASTER_KEY) + '@' + DATABASE_NAME +
                '.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';
mongoose.connect(mongoUri, function (err) {
                  if (err) {
                    console.log('Mongoose connect error: ' + err);
                    //  process.exit(1);
                  }else {


                    // app.listen(PORT, function () {
                    //   console.log('Listening on port ' + PORT);
                    // });
                  }

                })

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use('/api', roomRouter);
app.use('/api', userRouter);

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);










/*
{
  "additionalProperties": {
    "primaryReadonlyMasterKey": "mFrM6KyzF76re1UCHuP9f0dEjYHWDjeTQPYssE7515n9fLefnl7c5ZJzIHioS1s1BgT1olnCc8HEZnRgsOOfHg==",
    "secondaryReadonlyMasterKey": "VfNwQpurdUJ71QrEGuEke7BdcSUg4qE1Iu027rnjucEtJasnFFg3L0OCgPwGDpqOX3Ja6DiTNDo8SLg45QGOVA=="
  },
  "primaryMasterKey": "10x1d4VX7bP4Jx2gGCdrg9a0xiXrNsjfKiKQbfyOuVWUefVnwQiMqPSPVNsPHxp93nREequCDhYlHlXyn7hBIw==",
  "primaryReadonlyMasterKey": "mFrM6KyzF76re1UCHuP9f0dEjYHWDjeTQPYssE7515n9fLefnl7c5ZJzIHioS1s1BgT1olnCc8HEZnRgsOOfHg==",
  "secondaryMasterKey": "mcfV2ZC9qspKVAkozJZtHSjq6HsF1zFI09wWjWznXYdlzsccyfE8b8ha4L8j4VZmIoNR03BPeRRa7UMEVnULzg==",
  "secondaryReadonlyMasterKey": "VfNwQpurdUJ71QrEGuEke7BdcSUg4qE1Iu027rnjucEtJasnFFg3L0OCgPwGDpqOX3Ja6DiTNDo8SLg45QGOVA=="
}
*/
