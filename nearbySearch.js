(function() {
    $(document).ready(function() {
        setupButtons();
        initMap("brewery", 30.4866996, -97.7471027);
        //getAustinBrewerys();
    });
})();


//var googlePlacesAPIKey = "AIzaSyDkglGA_QCRbWdTB8WbheqnjLhGJ4D74Lg";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var currentImage = "./icons/Beer Glass-48.png";
var lat;
var lng;
var mapType = "brewery";

function setupButtons() {

    var redoButton = document.getElementById('redoButton');
    redoButton.addEventListener('click', function() {
        console.log("Redo Button Clicked");
        // redoButton.disabled = false;
        let lat = map.center.lat();
        let long = map.center.lng();
        initMap(mapType, lat, long);

    });



    var wineryButton = document.getElementById('wineryButton');
    wineryButton.addEventListener('click', function() {
        console.log("winery Button Clicked");
        currentImage = "./icons/Wine Bottle-48.png";
        $('#breweryButton').removeClass('active');
        $('.distilleryButton').toggleClass("distillery ui button");
        $('#reviews').empty();
        $('#details').empty();
        mapType = "winery";

        let lat = map.center.lat();
        let long = map.center.lng();

        initMap(mapType, lat, long);
    });

    var distilleryButton = document.getElementById('distilleryButton');
    //distilleryButton.disabled = false;
    distilleryButton.addEventListener('click', function() {
        // $('.breweryButton').toggleClass("brewery ui button");

        $('#breweryButton').removeClass('active');

        currentImage = "./icons/Whisky Still-48.png";
        $('#reviews').empty();
        $('#details').empty();
        mapType = "distillery";

        let lat = map.center.lat();
        let long = map.center.lng();

        initMap(mapType, lat, long);
    });

    var breweryButton = document.getElementById('breweryButton');
    breweryButton.disabled = false;
    breweryButton.addEventListener('click', function() {
        $('.distilleryButton').toggleClass("distillery ui button");
        $('.wineryButton').toggleClass("winery ui button");
        currentImage = "./icons/Beer Glass-48.png";
        $('#reviews').empty();
        $('#details').empty();
        mapType = "brewery";

        let lat = map.center.lat();
        let long = map.center.lng();

        initMap(mapType, lat, long);
    });
}

function initMap(mapType, lattitude, longitude) {

    $('#places').empty();

    console.log("lat = " + lattitude);
    console.log("long = " + longitude);

    var austin = {
        lat: lattitude,
        lng: longitude

    };

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
