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