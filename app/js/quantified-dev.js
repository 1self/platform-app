var qd = function() {
    var result = {

    };

    var callbacks = [];
    result.save = function(streamId, readToken) {
        result.streamId = streamId;
        result.readToken = readToken;
        callbacks.forEach(function(c) {
            c();
        });
    }

    result.registerOnSave = function(callback) {
        callbacks.push(callback);
    }
    return result;
}

window.qd = qd();