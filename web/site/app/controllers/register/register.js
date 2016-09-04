angular.module("magiciansBattle").controller("registerCtrl", function ($scope, $rootScope, $http, $location, $timeout, userService) {
    $scope.loading = false;
    $scope.fields = {};
    $scope.errors = {};

    $scope.register = function () {
        $scope.loading = true;
        $scope.errors = {};
        $http({
            method: "post",
            url: $rootScope.apiUrl("account/register"),
            data: $scope.fields
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success) {
                alert("yay");
            }
            else {
                $scope.errors = response.data.errors;
            }
        });
    };
});