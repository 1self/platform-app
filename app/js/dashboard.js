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