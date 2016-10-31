var captainListController = require('./captainList.controller.js');
// webpack will load the html. Nifty, eh?
require('./captainList.html');
// webpack will load this scss too! 
require('./captainList.scss');

module.exports = angular.module('startrekApp.captainList', [])
.controller( 'CaptainListController', ['$scope', captainListController]);
