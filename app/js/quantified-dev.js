var qd = function() {
    var result = {

    };

    var modelUpdateCallbacks = [];

    result.streamId = window.localStorage.streamId;
    result.readToken = window.localStorage.readToken;

    result.updateModel = function() {
        $.ajax({
            url: "http://quantifieddev.herokuapp.com/quantifieddev/mydev/" + result.streamId,
            headers: {
                "Authorization": result.readToken,
                "Content-Type": "application/json"
            },
            success: function(allEvents, error) {
                console.log("all events are " + allEvents);
                result.allEvents = allEvents;
                var todaysBuild = allEvents[allEvents.length - 1]; // last record
                var totalTodaysBuilds = todaysBuild.passed + todaysBuild.failed;
                result.todaysTotalBuildCount = totalTodaysBuilds;

                modelUpdateCallbacks.forEach(function(c) {
                    c();
                });

            }
        });
    }

    result.save = function(streamId, readToken) {
        window.localStorage.streamId = streamId;
        window.localStorage.readToken = readToken;
        result.streamId = streamId;
        result.readToken = readToken;
        // result.updateModel();
    }

    result.registerForModelUpdates = function(callback) {
        modelUpdateCallbacks.push(callback);
        if (result.allEvents) {
            callback();
        }
    }

    if(result.streamId && result.readToken){
        result.updateModel();
    }

    return result;
}

window.qd = qd();