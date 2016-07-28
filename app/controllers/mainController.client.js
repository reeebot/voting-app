'use strict';

(function () {
   angular
      .module('votingApp', ['ngResource', 'ui.bootstrap', 'ngRoute'])
      .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
         $routeProvider.

            when('/', {
                templateUrl : '/public/main.html',
                controller  : 'pollController'
            }).

            when('/newpoll', {
                templateUrl : '/public/newpoll.html',
                controller  : 'pollController'
            }).

            when('/profile', {
                templateUrl : '/public/profile.html',
                controller  : 'userController'
            }).

            when('/poll/:id', {
                templateUrl : '/public/poll.html',
                controller  : 'findPollController'
            }).

            when('/poll/:id/edit', {
                templateUrl : '/public/editpoll.html',
                controller  : 'findPollController'
            })

         // enable html5Mode for pushstate ('#'-less URLs)
         $locationProvider.html5Mode(true);
         $locationProvider.hashPrefix('!');

      }])
      .controller('panelController', ['$scope', '$location', function ($scope, $location) {
         $scope.isSelected = function(checkTab){
            return $location.url() === checkTab;
         };
      }])
      .controller('pollController', ['$scope', '$resource', '$location', '$window', function ($scope, $resource, $location, $window) {
         var Poll = $resource('/api/polls');
         $scope.polls = Poll.query();
         $scope.options = [{id: 0, 'votes': 0}, {id: 1, 'votes': 0}];
         
         var uPolls = $resource('/api/userpolls');
         $scope.userPolls = uPolls.query();
         
         $scope.newPoll = function() {
            var send = {
               'question': $scope.form,
               'options': $scope.options
            }
            Poll.save(send);
            $scope.form = {};
            $scope.options = [{id: 0, 'votes': 0}, {id: 1, 'votes': 0}];
            $location.path('/');
            $scope.polls = Poll.query();

         };

         $scope.delPoll = function(pollid) {
            var onePoll = $resource('/api/polls/'+pollid);
            if ($window.confirm('are you sure you want to delete the poll?')){
               onePoll.delete(function(){
                  $location.path('/profile');
                  $scope.userPolls = uPolls.query();
            });
            }
         };

         $scope.addChoice = function() {
            var newItemNo = $scope.options.length;
            $scope.options.push({'id': newItemNo, 'votes': 0});
         };

         $scope.delChoice = function(index) {
            if ($scope.options.length > 2) {
               $scope.options.splice(index, 1);
            }
         };

      }])
      .controller('userController', ['$scope', '$resource', function ($scope, $resource) {
         var User = $resource('/api/user');
         
         $scope.loadUser = function () {
            User.get(function (results) {
               $scope.id = results.id;
               $scope.username = results.username;
               $scope.userpic = results.userpic;
               $scope.email = results.email;
            });
         };
         
         $scope.loadUser();

      }])
      .controller('findPollController', ['$scope', '$resource', '$routeParams', '$location', function ($scope, $resource, $routeParams, $location) {
         $scope.findOnePoll = function(pollid) {
            var findPoll = $resource('/api/polls/'+pollid);
            $scope.singlePoll = findPoll.get();
         };
         var pId = $routeParams.id;
         $scope.findOnePoll(pId)


         $scope.editPoll = function(pollid) {
            var updatePoll = $resource('/api/polls/'+pollid);
            var send = {
               'question': $scope.singlePoll.name,
               'options': $scope.singlePoll.options
            }
            updatePoll.save(send, function() {
               $location.path('/profile');
               var uPolls = $resource('/api/userpolls');
               $scope.userPolls = uPolls.query();
            });
         };

         $scope.addChoice = function() {
            var newItemNo = $scope.singlePoll.options.length;
            $scope.singlePoll.options.push({'id': newItemNo, 'votes': 0});
         };

         $scope.delChoice = function(index) {
            if ($scope.singlePoll.options.length > 2) {
               $scope.singlePoll.options.splice(index, 1);
            }
         };

         $scope.addVote = function(pollid, optionid) {
            var Vote = $resource('/api/polls/vote/'+pollid+'/'+optionid);
            var Poll = $resource('/api/polls/'+pollid);
            Vote.save(function () {
               $scope.singlePoll = Poll.get();
            });
         };

      }]);

})();