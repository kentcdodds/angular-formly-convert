var app = angular.module('app', ['ngAnimate', 'ngMessages', 'ngAria']);
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
    'no preference', 'green', 'red', 'blue',
    'purple', 'orange', 'pink', 'yellow'
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
      planet: 'Tatooine',
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
  '',
  'Alderaan',
  'Bespin',
  'Cato Neimoidia',
  'Corellia',
  'Coruscant',
  'Dagobah',
  'Dantooine',
  'Earth',
  'Endor',
  'Forest moon of Endor',
  'Felucia',
  'Geonosis',
  'Ghomrassen',
  'Guermessa',
  'Hesperidium',
  'Hoth',
  'Jestefad',
  'Mustafar',
  'Kamino',
  'Kashyyyk',
  'Mustafar',
  'Mygeeto',
  'Naboo',
  'Ohma-D\'un',
  'Polis Massa',
  'Rori',
  'Saleucami',
  'Tatooine',
  'Utapau',
  'Utapau 7',
  'Yavin',
  'Yavin IV'
]);
