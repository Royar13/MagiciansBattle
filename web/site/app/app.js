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