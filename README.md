# Presen sensor Api server
------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------

Available Api description will be following:-

AuthenticateUser
api/v1/user/authenticate	-> PUT	-> "Headers(Authorization:- token, device-id:-userId, (Optional)device-token:pushToken)"

RegisterDevice
api/v1/user/device	-> PUT	-> Headers(Authorization:- token, device-token:pushToken)

Fetch Rooms status
api/v1/rooms	-> GET	-> "Headers(Authorization:- token)"

Api for Resberry pi device			
Update Room status
api/v1/room/:roomId	-> PUT	-> "Headers(Authorization:- token)"
body :  { "isEmpty": true }
