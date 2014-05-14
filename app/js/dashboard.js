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
	window.qd.registerForModelUpdates(function() {
		$("#builds-x").text(window.qd.todaysTotalBuildCount);
		$("#total-build-comparison").text(Math.abs(window.qd.totalBuildComparison) + "%");
		if (window.qd.totalBuildComparison < 0) {
			$("#total-build-comparison").addClass("icon-caret-down");
		} else if (window.qd.totalBuildComparison > 0) {
			$("#total-build-comparison").addClass("icon-caret-up");
		}

		$("#passed-x").text(window.qd.todaysPassedBuildCount);
		$("#passed-build-comparison").text(Math.abs(window.qd.passedBuildComparison) + "%");
		if (window.qd.passedBuildComparison < 0) {
			$("#passed-build-comparison").addClass("icon-caret-down");
		} else if (window.qd.passedBuildComparison > 0) {
			$("#passed-build-comparison").addClass("icon-caret-up");
		}

		$("#failed-x").text(window.qd.todaysFailedBuildCount);
		$("#failed-build-comparison").text(Math.abs(window.qd.failedBuildComparison) + "%");
		if (window.qd.failedBuildComparison < 0) {
			$("#failed-build-comparison").addClass("icon-caret-down");
		} else if (window.qd.failedBuildComparison > 0) {
			$("#failed-build-comparison").addClass("icon-caret-up");
		}
	});
});