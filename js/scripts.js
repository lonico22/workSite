var app = angular.module('myApp', [
    'ngSanitize',
    'ui.router',
    'app.instafeed',
    'vjs.video'
]);

app.config([
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: "views/home.html",
                controller: "HomeCtrl"
            })
            .state('about', {
                url: '/about',
                templateUrl: "views/about.html",
                controller: "AboutCtrl"
            })
            .state('work', {
                url: '/work',
                templateUrl: "views/work.html",
                controller: "WorkCtrl"
            })
            .state('project', {
                url: '/work/:projName',
                templateUrl: "views/projectPage.html",
                controller: "projCtrl"
            });
        /*
            .when('/',{
            templateUrl:"views/home.html",
            controller:"HomeCtrl"
        })
            .when('/about',{
            templateUrl:"views/about.html",
            controller:"AboutCtrl"
        })
            .when('/work',{
            templateUrl:"views/work.html",
            controller:"WorkCtrl"
        })
            .when('/project',{
            templateUrl:"views/projectPage.html",
            controller:"projCtrl"
        });*/
    }]);


app.factory('dataGetter', function ($http) {

    var getData = function () {
        return $http.get('../assets/data/content.json').then(function (res) {
            return res.data;
        });
    }


    return {
        getData: getData
    }
});

app.service("curProject", function () {
    this.projData = "";
})

app.controller('AboutCtrl',function($scope, dataGetter){
//    $scope.message=dataGetter.getData().keys();
  
     dataGetter.getData().then(function(data){
        $scope.about = data["About"];
        
        
    });
    
    
    
})
app.controller('HomeCtrl', function ($scope, dataGetter, $interval) {
    //    $scope.message=dataGetter.getData().keys();
    $scope.curAdj = "";
    $scope.preAdj = "";
    var i = 0;
    
    dataGetter.getData().then(function (data) {
        $scope.adjectives = data["Adjectives"];
        
        setAdj()
    });
    
    function setAdj(){
        
    $scope.adjList = $scope.adjectives.split(',');
    $scope.curAdj = $scope.adjList[i];
    }
    
    $interval(function () {
        $scope.curAdj = $scope.adjList[i++];
        if($scope.curAdj == "Lorraine"){
            $scope.preAdj = "";
        }else if($scope.curAdj == "designer" || $scope.curAdj == "front-end developer" || $scope.curAdj == "foodie"){
            $scope.preAdj = "a";
        }else if($scope.curAdj == "explorer" || $scope.curAdj == "interactive designer"){
            $scope.preAdj = "an";
        }
        if(i >= $scope.adjList.length){
            i=0;
        }
    },2000)
})

var instaDirective = angular.module('app.instafeed', []);
    
instaDirective.directive("instaFeed",function(){
    var controller = ["$scope","dataGetter", function($scope, dataGetter){
         dataGetter.getData().then(function(data){
        $scope.message = data["InstaFeed"];
    })
    }];
    return{
        templateUrl:"views/instafeed.html",
        controller:controller
    }
});


app.controller('projCtrl', function ($state, $stateParams, $scope, $location, dataGetter, curProject) {
    $scope.id = $stateParams.projName;

    dataGetter.getData().then(function (data) {
        $scope.allData = data["Work"];
        $scope.curData = data["Work"][$scope.id];
    });
    $scope.setData = function (data) {
        $state.transitionTo('project', {
            projName: data
        })
        $scope.curProjData = $scope.allData[data];
    }

    $scope.liProcessVid = {
        sources: [
            {
                src: "assets/images/work/localItalian/process.mp4",
                type: "video/mp4"
                    },
            {
                src: "assets/images/work/localItalian/process.webm",
                type: "video/webm"
                    },
            {
                src: "assets/images/work/localItalian/process.ogv",
                type: "video/ogg"
                    },

                    ],
        poster: 'assets/images/work/localItalian/process.png'
    };
    $scope.liDrinksVid = {
        sources: [
            {
                src: "assets/images/work/localItalian/drinks.mp4",
                type: "video/mp4"
                    },
            {
                src: "assets/images/work/localItalian/drinks.webm",
                type: "video/webm"
                    },
            {
                src: "assets/images/work/localItalian/drinks.ogv",
                type: "video/ogg"
                    },

                    ],
        poster: 'assets/images/work/localItalian/drinks.png'
    };
    $scope.kineticType = {
        sources: [
            {
                src: "assets/images/work/kinetic/kinetictype_DeadPoetsSociety.mp4",
                type: "video/mp4"
                    },
            {
                src: "assets/images/work/kinetic/kinetictype_DeadPoetsSociety.webm",
                type: "video/webm"
                    },
            {
                src: "assets/images/work/kinetic/kinetictype_DeadPoetsSociety.theora.ogv",
                type: "video/ogg"
                    },

                    ]
    };

    $scope.options = {
        loop: true
    };
    
     /*  
     --other projects:
     "silvia":{
            "Nav":{
                "Prev":"barrel",
                "Next":"marks"
            },
            "Key":"silvia",
            "ID":4,
            "Path": "assets/images/work/silvia/",
            "Thumb": "assets/images/thumbs/silvia.jpg",
            "Images":[
                 {"img":"5.jpg",
                 "size":"proj-full"}, 
                 {"img":"22.jpg",
                 "size":"proj-full"}, 
                 {"img":"2.jpg",
                 "size":"proj-two"}, 
                 {"img":"1.jpg",
                 "size":"proj-two"}],
            "Title": "Silvia Manual",
            "About": "A bilingual instruction manual demonstrating how to operatethis Italian made espresso machine."
        },*/
    $scope.mediaToggle = {
        sources: [
            {
                src: 'assets/images/work/localItalian/process.mp4',
                type: 'video/mp4'
                }

            ]
    };

    //listen for when the vjs-media object changes
    $scope.$on('vjsVideoMediaChanged', function (e, data) {
        console.log('vjsVideoMediaChanged event was fired');
    });

})

app.controller('WorkCtrl',function( $state,$scope,$location, dataGetter, curProject){
//    $scope.message=dataGetter.getData().keys();
  $scope.showWorkInfo = false
     dataGetter.getData().then(function(data){
        $scope.workList = data["Work"]; 
    });
    
})