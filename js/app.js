var app=angular.module('snapp',['ngRoute','ngCookies']);
var URL="http://betsol.org:9000/";
app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    redirectTo: '/login'
  })
  .when('/login',{
    templateUrl:'views/login.html',
    controller:'loginCntrl'
  })
  .when('/signup',{
    templateUrl:'views/signup.html',
    controller:'signupCntrl'
  })
  .when('/dashboard',{
    templateUrl:'views/dashboard.html',
    controller:'dashboardCntrl'
  })
  .otherwise({
    redirectTo:'/'
  });
});
app.controller('loginCntrl',['$scope','$location','$http',function($scope,$location,$http){
        $scope.login=function(){
          var request=$http({
            method:'POST',
            url:URL+"login",
            data:{email:$scope.email,password:$scope.password}
          });
          request.success(function(data){
            console.log(data);
            var response=angular.fromJson(data);
            if(response["error"])
            {
              $scope.validationMessage=response["message"][0];
            }
            else {
              sessionStorage.email=response["email"];
              sessionStorage.password=response["password"];
              sessionStorage.userId=response["id"];

              $location.url('/dashboard');
            }
          });
          request.error(function(data){
            console.log(data);
          });
        }
}]);
app.controller('signupCntrl',['$scope','$location','$http',function($scope,$location,$http)
{
  $scope.signup=function(){
    var request=$http({
      method:'POST',
      url:URL+"signup",
      data:{email:$scope.email,password:$scope.password,firstName:$scope.firstname,lastName:$scope.lastname}
    });

    request.success(function(data){
      console.log(data);
      var response=angular.fromJson(data);
      if(response["error"])
      {
        $scope.validationMessage=response["message"][0];
      }
      else {
        //sessionStorage.firstName=response["firstName"];
        //sessionStorage.lastName=response["lastName"];
        sessionStorage.email=response["email"];
        sessionStorage.password=response["password"];
        sessionStorage.userId=response["id"];

        $location.url('/dashboard');
      }
    });
    request.error(function(data){
      console.log(data);
    });
  }

}]);
app.controller('dashboardCntrl',['$scope','$location','$http',function($scope,$location,$http)
{

}]);
