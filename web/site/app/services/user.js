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