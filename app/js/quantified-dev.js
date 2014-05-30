var qd = function() {
    var result = {

    };

    var modelUpdateCallbacks = [];

    var updateStreamIdAndReadToken = function() {
        result.streamId = window.localStorage.streamId;
        result.readToken = window.localStorage.readToken;
    };

    updateStreamIdAndReadToken();

    var url = function(resource) {
        var result = "";
        if (location.hostname == "localhost") {
            result = "http://" + location.hostname + ":5000/quantifieddev/" + resource + "/" + window.localStorage.streamId;
        } else {
            result = "http://quantifieddev.herokuapp.com/quantifieddev/" + resource + "/" + window.localStorage.streamId;
        }

        return result;
    }

    var compare = function(todaysEvents, yesterdayEvents) {

        var difference = todaysEvents - yesterdayEvents;
        var percentChange = (difference / yesterdayEvents) * 100;
        return Math.ceil(percentChange);
    }
    result.updateBuildModel = function() {
        $.ajax({
            url: url("mydev"),
            headers: {
                "Authorization": result.readToken,
                "Content-Type": "application/json"
            },
            success: function(allEvents) {
                $("#stream-id-errors").text("");
                result.allEvents = allEvents;
                var todaysBuild = allEvents[allEvents.length - 1]; // last record
                var yesterdaysBuild = allEvents[allEvents.length - 2];
                var totalBuildsForToday = todaysBuild.passed + todaysBuild.failed;
                var totalBuildsForYesterday = yesterdaysBuild.passed + yesterdaysBuild.failed;
                result.todaysPassedBuildCount = todaysBuild.passed;
                result.todaysFailedBuildCount = todaysBuild.failed;
                result.todaysTotalBuildCount = totalBuildsForToday;
                result.totalBuildComparison = compare(totalBuildsForToday, totalBuildsForYesterday);
                result.passedBuildComparison = compare(todaysBuild.passed, yesterdaysBuild.passed);
                result.failedBuildComparison = compare(todaysBuild.failed, yesterdaysBuild.failed);
                modelUpdateCallbacks.forEach(function(c) {
                    c();
                });
            },
            error: function(error) {
                console.info("wrong stream id or read token : " + JSON.stringify(error));
                $("#stream-id-errors").text("Incorrect streamid or read token!");
            }
        });
    }

    result.updateWTFModel = function() {
        $.ajax({
            url: url("mywtf"),
            headers: {
                "Authorization": result.readToken,
                "Content-Type": "application/json"
            },
            success: function(allWTFEvents) {
                result.allWTFEvents = allWTFEvents;
                result.plotWTFHistory();
            }
        });
    }

    result.save = function(streamId, readToken) {
        window.localStorage.streamId = streamId;
        window.localStorage.readToken = readToken;
        updateStreamIdAndReadToken();
        result.updateBuildModel();
        result.updateWTFModel();
    }

    result.registerForBuildModelUpdates = function(callback) {
        modelUpdateCallbacks.push(callback);
    }

    if (result.streamId && result.readToken) {
        result.updateBuildModel();
        result.updateWTFModel();
    }

    return result;
}

window.qd = qd();