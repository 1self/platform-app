(function() {
    var app = angular.module('main', []);

    app.controller('angular-application', function($scope, $location, $anchorScroll) {
        
        $scope.selectTab = function(setTab) {
            this.tab = setTab;
             $(window).scrollTop(0);
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
