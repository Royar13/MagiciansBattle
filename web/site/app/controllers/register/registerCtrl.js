angular.module("magiciansBattle").controller("registerCtrl", function ($scope, $rootScope, $http, userService) {
    $scope.loading = false;
    $scope.fields = {};
    $scope.errors = {};
    $scope.accountCreated = false;

    $scope.register = function () {
        $scope.loading = true;
        $http({
            method: "post",
            url: $rootScope.apiUrl("account/register"),
            data: $scope.fields
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success) {
                $scope.accountCreated = true;
                userService.login();
            }
            else {
                $scope.errors = response.data.errors;
            }
        });
    };
});