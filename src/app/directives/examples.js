(function () {
  'use strict';

  RAML.Directives.examples = function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/examples.tpl.html',
      scope: {
        exampleContainer: '=',
        getBeatifiedExampleRef: '&'
      },
      controller: ['$scope', function($scope) {
        $scope.getBeatifiedExample = $scope.getBeatifiedExampleRef();
        $scope.examples = transformExample($scope.exampleContainer);
        $scope.currentExample = 0;

        $scope.isXML = $scope.exampleContainer.name === 'application/xml';

        $scope.changeExample = function(example) {
          $scope.currentExample = example;
        };

        $scope.$watch('exampleContainer', function (value) {
          $scope.examples = transformExample(value);
        });
      }]
    };
  };

  function transformExample(exampleContainer) {
    if (exampleContainer.example) {
      return [{
        name: 'Example',
        content: (typeof exampleContainer.example === 'object') ?
            JSON.stringify(exampleContainer.example) : exampleContainer.example
      }];
    } else if (exampleContainer.examples) {
      if (Array.isArray(exampleContainer.examples)) {
        return exampleContainer.examples.map(function (example, index) {
          var testCondition = {}
          if (example.annotations && example.annotations.testCondition) {
            testCondition = example.annotations.testCondition.structuredValue
          } else {
            testCondition = null
          }
          var description = ""
          if (example.description) {
            description = example.description
          } else {
            description = null
          }
          return {
            name: example.name || 'Example ' + index,
            content: JSON.stringify(example.structuredValue, null, 2),
            description: description,
            testCondition: testCondition
          };
        });
      } else {
        return Object.keys(exampleContainer.examples).sort().map(function (key) {
          return {
            name: key,
            content: exampleContainer.examples[key].value
          };
        });
      }
    }
  }

  angular.module('RAML.Directives')
    .directive('examples', RAML.Directives.examples);
})();
