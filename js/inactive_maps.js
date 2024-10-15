{
	/* <div id="map-nyc" class="map"></div>
<div id="map-paris" class="map"></div>
<div id="map-rio" class="map"></div>
<div id="map-cape-town" class="map"></div>
<div id="map-sydney" class="map"></div>
<div id="map-tokyo" class="map"></div>
<div id="map-istanbul" class="map"></div>

<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<style>
    .map {
        width: 120%;
        height: 200px;
        margin-left: -200%;
    }
</style>
<script>
    // Reusable function to initialize a map
    function initializeMap(mapId, centerCoordinates, jsonFile) {
        const map = L.map(mapId, {
            center: centerCoordinates,
            zoom: 10,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: true,
            doubleClickZoom: false,
            touchZoom: false,
            keyboard: false,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
            maxZoom: 18,
            attribution: "Map data © OpenStreetMap contributors, CartoDB",
            opacity: 0.8,
        }).addTo(map);

        fetch(jsonFile)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((listing) => {
                    const { lat, lon } = listing.coordinates;
                    L.circleMarker([lat, lon], {
                        color: "white",
                        fillColor: "#ffffff",
                        fillOpacity: 1,
                        radius: 5,
                    })
                        .addTo(map)
                        .bindPopup(`<b>${listing.name}</b><br>Neighbourhood: ${listing.neighbourhood}`);
                });
            })
            .catch((error) => console.error(`Error loading the JSON file for ${mapId}:`, error));
    }

    // Initialize maps for different cities
    const cityData = [
        { id: "map-nyc", coords: [40.7128, -74.006], file: "nyc.json" },
        { id: "map-paris", coords: [48.8566, 2.3522], file: "paris.json" },
        { id: "map-rio", coords: [-22.9068, -43.1729], file: "rio.json" },
        { id: "map-cape-town", coords: [-33.9249, 18.4241], file: "capetown.json" },
        { id: "map-sydney", coords: [-33.8688, 151.2093], file: "sydney.json" },
        { id: "map-tokyo", coords: [35.6895, 139.6917], file: "tokyo.json" },
        { id: "map-istanbul", coords: [41.0082, 28.9784], file: "istanbul.json" }
    ];

    // Loop through cityData to initialize maps
    cityData.forEach(city => initializeMap(city.id, city.coords, city.file));
</script> */
}
