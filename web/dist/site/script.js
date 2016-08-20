var app = angular.module("magiciansBattle", ["ngRoute"]);

app.run(function ($rootScope) {
    $rootScope.templateUrl = templateUrl;

    //$rootScope.$on("$routeChangeSuccess", function (ev, data) {
    //    if (data.$route && data.$route.controller)
    //        $rootScope.controller = data.$route.controller;
    //});
});

app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: templateUrl("home/home.html"),
                controller: "homeCtrl"
            })
            .when("/lobby", {
                templateUrl: templateUrl("lobby/lobby.html"),
                controller: "lobbyCtrl"
            });
});

function templateUrl(relativeUrl) {
    return "/MagiciansBattle/web/site/app/controllers/" + relativeUrl;
}
angular.module("magiciansBattle").service("userService", function ($http, $location, $q) {
    this.user = null;
    this.userRequest = null;
    this.updateUser = function (user) {
        this.user = user;
    };

    this.login = function (fields) {
        var deferred = $q.defer();
        $http({
            method: "post",
            url: "/api/Account/Login",
            data: fields
        }).then(function (response) {
            if (response.data.success) {
                this.updateUser(response.data.user);

                deferred.resolve(this.user);
            }
            else {
                deferred.reject(response.data.errors);
            }
        }.bind(this), function () {
            deferred.reject();
        });

        return deferred.promise;
    };

    this.logOff = function () {
        $http({
            method: "post",
            url: "/api/account/LogOff"
        }).then(function () {
            this.updateUser(null);
            this.userRequest = null;
            $location.path("/");
        }.bind(this));
    };

    this.getUser = function () {
        var deferred = $q.defer();

        if (this.user != null) {
            deferred.resolve(this.user);
        }
        else {
            if (this.userRequest == null) {
                this.userRequest = $http({
                    method: "post",
                    url: "/api/account/FetchUser"
                });
            }
            this.userRequest.then(function (response) {
                if (response.data.success) {
                    this.updateUser(response.data.user);
                    deferred.resolve(this.user);
                }
                else {
                    deferred.reject();
                }
            }.bind(this), function () {
                deferred.reject();
            });
        }
        return deferred.promise;
    };

    this.hasPermission = function (id) {
        if (this.user == null)
            return false;
        var permissions = this.user.permissionsArr;
        for (var i in permissions) {
            if (permissions[i] == id)
                return true;
        }
        return false;
    };
});
angular.module("magiciansBattle").controller("homeCtrl", function ($scope) {

});
angular.module("magiciansBattle").controller("lobbyCtrl", function ($scope) {

});
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
angular.module("magiciansBattle").controller("mainCtrl", function ($scope) {

});
angular.module("magiciansBattle").controller("registerCtrl", function ($scope) {
    $scope.serverErrors = { a: "A" };
});
angular.module("magiciansBattle").directive("errors", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/errors.html"
    };
});
angular.module("magiciansBattle").directive("generalErrors", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/generalErrors.html"
    };
});
angular.module("magiciansBattle").directive("selectField", function () {
    return {
        restrict: "A",
        scope: true,
        require: "field",
        templateUrl: "app/directives/field/selectField.html",
        replace: false,
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");

            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("description")) {
                $scope.description = $element.attr("description");
            }
            $scope.selectName = $element.attr("options");
            var valueName = null;
            if ($element[0].hasAttribute("options-value")) {
                valueName = $element.attr("options-value");
            }
            var textName = null;
            if ($element[0].hasAttribute("options-text")) {
                textName = $element.attr("options-text");
            }

            $scope.getOptionValue = function (option) {
                if (valueName == null)
                    return option;
                else
                    return option[valueName];
            };
            $scope.getOptionText = function (option) {
                if (textName == null)
                    return option;
                else
                    return option[textName];
            };
        }
    };
});
angular.module("magiciansBattle").directive("textField", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/textField.html",
        replace: false,
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");
            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("description")) {
                $scope.description = $element.attr("description");
            }
            $scope.fieldType = "text";
            if ($element[0].hasAttribute("field-type")) {
                $scope.fieldType = $element.attr("field-type");
            }
        }
    };
});
//# sourceMappingURL=maps/script.js.map
