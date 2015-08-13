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
    {name: 'No Preference', value: 'no preference'},
    {name: 'Green', value: 'green'},
    {name: 'Red', value: 'red'},
    {name: 'Blue', value: 'blue'},
    {name: 'Purple', value: 'purple'},
    {name: 'Orange', value: 'orange'},
    {name: 'Pink', value: 'pink'},
    {name: 'Yellow', value: 'yellow'}
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
