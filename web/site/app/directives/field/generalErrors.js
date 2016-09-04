angular.module("magiciansBattle").directive("generalErrors", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/generalErrors.html")
    };
});