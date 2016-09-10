angular.module("magiciansBattle").controller("loginCtrl", function ($scope, userService) {
    $scope.loading = false;
    $scope.fields = {};
    $scope.errors = {};

    $scope.login = function () {
        $scope.loading = true;
        userService.login($scope.fields).then(function () {
            $("#login-modal").foundation("close");
        }, function () {
            $scope.errors.generalErrors = ["Wrong email or password"];
        }).finally(function () {
            $scope.loading = false;
        });
    };

});