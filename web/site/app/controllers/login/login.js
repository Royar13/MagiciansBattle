angular.module("magiciansBattle").controller("loginCtrl", function ($scope, $rootScope, $http, $location, $timeout, userService) {
    $scope.user = null;
    userService.getUser().then(function (user) {
        $scope.user = user;
    });

    $scope.loading = false;
    $scope.fields = {};
    $scope.login = function () {
        $scope.errors = {};
        $scope.loading = true;
        userService.login($scope.fields).then(function (user) {
            $scope.user = user;
        }, function (errors) {
            $scope.loading = false;
            if (errors.length > 2) {
                errors = errors.slice(0, 1);
            }
            $scope.errors = errors;
            $scope.startMsgBoxTimer();
        });
    };

    $scope.fieldsFocus = false;
    $scope.boolMsgBoxTimer = false;
    var msgBoxTimer = null;
    $scope.startMsgBoxTimer = function () {
        if (msgBoxTimer != null) {
            $timeout.cancel(msgBoxTimer);
        }
        $scope.fieldsFocus = false
        $scope.boolMsgBoxTimer = true;
        msgBoxTimer = $timeout(function () {
            $scope.boolMsgBoxTimer = false;
        }, 4000);
    };

    $scope.showMsgBox = function () {
        return $scope.errors != null && ($scope.fieldsFocus || $scope.boolMsgBoxTimer);
    };

    $scope.showRegisterDialog = function () {
        $mdDialog.show({
            controller: "registerCtrl",
            templateUrl: $rootScope.templateUrl("register/register.html"),
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true
        }).then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
    };

});