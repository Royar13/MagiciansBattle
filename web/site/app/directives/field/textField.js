angular.module("magiciansBattle").directive("textField", function ($rootScope) {
    return {
        restrict: "A",
        scope: true,
        templateUrl: $rootScope.templateUrl("directives/field/textField.html"),
        replace: true,
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");
            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("field-description")) {
                $scope.description = $element.attr("field-description");
            }
            $scope.fieldType = "text";
            if ($element[0].hasAttribute("field-type")) {
                $scope.fieldType = $element.attr("field-type");
            }
        }
    };
});