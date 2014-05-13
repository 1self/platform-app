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
		$("#passed-x").text(window.qd.todaysPassedBuildCount);
		$("#failed-x").text(window.qd.todaysFailedBuildCount);
	});
});