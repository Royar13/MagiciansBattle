angular.module("magiciansBattle").directive("errors", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/errors.html"
    };
});