

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {//Se debe llamar asi, o cambiarlo en el script usado para acceder a la API
    /**
      *Crea la caja de autocompletado y la restringe al tipo geocode
      *geocode le indica al servicio de autocompletado de sitios que devuelva solo
      *resultados de geocodificación, en lugar de resultados de negocios
      */
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')), {types: ['geocode']});

// Al elegir un lugar dentro del cuadro desplegable, llena los campos del form
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Trae el lugar elegido
  var place = autocomplete.getPlace();
//Habilita los campos del form
  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Llena los datos del form
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
// Genera los limites (BOUNDS) segun la ubicacion del usuario, o en caso de no
//poder obtenerla utiliza coordenadas por default
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }else{
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631));
      autocomplete.setBounds(defaultBounds);
  }
}
