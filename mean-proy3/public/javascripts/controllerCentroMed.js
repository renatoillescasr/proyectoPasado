// Controller de sucursales view
var myApp = angular.module('myApp', []);

//fix conflic angularjs - handlebars simbols
myApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from AppCtrl");

    var refresh = function() {
        $http.get('/pacientes/centrosMed').success(function(response) {
            console.log('i got the data i requested');
            $scope.sucursales = response;
        });
    };

    refresh();

    $scope.mapa = function(dir, id) {
        init(dir, id);
    };

    function init(dir, id) {
        var map = new google.maps.Map(document.getElementById('map' + id), {
            zoom: 16
        });
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
                'address': dir
            },
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map
                    });
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(results[0].geometry.location);
                }
            });
    }

}]);
