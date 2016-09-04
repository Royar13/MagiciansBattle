angular.module("magiciansBattle").directive("errors", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/errors.html")
    };
});