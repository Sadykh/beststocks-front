var oldMapForExample;
var coords;
var marker_from;
var marker_to;
var markers = [];
var stage = 1;
var thin_out = 1;
var order_id;
var isEdit;

$(document).ready(function () {
    order_id = $('#map').data('id');
    isEdit = $('#map').data('edit');
    if (isEdit && order_id) {
        getStartAndFinishCoords();
    } else {
        if (order_id) {
            getCoords();
        }
    }

});

$(document).on('click', '#thin-out', function (e) {
    e.preventDefault();
    cleanMarkers();
    getCoords();

});

function cleanMarkers() {
    var i;
    for (i in markers) {
        markers[i].setMap(null);
    }
}

function getStartAndFinishCoords(chat_order = null) {
    if (chat_order) {
        order_id = chat_order
    }
    $.ajax({
        url: '/order/get-coords', // Url to which the request is send
        type: "GET",             // Type of request to be send, called as method
        data: {order_id: order_id}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,       // The content type used when sending data to the server.
        cache: false,             // To unable request pages to be cached
        processData: true,
        dataType: 'json',// To send DOMDocument or non processed data file it is set to false
        success: function (data)   // A function to be called if request succeeds
        {
            var i = 0;

            coords = data;
            console.log(coords);
            for (i = 0; i < 2; i++) {
                var latlng = new google.maps.LatLng(data[i]['lat'], data[i]['lng']);
                markers[i] = new google.maps.Marker({
                    position: latlng,
                    map: oldMapForExample,
                    title: data[i]['title'],
                });
            }
        }
    });
}

function getCoords(chat_order = null) {
    if (chat_order) {
        order_id = chat_order
    }
    $.ajax({
        url: '/order/get-coords', // Url to which the request is send
        type: "GET",             // Type of request to be send, called as method
        data: {order_id: order_id}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,       // The content type used when sending data to the server.
        cache: false,             // To unable request pages to be cached
        processData: true,
        dataType: 'json',// To send DOMDocument or non processed data file it is set to false
        success: function (data)   // A function to be called if request succeeds
        {
            var i = 0;

            coords = data;
            console.log(coords);
            for (i = 0; i < 2; i++) {
                var latlng = new google.maps.LatLng(data[i]['lat'], data[i]['lng']);
                markers[i] = new google.maps.Marker({
                    position: latlng,
                    map: oldMapForExample,
                    title: data[i]['title'],
                });
            }
            if (thin_out) {
                for (i = 2; i < data.length; i = i + 50) {
                    var latlng = new google.maps.LatLng(data[i]['lat'], data[i]['lng']);
                    markers[i] = new google.maps.Marker({
                        position: latlng,
                        map: oldMapForExample,
                        title: data[i]['title'],
                        icon: data[i]['icon'],
                    });
                    var message = 'Время: ' + data[i]['time'];
                    bindInfoWindow(markers[i], oldMapForExample, infowindow, message);
                }
                if (!chat_order) {
                    thin_out = 0;
                }
                console.log('Точки прорежены');
            } else {
                for (i = 2; i < data.length; i++) {
                    var latlng = new google.maps.LatLng(data[i]['lat'], data[i]['lng']);
                    markers[i] = new google.maps.Marker({
                        position: latlng,
                        map: oldMapForExample,
                        title: data[i]['title'],
                        icon: data[i]['icon'],
                    });
                    var message = 'Время: ' + data[i]['time'];
                    bindInfoWindow(markers[i], oldMapForExample, infowindow, message);
                }
                thin_out = 1;
                console.log('Полный набор точек');
            }
        }
    });
}

function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function () {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
}

$(document).on("change", "#adr_from", function (e) {
    e.preventDefault();
    var adr_from = $('#adr_from').val();
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + adr_from + '&key=AIzaSyDC3RJcrYTsliCpi1CQHwgysIkZKgvWkV4', // Url to which the request is send
        type: "GET",             // Type of request to be send, called as method
        // data: {object_id: id, object_type: type, mark: mark}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,       // The content type used when sending data to the server.
        cache: false,             // To unable request pages to be cached
        processData: true,
        dataType: 'json',// To send DOMDocument or non processed data file it is set to false
        success: function (data)   // A function to be called if request succeeds
        {
            console.log(data);
            var latlng = new google.maps.LatLng(data['results']['0']['geometry']['location']['lat'], data['results']['0']['geometry']['location']['lng']);
            if (marker_from) {
                marker_from.setMap(null);
            }
            $('#adr_from').val(data['results']['0']['formatted_address']);
            var latlng = new google.maps.LatLng(data['results']['0']['geometry']['location']['lat'], data['results']['0']['geometry']['location']['lng']);
            marker_from = new google.maps.Marker({
                position: latlng,
                map: oldMapForExample,
                title: 'Адрес получения'
            });
            $('#lng_from').val(data['results']['0']['geometry']['location']['lng']);
            $('#lat_from').val(data['results']['0']['geometry']['location']['lat']);
        }
    });
});
$(document).on("change", "#adr_to", function (e) {
    e.preventDefault();
    var adr_to = $('#adr_to').val();
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + adr_to + '&key=AIzaSyDC3RJcrYTsliCpi1CQHwgysIkZKgvWkV4', // Url to which the request is send
        type: "GET",             // Type of request to be send, called as method
        // data: {object_id: id, object_type: type, mark: mark}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,       // The content type used when sending data to the server.
        cache: false,             // To unable request pages to be cached
        processData: true,
        dataType: 'json',// To send DOMDocument or non processed data file it is set to false
        success: function (data)   // A function to be called if request succeeds
        {
            console.log(data);
            if (marker_to) {
                marker_to.setMap(null);
            }
            $('#adr_to').val(data['results']['0']['formatted_address']);
            var latlng = new google.maps.LatLng(data['results']['0']['geometry']['location']['lat'], data['results']['0']['geometry']['location']['lng']);
            marker_to = new google.maps.Marker({
                position: latlng,
                map: oldMapForExample,
                title: 'Адрес назначения'
            });
            $('#lng_to').val(data['results']['0']['geometry']['location']['lng']);
            $('#lat_to').val(data['results']['0']['geometry']['location']['lat']);
        }
    });
});

function initMap() {
    oldMapForExample = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.689959, lng: 37.579186},
        zoom: 8,
    });
    infowindow = new google.maps.InfoWindow({
        content: ''
    });
    var test = $('#order-form').data('id');
    if (test) {
        google.maps.event.addListener(oldMapForExample, 'click', function (event) {
            placeMarker(event.latLng);
        })
    }
};

function placeMarker(location) {
    console.log(location);
    if (stage == 2) {
        if (marker_to) {
            marker_to.setMap(null);
        }
        marker_to = new google.maps.Marker({
            position: location,
            map: oldMapForExample,
            title: 'Адрес назначения'
        });
        console.log('coord_to = lat : ' + location.lat() + " lng: " + location.lng());
        var coords_to = location.lat() + ',' + location.lng();
        $('#lat_to').val(location.lat());
        $('#lng_to').val(location.lng());
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords_to + '&key=AIzaSyDC3RJcrYTsliCpi1CQHwgysIkZKgvWkV4', // Url to which the request is send
            type: "GET",             // Type of request to be send, called as method
            // data: {object_id: id, object_type: type, mark: mark}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: true,
            dataType: 'json',// To send DOMDocument or non processed data file it is set to false
            success: function (data)   // A function to be called if request succeeds
            {
                console.log(data['results'][0]['formatted_address']);
                $('#adr_to').val(data['results'][0]['formatted_address']);
            }
        });
        stage = 1;
    } else {
        if (marker_from) {
            marker_from.setMap(null);
        }
        marker_from = new google.maps.Marker({
            position: location,
            map: oldMapForExample,
            title: 'Адрес получения'
        });
        console.log('coord from = lat : ' + location.lat() + " lng: " + location.lng());
        var coords_from = location.lat() + ',' + location.lng();
        $('#lat_from').val(location.lat());
        $('#lng_from').val(location.lng());
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords_from + '&key=AIzaSyDC3RJcrYTsliCpi1CQHwgysIkZKgvWkV4', // Url to which the request is send
            type: "GET",             // Type of request to be send, called as method
            // data: {object_id: id, object_type: type, mark: mark}, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: true,
            dataType: 'json',// To send DOMDocument or non processed data file it is set to false
            success: function (data)   // A function to be called if request succeeds
            {
                console.log(data['results'][0]['formatted_address']);
                $('#adr_from').val(data['results'][0]['formatted_address']);

            }
        });
        stage = 2;
    }
}

$(document).on("click", "#adr_from", function (e) {
    stage = 1;
    console.log(stage);
});
$(document).on("click", "#adr_to", function (e) {
    stage = 2;
    console.log(stage);
});
