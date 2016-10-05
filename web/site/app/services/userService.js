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