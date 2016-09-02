angular.module("magiciansBattle").controller("loginCtrl", function ($scope, $rootScope, $http, $location, $timeout, userService) {
    $scope.user = null;
    userService.getUser().then(function (user) {
        $scope.user = user;
    });

    $scope.loading = false;

    $scope.showRegisterDialog = function () {

    };

});