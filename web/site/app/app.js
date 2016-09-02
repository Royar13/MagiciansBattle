$(document).ready(function () {
    $(document).foundation();
});

﻿var app = angular.module("magiciansBattle", ["ngRoute", "angularCSS"]);

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
                controller: "homeCtrl",
                css: styleUrl("home.css")
            })
            .when("/lobby", {
                templateUrl: templateUrl("lobby/lobby.html"),
                controller: "lobbyCtrl"
            });
});

function templateUrl(relativeUrl) {
    return "/MagiciansBattle/web/site/app/controllers/" + relativeUrl;
}
function styleUrl(relativeUrl) {
    return "/MagiciansBattle/web/dist/site/styles/" + relativeUrl;
}