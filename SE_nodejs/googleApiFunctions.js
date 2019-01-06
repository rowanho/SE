/*
request functions for the google calendar api
these all require an auth object
in our case, the auth object is our jwtclient(service account)
general format is function(calendarId,authInput,[parameters],callback)
*/

//checks if busy at certain time, returns 'busy' or 'notBusy'
const {google} = require('googleapis');
const calendar = google.calendar('v3');

function checkBusy(calendarId, authInput, startTime, endTime,callback) {
    calendar.events.list({ // lists items from the calendar
        auth: authInput,
        calendarId: calendarId,
        timeMin: startTime,
        timeMax:endTIme
    }, function(err, response) {
        if (err) {
            callback(err)
        } else {
            if(response.data.items.length == 0){ // check if any events clashed
                callback(false,'notBusy');
            }
            else{
                callback(false,'busy')
            }
        }
    });
}

function addEvent(calendarId,authInput,startTime,endTime,summary,eventId,callback){
    calendar.events.insert({
        auth: authInput,
        calendarId: calendarId,
        resource:{
            start:{dateTime:startTime,timeZone:'Europe/London'},
            end: {dateTime:endTime,timeZone:'Europe/London'},
            summary:summary,
            id: eventId
        }  
    },function(err,response){
        if(err){
            callback(err);
        }
        else{
            callback(false);
        }
    });

}

//deletes event with given ID
function deleteEvent(calendarId,authInput,eventId,callback){
    calendar.events.delete({
        auth:authInput,
        calendarId:calendarId,
        eventId:eventId
    },function(err,response){
        if(err){
            if(typeof callback === "function"){
                callback(err);
            }   
        }
        else{
            if(typeof callback === "function"){
                callback(false);
            }
        }
    });
}

function getEvent(calendarId,authInput,eventId,callback){
    calendar.events.get({
        auth:authInput,
        calendarId:calendarId,
        eventId:eventId
    }, function(err,response){
        if(err){
            callback(err);
        }
        else{
            callback(false,response);
        }
    });
}
module.exports.checkBusy = checkBusy;
module.exports.addEvent = addEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEvent  = getEvent;