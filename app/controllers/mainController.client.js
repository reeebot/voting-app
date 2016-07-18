'use strict';

(function () {
   angular
      .module('votingApp', ['ngResource', 'ui.bootstrap'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {         
         var Click = $resource('/api/clicks');
         
         $scope.getClicks = function () {
            Click.get(function (results) {
               $scope.clicks = results.github.nbrClicks;
            });
         };
         
         $scope.getClicks();

         $scope.addClick = function () {
            Click.save(function () {
               $scope.getClicks();
            });
         };
         $scope.resetClicks = function () {
            Click.remove(function () {
               $scope.getClicks();
            });
         };
      }])
      .controller('pollController', ['$scope', '$resource', function ($scope, $resource) {         
         var Poll = $resource('/api/polls');
         $scope.polls = Poll.query();
         
         $scope.newPoll = function(form) {
            Poll.save(form);
            $scope.form = [];
            $scope.polls = Poll.query();
         };
         $scope.addVote = function(pollid, optionid) {
            var Vote = $resource('/api/polls/vote/'+pollid+'/'+optionid);
            Vote.save();
            $scope.polls = Poll.query();
         };

      }])
      .controller('userController', ['$scope', '$resource', function ($scope, $resource) {
         var User = $resource('/api/user');
         
         $scope.loadUser = function () {
            User.get(function (results) {
               $scope.id = results.id;
               $scope.username = results.username;
               $scope.repos = results.publicRepos;
               $scope.name = results.displayName;
            });
         };
         
         $scope.loadUser();
      }])
      .controller('panelController', ['$scope', function ($scope) {
         $scope.tab = 1;

         this.selectTab = function(setTab) {
            $scope.tab = setTab;
         }
         this.isSelected = function(checkTab){
            return $scope.tab === checkTab;
         };
      }]);

})();