var signup = function() {
    window.location.href = (window.location.hostname == "localhost") ?
        "http://localhost:5000/auth/github" :
        "http://app.quantifieddev.org/auth/github";
};


var goToTop = function(){
	$('html,body').animate({
          scrollTop: 0
        }, 500);

}
var resetScroll = function(){
	window.scrollTo(0,0);
}