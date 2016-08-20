angular.module("magiciansBattle").directive("generalErrors", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/generalErrors.html"
    };
});