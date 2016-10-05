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
angular.module("magiciansBattle").factory("userService", function ($http, $location, $q, $rootScope) {
    var self = {
        login: login,
        logout: logout,
        fetchUser: fetchUser,
        getUser: getUser,
        setUser: setUser
    };

    var user = null;
    var userRequest = null;

    function login(fields) {
        var deferred = $q.defer();
        $http({
            method: "post",
            url: $rootScope.apiUrl("account/login"),
            data: fields
        }).then(function (response) {
            if (response.data.success) {
                fetchUser().then(function () {
                    deferred.resolve();
                });
            }
            else {
                deferred.reject(response.data.errors);
            }
        }, function () {
            deferred.reject();
        });

        return deferred.promise;
    }

    function logout() {
        $http({
            method: "post",
            url: $rootScope.apiUrl("account/logout")
        }).then(function () {
            user = null;
            userRequest = null;
        });
    }

    function fetchUser() {
        var deferred = $q.defer();

        if (user != null) {
            deferred.resolve(user);
        }
        else {
            if (userRequest == null) {
                userRequest = $http({
                    method: "post",
                    url: $rootScope.apiUrl("account/fetchUser")
                });
            }
            userRequest.then(function (response) {
                if (response.data.success) {
                    user = response.data.user;
                    deferred.resolve(user);
                }
                else {
                    deferred.reject();
                }
            }, function () {
                deferred.reject();
            }).finally(function () {
                userRequest = null;
            });
        }
        return deferred.promise;
    }

    function getUser() {
        return user;
    }

    function setUser(value) {
        user = value;
    }

    return self;
});
angular.module("magiciansBattle").controller("homeCtrl", function ($scope) {

});
angular.module("magiciansBattle").controller("lobbyCtrl", function ($scope) {

});
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
angular.module("magiciansBattle").controller("loginBarCtrl", function ($scope, $rootScope, $route, userService) {
    var fetchFinished = false;
    $scope.loggedIn = function () {
        if (!fetchFinished)
            return null;
        return $scope.getUser() !== null;
    };
    userService.fetchUser().finally(function () {
        fetchFinished = true;
    });

    $scope.getUser = userService.getUser;

    $scope.toggleTooltip = function () {
        if ($("#user-panel .userMenu").is(":visible")) {
            $("#user-panel .userMenu").hide();
            $(document).off(".hideUserMenu");
        }
        else {
            $("#user-panel .userMenu").show();
            $(document).on("click.hideUserMenu", function (event) {
                if (!$(event.target).closest("#user-panel").length) {
                    $scope.toggleTooltip();
                }
            });
        }
    };

    $scope.logout = function () {
        userService.logout();
        location.reload();
    };
});
angular.module("magiciansBattle").controller("mainCtrl", function ($scope) {

});
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
