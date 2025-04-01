import { populationData } from "../data/population.js";
import { apartments } from "../data/apartments.js"; // Import der Apartment-Daten
import { initializeParisCircles } from "./circle.js"; // Importiere die Funktion aus der circle.js
import { tokyoData } from "../data/tokyo.js";

// Secure function to count IDs
function countIds(listings) {
	if (!Array.isArray(listings)) return 0;
	return listings.reduce((count, listing) => {
		return (
			count +
			(Object.prototype.hasOwnProperty.call(listing, "id") ? 1 : 0)
		);
	}, 0);
}

// Sanitize and format numbers
const numberFormatter = new Intl.NumberFormat("de-DE");

// Update Tokyo data
const totalIdsTokyo = countIds(tokyoData);
const tokyoCityData = populationData.find(
	(p) => p.city.toLowerCase().replace(/\s+/g, "-") === "tokyo"
);
const tokyoApartmentData = apartments.find(
	(a) => a.city.toLowerCase().replace(/\s+/g, "-") === "tokyo"
);

function updateTokyoData() {
	if (tokyoCityData && tokyoApartmentData) {
		const populationTokyo = tokyoCityData.population;
		const touristsTokyo = tokyoCityData.tourists;
		const apartmentCountTokyo = tokyoApartmentData.apartments;
		const airbnbIndexTokyo = totalIdsTokyo / apartmentCountTokyo;

		// Use textContent instead of innerHTML for security
		document.getElementById("total-ids-tokyo").textContent =
			numberFormatter.format(totalIdsTokyo);
		document.getElementById(
			"population-tokyo"
		).textContent = `Population: ${numberFormatter.format(
			populationTokyo
		)}`;
		document.getElementById(
			"tourists-tokyo"
		).textContent = `Tourists: ${numberFormatter.format(touristsTokyo)}`;
		document.getElementById(
			"apartments-tokyo"
		).textContent = `Apartments: ${numberFormatter.format(
			apartmentCountTokyo
		)}`;
		document.getElementById(
			"airbnb-index-tokyo"
		).textContent = `Airbnb Index: ${numberFormatter.format(
			airbnbIndexTokyo
		)}`;
	} else {
		console.error("No data found for Tokyo");
		const errorElements = [
			"total-ids-tokyo",
			"population-tokyo",
			"tourists-tokyo",
			"apartments-tokyo",
			"airbnb-index-tokyo",
		];
		errorElements.forEach((id) => {
			const element = document.getElementById(id);
			if (element) element.textContent = "Error";
		});
	}
}

// Update city data with error handling
async function updateCityData(city) {
	try {
		const response = await fetch(city.file);
		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();

		const totalIds = countIds(data);
		const cityData = populationData.find(
			(p) => p.city.toLowerCase().replace(/\s+/g, "-") === city.name
		);
		const apartmentData = apartments.find(
			(a) => a.city.toLowerCase().replace(/\s+/g, "-") === city.name
		);

		if (!cityData || !apartmentData) {
			console.error(`No data found for ${city.name}`);
			return;
		}

		const population = cityData.population;
		const tourists = cityData.tourists;
		const apartmentCount = apartmentData.apartments;
		const airbnbIndex = totalIds / apartmentCount;

		// Use textContent instead of innerHTML for security
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
	} catch (error) {
		console.error(`Error updating data for ${city.name}:`, error);
	}
}

// Initialize data
updateTokyoData();

const cities = [
	{ name: "paris", file: "../data/paris.json" },
	{ name: "new-york", file: "../data/newyork.json" },
];

// Update all cities
cities.forEach(updateCityData);

document.addEventListener("DOMContentLoaded", () => {
	// Beispielaufruf, um die Kreise zu initialisieren
	initializeParisCircles(yourDataArray);
});
