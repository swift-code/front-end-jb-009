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
      //console.log(data);
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
    $scope.getProfileData=function(){
    var request=$http({
    method:'GET',
    url:URL+"profile/"+sessionStorage.userId
  });
      request.success(function(data){
        console.log(data);
        $scope.profileData=angular.fromJson(data);
      });
      request.error(function(data){
        console.log(data);
      });
  }
  $scope.getProfileData();
  $scope.updateProfile = function() {
       delete $scope.profileData["connectionRequests"];
       delete $scope.profileData["connections"];
       delete $scope.profileData["suggestions"];
       var request = $http({
           method: "PUT",
           url: URL + "profile/" + sessionStorage.userId,
           data: $scope.profileData
       });
       request.success(function(data) {
           $scope.responseMessage = "Update successful.";
           $("#dashboardMsgModal").modal('show');
           $scope.getProfileData();
       });
       request.error(function(data) {
           console.log(data);
       });
   }
   $scope.sendConnectRequest=function (receiverId) {
     var request=$http({
         method: "POST",
         url: URL + "request/send/" + sessionStorage.userId + "/" + receiverId
     });
     request.success(function(data) {
       $scope.responseMessage = "Update successful.";
       $("#dashboardMsgModal").modal('show');
       $scope.getProfileData();
     });
     request.error(function(data) {
       console.log(data);
     });
   }
   $scope.acceptRequest=function(senderId){
     var request=$http({
       method:'POST',
       url:URL+"request/accept/"+senderId
     });
     request.success(function(data){
       $scope.responseMessage="Received a new request!";
       $("#dashboardMsgModal").modal('show');
       $scope.getProfileData();
     });
      request.error(function(data){
        console.log(data);
      });
     }
}]);
