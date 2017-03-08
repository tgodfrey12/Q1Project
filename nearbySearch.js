(function() {
    $(document).ready(function() {
        setupButtons();
        initMap("brewery");
        //getAustinBrewerys();
    });
})();


var googlePlacesAPIKey = "AIzaSyDkglGA_QCRbWdTB8WbheqnjLhGJ4D74Lg";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var currentImage = "Beer Glass-48.png";

function setupButtons() {
    var wineryButton = document.getElementById('wineryButton');
    wineryButton.disabled = false;

    wineryButton.addEventListener('click', function() {
        currentImage = "Wine Bottle-48.png";
        $('#breweryButton').removeClass('active');
        $('.distilleryButton').toggleClass("distillery ui button");
        $('#reviews').empty();
        $('#details').empty();


        initMap("winery");
    });

    var distilleryButton = document.getElementById('distilleryButton');
    //distilleryButton.disabled = false;
    distilleryButton.addEventListener('click', function() {
        // $('.breweryButton').toggleClass("brewery ui button");

        $('#breweryButton').removeClass('active');

        currentImage = "Whisky Still-48.png";
        $('#reviews').empty();
        $('#details').empty();
        initMap("distillery");
    });

    var breweryButton = document.getElementById('breweryButton');
    breweryButton.disabled = false;
    breweryButton.addEventListener('click', function() {
        $('.distilleryButton').toggleClass("distillery ui button");
        $('.wineryButton').toggleClass("winery ui button");
        currentImage = "Beer Glass-48.png";
        $('#reviews').empty();
        $('#details').empty();
        initMap("brewery");
    });
}

function initMap(mapType) {
    // 
    $('#places').empty();

    var austin = {
        lat: 30.4866996,
        lng: -97.7471027
    };

    // var chicago = {
    //     lat: 41.850,
    //     lng: -87.650
    // };

    // $('#breweryButton').addClass('active');
    if (mapType === "brewery") {
        $('#breweryButton').addClass('active');
    }


    map = new google.maps.Map(document.getElementById('map'), {
        center: austin,
        zoom: 17
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: austin,
        radius: 50000,
        keyword: mapType
    }, processResults);
}

function processResults(results, status, pagination) {

    var moreButton = document.getElementById('more');
    console.log(results);

    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
    } else {
        createMarkers(results);

        if (pagination.hasNextPage) {
            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
                moreButton.disabled = true;
                pagination.nextPage();
            });
        } else {
            moreButton.disabled = true;
            $('#more').remove();
        }
    }
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');

    for (let i = 0, place; place = places[i]; i++) {
        let image = {
            //url: place.icon,
            url: currentImage,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        let marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });


        let infowindow = new google.maps.InfoWindow({
            content: place.name
        });

        marker.addListener('click', function() {
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            infowindow.open(map, marker);
        });



        // marker.addListener('click', function() {
        //   infowindow.open(map, marker);
        // });


        //Have to use let here because it will use block-level scope
        //and not be reset every time through the loop
        let placeID = place.place_id;

        //Add href to the list items and set up event listener
        var newDiv = document.createElement("li");
        var newContent = document.createTextNode(place.name);
        var newAnchor = document.createElement("a");
        newAnchor.append(newContent);
        newAnchor.setAttribute('href', "");

        newDiv.append(newAnchor);
        newDiv.addEventListener('click', function(ev) {
            ev.preventDefault();
            getPlaceDetails(placeID);
        });
        placesList.append(newDiv);

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}


//Call the google service to get the details for the place ID
function getPlaceDetails(googlePlaceID) {
    var request = {
        placeId: googlePlaceID
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, showPlaceDetails);
}

//Show the details in the lower left pane of the page
function showPlaceDetails(place, status) {

    var detailsList = document.getElementById('details');

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById("details").innerHTML = "";

        if (place.rating !== undefined) {
            $('#details').append('Google Overall Rating: ' + place.rating);
            $('#details').append('<br>');
            $('#details').append('<br>');
        } else {
            $('#details').append('No Rating Available');
            $('#details').append('<br>');
            $('#details').append('<br>');
        }

        var detailDiv = document.createElement("item");
        var placeName = document.createTextNode(place.name);
        detailDiv.append(placeName);
        detailsList.append(detailDiv);

        $('#details').append('<br>');

        detailDiv = document.createElement("item");
        var placeAddress = document.createTextNode(place.formatted_address);
        detailDiv.append(placeAddress);
        detailsList.append(detailDiv);

        $('#details').append('<br>');

        if (place.formatted_phone_number !== undefined) {
            detailDiv = document.createElement("item");
            var placePhone = document.createTextNode(place.formatted_phone_number);
            detailDiv.append(placePhone);
            detailsList.append(detailDiv);
        }

        $('#details').append('<div class="ui horizontal divider">');

        detailDiv = document.createElement("item");
        var placeWebsite = document.createTextNode(place.website);
        detailDiv.append(placeWebsite);
        detailsList.append(detailDiv);
        $('#details').append('<br>');

        showReviews(place);

    } else {
        console.log(status);
    }
}

function showReviews(place) {
    $('#reviews').empty();


    if (place.reviews === undefined) {
        return;
    }

    $('#reviews').append("Reviews: " + '<br>');

    var reviewAra = place.reviews;

    reviewAra.forEach(function(review) {
        $('#reviews').append('<strong>Reviewer: ' + review.author_name + '</strong><br>');
        $('#reviews').append('<br>');
        $('#reviews').append('<em>' + review.text + '</em>');
        $('#reviews').append('<div class="ui horizontal divider">');

    });
}

// function geoFindMe() {
//     // var output = document.getElementById("out");
//
//     if (!navigator.geolocation) {
//         //output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
//         console.log("Geolocation is not supported by your browser");
//         return;
//     }
//
//     function success(position) {
//         latitude = position.coords.latitude;
//         longitude = position.coords.longitude;
//
//         //output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
//         console.log("Latitude is " + latitude + " Longitude is " + longitude);
//
//         // var img = new Image();
//         // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
//         //
//         // output.appendChild(img);
//     }
//
//     function error() {
//         //output.innerHTML = "Unable to retrieve your location";
//         console.log("Unable to retrieve your location");
//     }
//
//     //output.innerHTML = "<p>Locating…</p>";
//
//     navigator.geolocation.getCurrentPosition(success, error);
// }
