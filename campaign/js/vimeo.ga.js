/*!
 * vimeo.ga.js | v0.1
 * Copyright (c) 2012 Sander Heilbron (http://sanderheilbron.nl)
 * MIT licensed
 */

$(function () {
    var category = "vimeo";
    if (vimeoCategory)
        category = vimeoCategory;

    var f;
    f = $('#vimeoPlayer');

    var url = f.attr('src').split('?')[0],
        trackProgress = f.data('progress'), // Data attribute to enable progress tracking
        trackSeeking = f.data('seek'); // Data attribute to enable seek tracking

    // Listen for messages from the player
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    } else {
        window.attachEvent('onmessage', onMessageReceived, false);
    }

    // Handle messages received from the player
    function onMessageReceived(e) {
        var data = JSON.parse(e.data);

        switch (data.event) {
        case 'ready':
            onReady();
            break;

        case 'playProgress':
            onPlayProgress(data.data);
            break;

        case 'seek':
            if (trackSeeking && !videoSeeking) {
                //ga('send', 'event', 'category', 'action', 'label');
                ga('send', 'event', category, 'Skipped video forward or backward');
                videoSeeking = true; // Avoid subsequent seek trackings
            }
            break;

        case 'play':
            if (!videoPlayed) {
                ga('send', 'event', category, 'Started video');
                videoPaused = false;
                videoPlayed = true; //  Avoid subsequent play trackings
            }
            break;

        case 'pause':
            if (timePercentComplete < 100 && !videoPaused) {
                ga('send', 'event', category, 'Paused video');
                videoPaused = true; // Avoid subsequent pause trackings
            }
            break;

        case 'finish':
            if (!videoCompleted) {
                ga('send', 'event', category, 'Completed video');
                videoCompleted = true; // Avoid subsequent finish trackings
            }
            break;
        }
    }

    // Helper function for sending a message to the player
    function post(action, value) {
        var data = {
            method: action
        };

        if (value) {
            data.value = value;
        }

        f[0].contentWindow.postMessage(JSON.stringify(data), url);
    }

    function onReady() {
        post('addEventListener', 'play');
        post('addEventListener', 'seek');
        post('addEventListener', 'pause');
        post('addEventListener', 'finish');
        post('addEventListener', 'playProgress');
        progress25 = progress50 = progress75 = false;
        videoPlayed = false;
        videoSeeking = false;
        videoCompleted = false;
    }

    // Tracking video progress 
    function onPlayProgress(data) {
        timePercentComplete = (data.percent) * 100;
        timePercentComplete = Math.round(timePercentComplete); // Round to a whole number
        var progressTracked;

        if (timePercentComplete > 24 && !progress25) {
            progress = 'Played video: 25%';
            progress25 = true;
            progressTracked = true;
        }

        if (timePercentComplete > 49 && !progress50) {
            progress = 'Played video: 50%';
            progress50 = true;
            progressTracked = true;
        }

        if (timePercentComplete > 74 && !progress75) {
            progress = 'Played video: 75%';
            progress75 = true;
            progressTracked = true;
        }

        if (progressTracked && trackProgress) {
            ga('send', 'event', category, progress);
        }
    }

});