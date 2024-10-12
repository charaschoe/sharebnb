fetch('capetown2.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        return response.json();
    })
    .then(data => {
        console.log("Geladene Daten:", data); // Log die geladenen Daten
        if (Array.isArray(data)) {
            data.forEach(function(location) {
                var coordinates = location.coordinates;
                console.log("Koordinaten:", coordinates); // Log die Koordinaten
                L.circleMarker([coordinates.lat, coordinates.lon], {
                    radius: 6, // Größe des Punktes
                    fillColor: "#ff0000", // Rote Farbe
                    color: "#ff0000", // Randfarbe
                    weight: 1, // Randbreite
                    opacity: 1, // Deckkraft des Randes
                    fillOpacity: 1 // Deckkraft des Punktes
                })
                .addTo(map)
                .bindPopup(location.name);
            });
        } else {
            console.error("Die JSON-Daten sind nicht im erwarteten Format.");
        }
    })
    .catch(error => {
        console.error('Fehler beim Laden der JSON-Daten:', error);
    });
