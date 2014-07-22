var signup = function() {
	window.location.href = (window.location.hostname == "localhost") ?
		"http://localhost:5000/auth/github" :
		"http://app.quantifieddev.org/auth/github";
};