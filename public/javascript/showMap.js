
    mapboxgl.accessToken = mapboxToken;

  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h5>${campground.name}</h5><p>${campground.location}</p>`
    );

  const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(popup)
.addTo(map);
