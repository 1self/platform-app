(function() {
    var qdApp = angular.module('qdApp', ["ngRoute"]);

    qdApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/home', {
                templateUrl: 'home.html'

            }).
            when('/download', {
                templateUrl: 'download.html',
                controller: 'downloadCtrl'


            }).
            when('/contact', {
                templateUrl: 'contact.html'

            }).
            when('/more', {
                templateUrl: 'more-info.html',
                controller: 'moreInfoCtrl'

            }).
            otherwise({
                redirectTo: '/home'
            });
        }
    ]);

    qdApp.controller('angular-application', function($scope, $location, $anchorScroll) {

        $scope.selectTab = function(setTab) {
            this.tab = setTab;
            $(window).scrollTop(0);
            if (setTab == 2) {


                /*setTimeout(
                    function() {
                        $('.carousel').carousel({
                            interval: 2000
                        })
                    }, 5000);*/
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

        $scope.isActive = function(route) {
            return route === $location.path();
        }


    });
    qdApp.controller('downloadCtrl', ['$scope', '$http',
        function($scope, $http) {
            $(window).unbind('scroll');
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

            /*          showTopButton();*/
        }
    ]);

    qdApp.controller('moreInfoCtrl', ['$scope', '$http',
        function($scope, $http) {

        $scope.$watch(function() {
                return $("#myCarousel");
            },
            function(element) {
                if (element) {
                    $('.carousel').carousel({
                        interval: 2000
                    })
                }
            });

            $(window).unbind('scroll');
            $(window).scroll(function() {
                var scrollTop = $(window).scrollTop();
                var elementOffset = $('#videoContainer').offset().top;
                var distance = (elementOffset - scrollTop);
                if (distance) {
                    $("#top-button-on-more-info").show();
                } else {
                    $("#top-button-on-more-info").hide();
                }
            });
        }
    ]);


})();