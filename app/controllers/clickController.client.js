'use strict';

(function () {
   angular
      .module('votingApp', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {         
         var Click = $resource('/api/clicks');
         
         $scope.getClicks = function () {
            Click.get(function (results) {
               $scope.clicks = results.nbrClicks;
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
      }]);

})();

/*
'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
*/
