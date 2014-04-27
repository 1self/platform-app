$('#auth-save').click(function() {
    var streamId = $('#stream-id').val();
    var readToken = $('#read-token').val();
    window.qd.save(streamId, readToken);
});