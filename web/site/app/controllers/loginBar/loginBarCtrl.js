angular.module("magiciansBattle").controller("loginBarCtrl", function ($scope, $rootScope, userService) {
    userService.fetchUser();

    $scope.getUser = userService.getUser;
});