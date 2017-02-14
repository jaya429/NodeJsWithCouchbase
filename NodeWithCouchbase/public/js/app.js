angular.module("recordsapp", ["ui.router"])
 
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("list", {
            "url": "/list",
            "templateUrl": "templates/list.html",
            "controller": "MainController",
            "cache": false
        })
        .state("item", {
            "url": "/item/:documentId",
            "templateUrl": "templates/item.html",
            "controller": "MainController",
            "cache": false
        });
    $urlRouterProvider.otherwise("list");
})
 
.controller("MainController", function($scope, $http, $state, $stateParams) {
 
    $scope.items = {};
 
    $scope.fetchAll = function() {
        $http(
            {
                method: "GET",
                url: "/api/getAll",
                headers: {'Accept': 'application/json'}
            }
        ).then(function(result){
             for(var i = 0; i < result.length; i++) {
                $scope.items[result[i].id] = result[i];
            }
        })
        
    }
 
    if($stateParams.documentId) {
        $http(
            {
                method: "GET",
                url: "/api/get",
                params: {
                    document_id: $stateParams.documentId
                },
                 headers: {'Accept': 'application/json'}
            }
        )
        .success(function(result) {
            $scope.inputForm = result[0];
        })
        .error(function(error) {
            console.log(JSON.stringify(error));
        });
    }
 
    $scope.delete = function(documentId) {
        $http(
            {
                method: "POST",
                url: "/api/delete",
                 headers: {'Accept': 'application/json'},
                data: {
                    document_id: documentId
                }
            }
        )
        .success(function(result) {
            delete $scope.items[documentId];
        })
        .error(function(error) {
            console.log(JSON.stringify(error));
        });
    }
 
    $scope.save = function(firstname, lastname, email) {
        $http(
            {
                method: "POST",
                url: "/api/save",
                 headers: {'Accept': 'application/json'},
                data: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    document_id: $stateParams.documentId
                }
            }
        ).then(function(res){
             $state.go("list");
        })       
        
    }
 
});