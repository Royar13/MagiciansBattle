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