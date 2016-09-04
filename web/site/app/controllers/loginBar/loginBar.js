angular.module("magiciansBattle").controller("loginBarCtrl", function ($scope, $rootScope, $http, $location, $timeout, userService) {
    $scope.user = null;
    userService.getUser().then(function (user) {
        $scope.user = user;
    });

});