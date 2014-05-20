var qd = function() {
    var result = {

    };

    var modelUpdateCallbacks = [];

    var updateStreamIdAndReadToken = function() {
        result.streamId = window.localStorage.streamId;
        result.readToken = window.localStorage.readToken;
    };

    updateStreamIdAndReadToken();

    var url = function() {
        var result = "";
        if (location.hostname == "localhost") {
            result = "http://" + location.hostname + ":5000/quantifieddev/mydev/" + window.localStorage.streamId;
        } else {
            result = "http://quantifieddev.herokuapp.com/quantifieddev/mydev/" + window.localStorage.streamId;
        }

        return result;
    }

    var compare = function(todaysBuilds, yesterdayBuilds) {

        var difference = todaysBuilds - yesterdayBuilds;
        var percentChange = (difference / yesterdayBuilds) * 100;
        return Math.ceil(percentChange);
    }
    result.updateModel = function() {
        $.ajax({
            url: url(),
            headers: {
                "Authorization": result.readToken,
                "Content-Type": "application/json"
            },
            success: function(allEvents, error) {
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

            }
        });
    }

    result.save = function(streamId, readToken) {
        window.localStorage.streamId = streamId;
        window.localStorage.readToken = readToken;
        updateStreamIdAndReadToken();
        result.updateModel();
    }

    result.registerForModelUpdates = function(callback) {
        modelUpdateCallbacks.push(callback);
        if (result.allEvents) {
            callback();
        }
    }

    if (result.streamId && result.readToken) {
        result.updateModel();
    }

    return result;
}

window.qd = qd();