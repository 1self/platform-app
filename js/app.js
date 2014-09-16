(function() {
    var qdApp = angular.module('qdApp', ["ngRoute", "hljs"]);

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
            when('/privacy', {
                templateUrl: 'privacy.html'
            }).
             when('/contribute', {
                templateUrl: 'contribute.html'
            }).
            
            otherwise({
                redirectTo: '/home'
            });
        }
    ]);

    qdApp.controller('angular-application', function($scope, $location, $anchorScroll) {


        $scope.scrollTo = function(elementId) {
            $location.hash(elementId);
            $anchorScroll();
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        }

        $scope.handleTopButton = function(elementId, buttonId) {
            var scrollTop = $(window).scrollTop();
            var elementOffset = $(elementId).offset().top;
            var distance = (elementOffset - scrollTop);
            if (distance < 20) {
                $(buttonId).show();
            } else {
                $(buttonId).hide();
            }
        }


    });
    qdApp.controller('downloadCtrl', ['$scope', '$http', '$anchorScroll',
        function($scope, $http, $anchorScroll) {
            $(window).unbind('scroll');
            $(window).scroll(function() {
                $scope.$parent.handleTopButton("#plug-in-conatiner", "#top-button")
            });

            if (window.location.href.indexOf("sublime-text3") > -1) {
                $scope.$parent.scrollTo('sublime-text3');
            }
            if (window.location.href.indexOf("intellij") > -1) {
                $scope.$parent.scrollTo('intellij');
            }
            if (window.location.href.indexOf("visual-studio-details") > -1) {
                $scope.$parent.scrollTo('visual-studio-details');
            }
        }
    ]);

    qdApp.controller('moreInfoCtrl', ['$scope', '$http',
        function($scope, $http) {


            var element = $('.carousel');
            if (element) {
                element.carousel({
                    interval: 2000
                })
            }


            $(window).unbind('scroll');
            $(window).scroll(function() {
                $scope.$parent.handleTopButton("#videoContainer", "#top-button-on-more-info")
            });
        }
    ]);


})();
