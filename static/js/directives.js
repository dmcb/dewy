var directives = angular.module('dewyDirectives', []);

directives.directive('formatDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function(modelValue){
                return new Date(modelValue);
            })
        }
    }
});

directives.directive('editablespan', function() {
    return {
        restrict: 'E',
        template: '<div class="editable-span"><a href="" ng-hide="editing" ng-class="spanClass"><span>{{text}} <i class="fa fa-pencil-square-o"></i></span></a><form ng-show="editing"><input type="{{getInputType()}}" ng-class="inputClass"><button type="submit"><i class="fa fa-check" aria-hidden="true"></i></button></form><div>',
        scope: {
            text: '=model',
            onReady: '&',
            spanClass: '@',
            inputClass: '@',
            inputType: '@'
        },
        replace: true,
        link: function(scope, element, attrs) {
            scope.getInputType = function() {
                return scope.inputType || 'text';
            };

            var span = angular.element(element.children()[0]);
            var form = angular.element(element.children()[1]);
            var input = angular.element(element.children()[1][0]);

            span.bind('click', function(event) {
                input[0].value = scope.text;
                startEdit();
            });

            function startEdit() {
                bindEditElements();
                setEdit(true);
                input[0].focus();
            }

            function bindEditElements() {
                form.bind('submit', function() {
                    // you can't save empty string
                    if(input[0].value) {
                        save();
                    }
                    stopEdit();
                });
            }

            function save() {
                scope.text = input[0].value;
                scope.$apply();
                scope.onReady();
            }

            function stopEdit() {
                unbindEditElements();
                setEdit(false);
            }

            function unbindEditElements() {
                input.unbind();
                form.unbind();
            }

            function setEdit(value) {
                scope.editing = value;
                scope.$apply();
            }

            function isEscape(event) {
                return event && event.keyCode == 27;
            }
        }
    };
});