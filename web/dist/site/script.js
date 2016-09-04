$(document).ready(function () {
    $(document).foundation();
});

﻿var app = angular.module("magiciansBattle", ["ngRoute", "angularCSS"]);

app.run(function ($rootScope) {
    $rootScope.apiUrl = apiUrl;
    $rootScope.templateUrl = templateUrl;
    $rootScope.styleUrl = styleUrl;

    //$rootScope.$on("$routeChangeSuccess", function (ev, data) {
    //    if (data.$route && data.$route.controller)
    //        $rootScope.controller = data.$route.controller;
    //});
});

app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: templateUrl("controllers/home/home.html"),
                controller: "homeCtrl",
                css: styleUrl("home.css")
            })
            .when("/lobby", {
                templateUrl: templateUrl("controllers/lobby/lobby.html"),
                controller: "lobbyCtrl"
            });
});

function apiUrl(relativeUrl) {
    return "/MagiciansBattle/web/app_dev.php/api/" + relativeUrl;
}
function templateUrl(relativeUrl) {
    return "/MagiciansBattle/web/site/app/" + relativeUrl;
}
function styleUrl(relativeUrl) {
    return "/MagiciansBattle/web/dist/site/styles/" + relativeUrl;
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
    $scope.loading = false;
    
});
angular.module("magiciansBattle").controller("loginBarCtrl", function ($scope, $rootScope, $http, $location, $timeout, userService) {
    $scope.user = null;
    userService.getUser().then(function (user) {
        $scope.user = user;
    });

});
angular.module("magiciansBattle").controller("mainCtrl", function ($scope) {

});
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
angular.module("magiciansBattle").directive("errors", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/errors.html")
    };
});
angular.module("magiciansBattle").directive("generalErrors", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/generalErrors.html")
    };
});
angular.module("magiciansBattle").directive("selectField", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        require: "field",
        replace: true,
        templateUrl: $rootScope.templateUrl("directives/field/selectField.html"),
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");

            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("field-description")) {
                $scope.description = $element.attr("field-description");
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
angular.module("magiciansBattle").directive("textField", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/textField.html"),
        replace: true,
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");
            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("field-description")) {
                $scope.description = $element.attr("field-description");
            }
            $scope.fieldType = "text";
            if ($element[0].hasAttribute("field-type")) {
                $scope.fieldType = $element.attr("field-type");
            }
        }
    };
});
//# sourceMappingURL=maps/script.js.map
