(function() {
    $(document).ready(function() {
        initMap();
        //getAustinBrewerys();
    })
})();


var googlePlacesAPIKey = "AIzaSyDkglGA_QCRbWdTB8WbheqnjLhGJ4D74Lg";


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;

function initMap() {
    var austin = {
        lat: 30.4866996,
        lng: -97.650965
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: austin,
        zoom: 17
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: austin,
        radius: 50000,
        type: ['bar'],
        keyword: 'brewery'
    }, processResults);
}

function processResults(results, status, pagination) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
    } else {
        createMarkers(results);

        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
                moreButton.disabled = true;
                pagination.nextPage();
            });
        }
    }
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        // if (place.name.includes("Brewery") || place.name.includes("Brewing")) {
        //     placesList.innerHTML += '<li>' + place.name + '</li>';
        // }

        placesList.innerHTML += '<li>' + place.name + '</li>';

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}

// var map;
// var service;
// var infowindow;
//
// function initMap() {
//     var austin = new google.maps.LatLng(30.2672654, -97.768282);
//
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: austin,
//         zoom: 15
//     });
//
//     var request = {
//         location: austin,
//         radius: '5000',
//         types: ['bar']
//     };
//
//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, callback);
// }
//
// function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//         for (var i = 0; i < results.length; i++) {
//             var place = results[i].name + " " + results[i].id;
//
//             //createMarker(results[i]);
//             console.log(place);
//         }
//     }
// }

// function initMap() {
//
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 3,
//         center: {
//             lat: 30.2653309,
//             lng: -97.7517386
//         }
//     });
//
//     // Create an array of alphabetical characters used to label the markers.
//     var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//
//     // Add some markers to the map.
//     // Note: The code uses the JavaScript Array.prototype.map() method to
//     // create an array of markers based on a given "locations" array.
//     // The map() method here has nothing to do with the Google Maps API.
//     var markers = locations.map(function(location, i) {
//         return new google.maps.Marker({
//             position: location,
//             label: labels[i % labels.length]
//         });
//     });
//
//     // Add a marker clusterer to manage the markers.
//     var markerCluster = new MarkerClusterer(map, markers, {
//         imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
//     });
// }




// function getAustinBrewerys() {
//
//     var brewerysurl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?location=-41.319282,174.818717&radius=1000&sensor=true&query=brewery&key=AIzaSyDkglGA_QCRbWdTB8WbheqnjLhGJ4D74Lg';
//
//     var austinBrewerysRequest = $.ajax({
//         url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-41.319282,174.818717&radius=1000&sensor=true&type=brewery&key=AIzaSyDkglGA_QCRbWdTB8WbheqnjLhGJ4D74Lg',
//         dataType: 'json'
//     });
//
//     austinBrewerysRequest.done(function(austinBrewerysRequest) {
//
//         console.log(austinBrewerysRequest);
//     });
//
//
// };



// var locations = [{
//         lat: -31.563910,
//         lng: 147.154312
//     },
//     {
//         lat: -33.718234,
//         lng: 150.363181
//     },
//     {
//         lat: -33.727111,
//         lng: 150.371124
//     },
//     {
//         lat: -33.848588,
//         lng: 151.209834
//     },
//     {
//         lat: -33.851702,
//         lng: 151.216968
//     },
//     {
//         lat: -34.671264,
//         lng: 150.863657
//     },
//     {
//         lat: -35.304724,
//         lng: 148.662905
//     },
//     {
//         lat: -36.817685,
//         lng: 175.699196
//     },
//     {
//         lat: -36.828611,
//         lng: 175.790222
//     },
//     {
//         lat: -37.750000,
//         lng: 145.116667
//     },
//     {
//         lat: -37.759859,
//         lng: 145.128708
//     },
//     {
//         lat: -37.765015,
//         lng: 145.133858
//     },
//     {
//         lat: -37.770104,
//         lng: 145.143299
//     },
//     {
//         lat: -37.773700,
//         lng: 145.145187
//     },
//     {
//         lat: -37.774785,
//         lng: 145.137978
//     },
//     {
//         lat: -37.819616,
//         lng: 144.968119
//     },
//     {
//         lat: -38.330766,
//         lng: 144.695692
//     },
//     {
//         lat: -39.927193,
//         lng: 175.053218
//     },
//     {
//         lat: -41.330162,
//         lng: 174.865694
//     },
//     {
//         lat: -42.734358,
//         lng: 147.439506
//     },
//     {
//         lat: -42.734358,
//         lng: 147.501315
//     },
//     {
//         lat: -42.735258,
//         lng: 147.438000
//     },
//     {
//         lat: -43.999792,
//         lng: 170.463352
//     }
// ]
