(function() {
    var app = angular.module('main', []);

    app.controller('angular-application', function() {
        this.tab = 1;
        this.selectTab = function(setTab) {
            this.tab = setTab;
        };
    });

})();
