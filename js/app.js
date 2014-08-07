(function() {
    var app = angular.module('main', []);

    app.controller('angular-application', function($scope, $location, $anchorScroll) {

        $scope.selectTab = function(setTab) {
            this.tab = setTab;
            $(window).scrollTop(0);
            if (setTab == 2) {

                setTimeout(
                    function() {
                        $('.carousel').carousel({
                            interval: 2000
                        })
                    }, 5000);
            }
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
