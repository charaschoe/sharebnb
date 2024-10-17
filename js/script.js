import { populationData } from "../data/population.js";
import { apartments } from "../data/apartments.js"; // Import der Apartment-Daten
import { initializeParisCircles } from './circle.js'; // Importiere die Funktion aus der circle.js

// Funktion zur Zählung der Gesamtanzahl der Vorkommen von '"id": '
function countIds(listings) {
	return listings.reduce((count, listing) => {
		return count + (listing.hasOwnProperty("id") ? 1 : 0);
	}, 0);
}

import { tokyoData } from "../data/tokyo.js";

// Überprüfe, ob die Daten geladen wurden
console.log('Tokyo Data:', tokyoData);

const totalListings = tokyoData.length; // Beispiel: Gesamtzahl der Einträge
document.getElementById('total-ids-tokyo').textContent = totalListings;


const cities = [
	{ name: "paris", file: "../data/paris.json" },
	{ name: "new-york", file: "../data/newyork.json" },
];

const totalIds = countIds(tokyoData);

const numberFormatter = new Intl.NumberFormat("de-DE");
console.log(`Data for tokyo:`, tokyoData);
const totalIdsTokyo = countIds(tokyoData);
const tokyoCityData = populationData.find(
    (p) => p.city.toLowerCase().replace(" ", "-") === "tokyo"
);
const tokyoApartmentData = apartments.find(
    (a) => a.city.toLowerCase().replace(" ", "-") === "tokyo"
);
if (tokyoCityData && tokyoApartmentData) {
    const populationTokyo = tokyoCityData.population;
    const touristsTokyo = tokyoCityData.tourists;
    const apartmentCountTokyo = tokyoApartmentData.apartments;
    const airbnbIndexTokyo = totalIdsTokyo / apartmentCountTokyo;
    document.getElementById(`total-ids-tokyo`).textContent =
        numberFormatter.format(totalIdsTokyo);
    document.getElementById(
        `population-tokyo`
    ).textContent = `Population: ${numberFormatter.format(populationTokyo)}`;
    document.getElementById(
        `tourists-tokyo`
    ).textContent = `Tourists: ${numberFormatter.format(touristsTokyo)}`;
    document.getElementById(
        `apartments-tokyo`
    ).textContent = `Apartments: ${numberFormatter.format(
        apartmentCountTokyo
    )}`;
    document.getElementById(
        `airbnb-index-tokyo`
    ).textContent = `Airbnb Index: ${numberFormatter.format(airbnbIndexTokyo)}`;
} else {
    console.error(`No data found for Tokyo`);
    document.getElementById(`total-ids-tokyo`).textContent = "Error";
    document.getElementById(`population-tokyo`).textContent = "Error";
    document.getElementById(`tourists-tokyo`).textContent = "Error";
    document.getElementById(`apartments-tokyo`).textContent = "Error";
    document.getElementById(`airbnb-index-tokyo`).textContent = "Error";
}
cities.forEach((city) => {
	fetch(city.file)
		.then((response) => response.json())
		.then((data) => {
			console.log(`Data for ${city.name}:`, data); // Debugging-Ausgabe
			const totalIds = countIds(data);
			const cityData = populationData.find(
				(p) => p.city.toLowerCase().replace(" ", "-") === city.name
			);
			const apartmentData = apartments.find(
				(a) => a.city.toLowerCase().replace(" ", "-") === city.name
			);
			if (!cityData || !apartmentData) {
				console.error(`No data found for ${city.name}`);
				return;
			}
			const population = cityData.population;
			const tourists = cityData.tourists;
			const apartmentCount = apartmentData.apartments;
			const airbnbIndex = totalIds / apartmentCount;

			document.getElementById(`total-ids-${city.name}`).textContent =
				numberFormatter.format(totalIds);
			document.getElementById(
				`population-${city.name}`
			).textContent = `Population: ${numberFormatter.format(population)}`;
			document.getElementById(
				`tourists-${city.name}`
			).textContent = `Tourists: ${numberFormatter.format(tourists)}`;
			document.getElementById(
				`apartments-${city.name}`
			).textContent = `Apartments: ${numberFormatter.format(apartmentCount)}`;

			document.getElementById(
				`airbnb-index-${city.name}`
			).textContent = `Airbnb Index: ${numberFormatter.format(airbnbIndex)}`;

			// Check if city is Paris and then initiate the circle animation logic
			if (city.name === "paris") {
				initializeParisCircles(data); // Aufruf der circle.js Funktion
			}
		})
		.catch((error) => {
			console.error(`Error fetching the Airbnb listings for ${city.name}:`, error);
			document.getElementById(`total-ids-${city.name}`).textContent = "Error";
			document.getElementById(`population-${city.name}`).textContent = "Error";
			document.getElementById(`tourists-${city.name}`).textContent = "Error";
			document.getElementById(`apartments-${city.name}`).textContent = "Error";
			document.getElementById(`airbnb-index-${city.name}`).textContent = "Error";
		});
});
