// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic', 'ionic.contrib.drawer', 'tabSlideBox', 'app.controllers'])

    //.config(['$ionicAppProvider', function($ionicAppProvider) {
    //    // Identify app
    //    $ionicAppProvider.identify({
    //        // The App ID (from apps.ionic.io) for the server
    //        app_id: '71862c36',
    //        // The public API key all services will use for this app
    //        api_key: '5ccde508774f7d5d4bbe3d9a3ca2a5f4e3d13a71b93da5aa'
    //        // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
    //        // gcm_id: 'YOUR_GCM_ID'
    //    });
    //}])

    //.config(function($mdIconProvider) {
    //    $mdIconProvider.iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
    //})

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.navBar.alignTitle('left');

        $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppController',
                resolve: {
                    $content: function(DataProvider) {
                        return DataProvider.all();
                    }
                }
        })

        .state('app.main', {
            url: "/main",
            views: {
                'menuContent': {
                    templateUrl: "templates/main.html",
                    controller: 'MainController'
                }
            }
        })

        .state('app.catalog', {
            url: "/catalog/:category",
            views: {
                'menuContent': {
                    templateUrl: "templates/catalog.html",
                    controller: 'CatalogController'
                }
            },
            resolve: {
                $content: function(DataProvider) {
                    return DataProvider.all();
                }
            }
        })

        .state('app.list', {
            url: "/list",
            views: {
                'menuContent': {
                    templateUrl: "templates/list.html",
                    controller: 'ListController'
                }
            },
                resolve: {
                    $content: function(DataProvider) {
                        return DataProvider.all();
                    }
                }
        })

        .state('app.about', {
            url: '/about/:tab',
            views: {
                'menuContent': {
                    templateUrl: 'templates/about.html',
                    controller: 'AboutController'
                }
            }
        })

        .state('app.contacts', {
            url: "/contacts",
            views: {
                'menuContent': {
                    templateUrl: "templates/contacts.html"
                }
            }
        })

            .state('app.contacts-by-regions', {
                url: "/contacts-by-regions",
                views: {
                    'menuContent': {
                        templateUrl: "templates/contacts-by-regions.html"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/main');
    })

    .directive('browseTo', function ($ionicGesture) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var handleTap = function (e) {
                    // todo: capture Google Analytics here
                    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
                };
                var tapGesture = $ionicGesture.on('tap', handleTap, $element);
                $scope.$on('$destroy', function () {
                    // Clean up - unbind drag gesture handler
                    $ionicGesture.off(tapGesture, 'tap', handleTap);
                });
            }
        }
    //})
    //
    //.directive('focusMe', function($timeout) {
    //    return {
    //        link: function($scope, $element, $attrs) {
    //            console.log($attrs.focusMe);
    //            if ($attrs.focusMe) {
    //                alert('focusMe');
    //                $timeout(function () {
    //                    $element[0].focus();
    //                    if (window.cordova && window.cordova.plugins.Keyboard) {
    //                        cordova.plugins.Keyboard.show();
    //                    }
    //                }, 150);
    //            }
    //        }
    //    };
    });
