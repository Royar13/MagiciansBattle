angular.module("magiciansBattle").directive("textField", function () {
    return {
        restrict: "A",
        scope: true,
        templateUrl: "app/directives/field/textField.html",
        replace: false,
        controller: function ($scope, $element) {
            $scope.field = $element.attr("field-name");
            $scope.class = "";
            if ($element[0].hasAttribute("add-class")) {
                $scope.class = $element.attr("add-class");
            }
            $scope.description = "";
            if ($element[0].hasAttribute("description")) {
                $scope.description = $element.attr("description");
            }
            $scope.fieldType = "text";
            if ($element[0].hasAttribute("field-type")) {
                $scope.fieldType = $element.attr("field-type");
            }
        }
    };
});