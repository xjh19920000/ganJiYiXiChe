// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $ionicConfigProvider.platform.android.tabs.position('button');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js



  $stateProvider

      .state('welcome', {
          url: '/welcome',
          templateUrl: 'welcome.html',
          controller: 'GuidePageCtrl'
      })
      .state('welcome.guidePage', {
          url: '/guidePage',
          views:{
              'welcome':{
                  templateUrl: 'guidePage.html',
                  controller: 'GuidePageCtrl'
              }
          }
      })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

.state('tab.discountPackage', {
          url: '/home/:packageInfoId',
          views: {
              'home': {
                  templateUrl: 'templates/home/discountPackage.html',
                  controller: 'DiscountPackageCtrl'
              }
          }
      })
  .state('tab.buyNow', {
          url: '/packageInfoId/buyNow',
          views: {
              'discountPackage': {
                  templateUrl: 'templates/home/buyNow.html',
                  controller: 'BuyNowCtrl'
              }
          }
      })

  .state('tab.order', {
      url: '/order',
      views: {
        'order': {
          templateUrl: 'templates/order/order.html',
          controller: 'OrderCtrl'
        }
      }
    })
    .state('tab.task', {
      url: '/task',
      views: {
        'task': {
          templateUrl: 'templates/task/task.html',
          controller: 'TaskCtrl'
        }
      }
    })
      .state('tab.my', {
          url: '/my',
          views: {
              'my': {
                  templateUrl: 'templates/my/my.html',
                  controller: 'MyCtrl'
              }
          }
      })

        $urlRouterProvider.otherwise('/welcome/guidePage');
  // if none of the above states are matched, use this as the fallback

});
