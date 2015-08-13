var app = angular.module('app', ['ngAnimate', 'ngMessages', 'ngAria', 'formly', 'formlyBootstrap']);

app.run(function(formlyConfig, formlyValidationMessages) {
  formlyConfig.setWrapper({
    name: 'formlyMessages',
    templateUrl: 'formly-messages.html',
    types: ['input', 'radio', 'select', 'textarea', 'checkbox']
  });

  //formlyValidationMessages.addStringMessage('required', 'This field is required');
  formlyValidationMessages.addStringMessage('email', 'Invalid email');
  formlyValidationMessages.addStringMessage('number', 'Invalid number');
  formlyValidationMessages.messages.required = 'to.label + " is required"';
  formlyValidationMessages.messages.minlength = '"Must be at least " + to.minlength + " long"';

});

app.controller('MainCtrl', function($scope, planets, $window) {
  var vm = this;
  var store = $window.localStorage;
  var storeKey = 'htmlToFormlyRememberedInput';
  vm.user = {};

  vm.onSubmit = onSubmit;
  vm.autofill = autofill;
  vm.reset = reset;
  vm.rememberInputChanged = rememberInputChanged;

  vm.planets = planets;
  vm.lightsaberColors = [
    {name: 'No Preference', value: 'no preference'},
    {name: 'Green', value: 'green'},
    {name: 'Red', value: 'red'},
    {name: 'Blue', value: 'blue'},
    {name: 'Purple', value: 'purple'},
    {name: 'Orange', value: 'orange'},
    {name: 'Pink', value: 'pink'},
    {name: 'Yellow', value: 'yellow'}
  ];

  vm.fields = [
    {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: 'First Name',
        required: true
      }
    },
    {
      key: 'lastName',
      type: 'input',
      templateOptions: {
        label: 'Last Name',
        required: true,
        disabled: true
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.firstName'
      }
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email Address',
        type: 'email',
        required: true
      }
    },
    {
      key: 'confirmEmail',
      type: 'input',
      templateOptions: {
        label: 'Confirm Email Address',
        type: 'email',
        required: true
      },
      validators: {
        betterMatches: {
          expression: '$viewValue === model.email',
          message: '$viewValue + " is not equal to " + model.email'
        }
      }
    },
    {
      key: 'streetAddress',
      type: 'textarea',
      templateOptions: {
        label: 'Street Address',
        required: true
      }
    },
    {
      key: 'planet',
      type: 'select',
      templateOptions: {
        label: 'Planet',
        required: true,
        options: planets
      }
    },
    {
      key: 'postalCode',
      type: 'input',
      templateOptions: {
        label: 'Postal Code',
        type: 'number',
        required: true
      },
      validators: {
        postalCode: {
          expression: '$viewValue.length === 5',
          message: '"Must be 5 digits"'
        }
      }
    },
    {
      key: 'gender',
      type: 'radio',
      templateOptions: {
        label: 'Your Gender?',
        required: true,
        options: [
          {name: 'Male', value: 'male'},
          {name: 'Female', value: 'female'},
          {name: 'Prefer not to say', value: 'unspecified'}
        ]
      }
    },
    {
      key: 'colorPreference',
      type: 'select',
      templateOptions: {
        label: 'Favorite Lightsaber Color?',
        required: true,
        options: vm.lightsaberColors
      }
    },
    {
      key: 'agree',
      type: 'checkbox',
      templateOptions: {
        label: 'Do you sign your soul away to our TOS?',
        required: true
      }
    }
  ];

  var stopWatchingModel;
  var preExistingData = store.getItem(storeKey);
  if (preExistingData) {
    vm.user = angular.fromJson(preExistingData);
    vm.rememberInput = true;
    stopWatchingModel = watchModel();
  }


  function onSubmit(user) {
    alert([
      'Thanks for your order ' + user.firstName + '!',
      'It will probably take a while to get to you.',
      'We need to invent it first!\n\n',
      'But here\'s what you submitted:\n' + angular.toJson(user, 2)
    ].join(' '));
  }

  function rememberInputChanged(shouldRemember) {
    if (shouldRemember) {
      stopWatchingModel = watchModel();
    } else {
      store.removeItem(storeKey);
      stopWatchingModel();
    }
  }

  function watchModel() {
    return $scope.$watch('vm.user', function updateLocalStorage() {
      store.setItem(storeKey, angular.toJson(vm.user, false));
    }, true);
  }

  function autofill() {
    vm.user = {
      firstName: 'Luke',
      lastName: 'Skywalker',
      email: 'luke@ilovedaddy.com',
      confirmEmail: 'luke@ilovedaddy.com',
      streetAddress: '1234 Hi Five Drive',
      planet: 'tatooine',
      postalCode: 12345,
      gender: 'male',
      colorPreference: 'blue',
      agree: true
    };
  }

  function reset() {
    vm.user = {};
  }
});

app.directive('mustMatch', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attrs, ctrl) {
      ctrl.$validators.matches = matches;

      function matches(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return value === scope.$eval(attrs.mustMatch);
      }
    }
  }
});

app.directive('myMessages', function() {
  return {
    templateUrl: 'custom-messages.html',
    scope: {field: '=myMessages'}
  }
});

app.directive('hasError', function() {
  return function(scope, el, attrs) {
    scope.$watch(attrs.hasError + '.$invalid && ' + attrs.hasError + '.$touched', function(show) {
      if (show) {
        el.addClass('has-error');
      } else {
        el.removeClass('has-error');
      }
    }, true);
  }
});

app.constant('planets', [
  {name: '', value: ''},
  {name: 'Alderaan', value: 'alderaan'},
  {name: 'Bespin', value: 'bespin'},
  {name: 'Cato Neimoidia', value: 'cato neimoidia'},
  {name: 'Corellia', value: 'corellia'},
  {name: 'Coruscant', value: 'coruscant'},
  {name: 'Dagobah', value: 'dagobah'},
  {name: 'Dantooine', value: 'dantooine'},
  {name: 'Earth', value: 'earth'},
  {name: 'Endor', value: 'endor'},
  {name: 'Forest moon of Endor', value: 'forest moon of endor'},
  {name: 'Felucia', value: 'felucia'},
  {name: 'Geonosis', value: 'geonosis'},
  {name: 'Ghomrassen', value: 'ghomrassen'},
  {name: 'Guermessa', value: 'guermessa'},
  {name: 'Hesperidium', value: 'hesperidium'},
  {name: 'Hoth', value: 'hoth'},
  {name: 'Jestefad', value: 'jestefad'},
  {name: 'Mustafar', value: 'mustafar'},
  {name: 'Kamino', value: 'kamino'},
  {name: 'Kashyyyk', value: 'kashyyyk'},
  {name: 'Mustafar', value: 'mustafar'},
  {name: 'Mygeeto', value: 'mygeeto'},
  {name: 'Naboo', value: 'naboo'},
  {name: 'Ohma-D\'un', value: 'ohma-d\'un'},
  {name: 'Polis Massa', value: 'polis massa'},
  {name: 'Rori', value: 'rori'},
  {name: 'Saleucami', value: 'saleucami'},
  {name: 'Tatooine', value: 'tatooine'},
  {name: 'Utapau', value: 'utapau'},
  {name: 'Utapau 7', value: 'utapau 7'},
  {name: 'Yavin', value: 'yavin'},
  {name: 'Yavin IV', value: 'yavin iv'}
]);
