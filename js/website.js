var signup = function() {
    window.location.href = (window.location.hostname == "localhost") ?
        "http://localhost:5000/auth/github" :
        "http://app.quantifieddev.org/auth/github";
};
var showTopButton = function() {
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var elementOffset = $('#plug-in-conatiner').offset().top;
        var distance = (elementOffset - scrollTop);
        if (distance < 20) {
            $("#top-button").show();
        } else {
            $("#top-button").hide();
        }
    });

}
var goToTop = function(){
	$('html,body').animate({
          scrollTop: 0
        }, 500);

}