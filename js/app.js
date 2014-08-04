(function() {
    var app = angular.module('main', []);

    app.controller('angular-application', function($scope, $location, $anchorScroll) {
        
        this.tab = 1;
        this.selectTab = function(setTab) {
            this.tab = setTab;
        };

        $scope.$watch(function() {
                return document.getElementById("codehighlighting");
            },
            function(element) {
                if (element) {
                    hljs.highlightBlock(document.getElementById("codehighlighting"));
                }
            });

        $scope.scrollTo = function(elementId) {
            $location.hash(elementId);
            $anchorScroll();
        };

    });
})();
