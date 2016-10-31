(function () {
'use strict';

// we'll first 'require' the module
require('./modules/captain-list/');

var sabotage = angular.module('Sabotage', ['ngRoute', 'ngAnimate', 'startrekApp.captainList'])
  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        //$stateProvider
        //    .state('captainList', {
        //          url: '/captains',
        //          templateUrl: 'captainList.html',
        //          controller: 'CaptainListController',
        //    })

        $locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix('!');
        // routes
        $routeProvider
            .when("/", {
                templateUrl: "./partials/partial1.html",
                controller: "MainController"
            })
            .when("/captains", {
                templateUrl: 'captainList.html',
                controller: 'CaptainListController',
            })
            .otherwise({
                redirectTo: '/'
            });
    }
  ]);

sabotage
  .controller('MainController', [
    '$scope',
    function($scope) {
      $scope.test = "Testing...";
    }
  ]);

}());
