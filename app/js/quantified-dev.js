var qd = function() {
    var result = {

    };

    result.streamId = window.localStorage.streamId;
    result.readToken = window.localStorage.readToken;

    var callbacks = [];
    result.save = function(streamId, readToken) {
        window.localStorage.streamId = streamId;
        window.localStorage.readToken = readToken;
        result.streamId = streamId;
        result.readToken = readToken;
        callbacks.forEach(function(c) {
            c();
        });
    }

    result.registerOnSave = function(callback) {
        callbacks.push(callback);
        if (result.streamId && result.readToken) {
            callback();
        }
    }
    return result;
}

window.qd = qd();