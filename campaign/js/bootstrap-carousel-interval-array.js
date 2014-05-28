var intervalArray = function() {

    var debug = console.log.bind(console);
    debug = function() {}; // comment this out to get logging

    var arrayAnimation = function(carousel) {
        if (!(carousel.dataset.intervalArray == "true")) {
            return;
        }

        carousel = $(carousel);
        var timings = [];
        var index = 0;
        var animate = true;

        var animationItems = $(carousel).find('.item');
        animationItems.map(function(index, item) {
            timings.push(+(item.dataset.arrayStepPause));
        })

        var nextAnimation = function(timings) {
            if (animate) {
                index += 1;
                index = index % timings.length;
                carousel.find('.item').removeClass('active');
                carousel.find('.item').eq(index).addClass('active');
                carousel.find('.carousel-indicators li').removeClass('active');
                carousel.find('.carousel-indicators li').eq(index).addClass('active');
            }

            debug("staying on step " + index + " for " + timings[index]);
            setTimeout(nextAnimation, timings[index], timings);
        }

        debug("staying on step " + index + " for " + timings[index]);
        setTimeout(nextAnimation, timings[index], timings);

        carousel.mouseover(function() {
            animate = false;
            debug("animate false");
        })
            .mouseleave(function() {
                animate = true;
                debug("animate true");
            });

        carousel.find('.left.carousel-control').click(function() {
            index -= 1;
            index = index % timings.length;
            index = Math.abs(index);
            debug(index);
        });

        carousel.find('.right.carousel-control').click(function() {
            console.log("moving from " + index);
            index += 1;
            index = index % timings.length;
            debug("to " + index);
        })
    }

    $(document).ready(function() {
        var carousels = $('.carousel');
        carousels.each(function(index, item) {
            arrayAnimation(item);
        })

    });

}

intervalArray();