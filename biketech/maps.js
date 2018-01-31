function iniciarMapa() {
    var marker = null;
    var markerLoc = null;
    var markers = [];
    var infowindow;
    var map;
    var geocoder = new google.maps.Geocoder();
    var service;
    //variavel para selecionar div usando o DOM
    var mapa = document.querySelector("#map");
    //variavel para selecionar div usando o DOM
    var detalhes = document.querySelector("detalhes");
    //reenderizando mapa
    map = new google.maps.Map(mapa, {
        //definindo centro do mapa caso não pegue localização
        center: new google.maps.LatLng(-23.5505199, -46.63330939999997),
        //tipo de mapa
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        //zoom do mapa
        zoom: 15,
        styles: [{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#444"
                }]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#d3d3d3"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{
                    "visibility": "simplified"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "visibility": "on"
                }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
                        "color": "#00aced"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    });


    //verificando se navegador suporta geolocation e se o usaurio permite o mesmo
    if (navigator.geolocation) {
        //se sim pega a posição atual do usuario
        navigator.geolocation.getCurrentPosition(function(position) {
            //variavel que pega latitude do usuario
            var lat = position.coords.latitude;
            //variavel que pega longitude do usuario
            var lng = position.coords.longitude;
            //setando o mapa nas coordenadas do usuario
            map.setCenter(new google.maps.LatLng(lat, lng));
            markerLoc = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(lat, lng),
                icon: 'position.png',
                animation: google.maps.Animation.DROP
            });
            
            var service = new google.maps.places.PlacesService(map);
            service.textSearch({
                location: new google.maps.LatLng(lat, lng),
                radius: 5,
                query: 'bicicletario'
            }, callBack);
        });
    }
    else {
        //se o navegador não suporta ou usuario não autoriza a geolocation
        map.setCenter(new google.maps.LatLng(-23.5505199, -46.63330939999997));
    }

    //definindo autocomplete em um determinado campo
    var autocomplete = new google.maps.places.Autocomplete(
        (document.querySelector("#origem")), { types: ['geocode'] });


    //selecionando campo pelo DOM 
    var origem = document.querySelector("#origem");

    //adicionando evento de fesfoque do campo
    origem.addEventListener("blur", function() {
        if (markerLoc != null) {
            markerLoc.setMap(null);
        }

        infowindow = new google.maps.InfoWindow();
        //funcção de geocodificar
        geocoder.geocode({ 'address': origem.value }, function(results, status) {
            //verificando status da requisição
            if (status == "OK") {
                //setando mapa no centro do endereço digitado
                map.setCenter(results[0].geometry.location);
                //preenchendo campo com endereço formatado
                //origem.value = results[0].formatted_address;
                //criando marker no mapa
                markerLoc = new google.maps.Marker({
                    //setando posição do marker
                    position: results[0].geometry.location,
                    //definindo icone
                    icon: 'position.png',
                    //setando em que mapa o marker vai aparecer
                    map: map,
                    //setadno animação de reenderização do marker
                    animation: google.maps.Animation.DROP

                });

                google.maps.event.addListener(markerLoc, 'click', function() {
                    infowindow.setContent("endereço pesquisado");
                    infowindow.open(map, this);
                });

            }
            else {
                //   alert("não foi possível localizar o local. " + status);
            }
            
            var service = new google.maps.places.PlacesService(map);
            service.TextSearch({
                location: results[0].geometry.location,
                radius: 500,
                query: 'bicicletario'
            }, callBack);
        });
    });

    function callBack(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            
            showMarkers();
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        marker = new google.maps.Marker({
            map: map,
            position: placeLoc,
            icon: 'bike.png'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
        
        markers.push(marker);
    }
    
    function showMarkers() {
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        
        map.fitBounds(bounds);
    }
}
