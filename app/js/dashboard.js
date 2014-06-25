$('#auth-save').click(function() {
	var streamId = $('#stream-id').val();
	var readToken = $('#read-token').val();
	window.qd.save(streamId, readToken);
});

$("#stream-id").ready(function() {
	$("#stream-id").val(window.qd.streamId);
});

$("#read-token").ready(function() {
	$("#read-token").val(window.qd.readToken);
});

$("#builds-x").ready(function() {
	window.qd.registerForBuildModelUpdates(function() {
		var displayBuildCountAndBuildComparison = function(buildCount, buildCountElementId, comparisonValue, comparisonElementId) {
			$(buildCountElementId).text(buildCount);
			var buildComparison = Math.abs(comparisonValue);
			if (buildComparison && buildComparison !== Infinity) {
				$(comparisonElementId).text(buildComparison + "%");
				if (comparisonValue < 0) {
					$(comparisonElementId).addClass("icon-caret-down");
				} else if (comparisonValue > 0) {
					$(comparisonElementId).addClass("icon-caret-up");
				}
			}
		};

		displayBuildCountAndBuildComparison(window.qd.todaysTotalBuildCount, "#builds-x", window.qd.totalBuildComparison, "#total-build-comparison");
		displayBuildCountAndBuildComparison(window.qd.todaysPassedBuildCount, "#passed-x", window.qd.passedBuildComparison, "#passed-build-comparison");
		displayBuildCountAndBuildComparison(window.qd.todaysFailedBuildCount, "#failed-x", window.qd.failedBuildComparison, "#failed-build-comparison");
	});
});

// redirect to node app dashboard 
var getURLParameter = function(name) {
	return decodeURIComponent(
		(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
	);
}

var streamId = getURLParameter("streamId");
var readToken = getURLParameter("readToken");

var redirectUrl = (window.location.hostname === "localhost") ?
	"http://localhost:5000/dashboard" :
	"http://app.quantifieddev.org/dashboard";

if (streamId !== "null" && readToken !== "null") {
	redirectUrl += "?streamId=" + encodeURIComponent(streamId) + "&readToken=" + encodeURIComponent(readToken);
}
window.location.replace(redirectUrl);