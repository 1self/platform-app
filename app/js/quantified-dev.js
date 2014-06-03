var qd = function() {
    var result = {};
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
        var populateBuildTilesData = function(buildEvents) {
            var todaysBuild = buildEvents[buildEvents.length - 1]; // last record
            var yesterdaysBuild = buildEvents[buildEvents.length - 2];
            var totalBuildsForToday = todaysBuild.passed + todaysBuild.failed;
            var totalBuildsForYesterday = yesterdaysBuild.passed + yesterdaysBuild.failed;
            result.todaysPassedBuildCount = todaysBuild.passed;
            result.todaysFailedBuildCount = todaysBuild.failed;
            result.todaysTotalBuildCount = totalBuildsForToday;
            result.totalBuildComparison = compare(totalBuildsForToday, totalBuildsForYesterday);
            result.passedBuildComparison = compare(todaysBuild.passed, yesterdaysBuild.passed);
            result.failedBuildComparison = compare(todaysBuild.failed, yesterdaysBuild.failed);
        }
        $.ajax({
            url: url("mydev"),
            headers: {
                "Authorization": result.readToken,
                "Content-Type": "application/json"
            },
            success: function(buildEvents) {
                $("#stream-id-errors").text("");
                result.buildEvents = buildEvents;
                populateBuildTilesData(buildEvents);
                modelUpdateCallbacks.forEach(function(c) {
                    c();
                });
            },
            error: function(error) {
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
            success: function(wtfEvents) {
                result.wtfEvents = wtfEvents;
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


    result.tweetBuildSparkline = function() {
        var totalBuilds = [];
        result.buildEvents.map( function(buildEvent) {
            totalBuilds.push(buildEvent.passed+buildEvent.failed);
        });
        var sparkBar = window.oneSelf.toSparkBars(totalBuilds);
        var tweetText = sparkBar +  " my builds over the last 2 weeks. See yours at quantifieddev.org";
        var hashTags = ['code'].join(',');
        var tweetMyBuilds = $('#tweetMyBuilds').attr('href', "https://twitter.com/share?url=''&hashtags=" + hashTags + "&text=" + tweetText);
    };

    result.tweetWtfSparkline = function() {
        var totalWtfs = [];
        result.wtfEvents.map( function(wtfEvent) {
            totalWtfs.push(wtfEvent.wtfCount);
        });
        var sparkBar = window.oneSelf.toSparkBars(totalWtfs);
        var tweetText = sparkBar +  " my WTFs over the last 2 weeks. The only measure of code quality. See yours at quantifieddev.org";
        var hashTags = ['wtf', 'code'].join(',');
        var tweetMyWtfs = $('#tweetMyWtfs').attr('href', "https://twitter.com/share?url=''&hashtags=" + hashTags + "&text=" + tweetText);
    };

    return result;
}

window.qd = qd();