import { populationData } from "../data/population.js";
import { apartments } from "../data/apartments.js"; // Import der Apartment-Daten

// Funktion zur Zählung der Gesamtanzahl der Vorkommen von '"id": '
function countIds(listings) {
	return listings.reduce((count, listing) => {
		return count + (listing.hasOwnProperty("id") ? 1 : 0);
	}, 0);
}

const cities = [
	{ name: "cape-town", file: "../data/capetown.json" },
	{ name: "paris", file: "../data/paris.json" },
	{ name: "tokyo", file: "../data/tokyo.json" },
	{ name: "new-york", file: "../data/newyork.json" },
	{ name: "rio", file: "../data/riodejaneiro.json" },
	{ name: "sydney", file: "../data/sydney.json" },
	{ name: "istanbul", file: "../data/istanbul.json" },
];

const numberFormatter = new Intl.NumberFormat("de-DE");

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
			const airbnbIndex = totalIds / apartmentCount; // Berechnung des neuen Index

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
			).textContent = `Apartments: ${numberFormatter.format(
				apartmentCount
			)}`; // Anzeige der Apartment-Anzahl
			document.getElementById(
				`airbnb-index-${city.name}`
			).textContent = `Airbnb Index: ${numberFormatter.format(
				airbnbIndex
			)}`; // Anzeige des neuen Index
		})
		.catch((error) => {
			console.error(
				`Error fetching the Airbnb listings for ${city.name}:`,
				error
			);
			document.getElementById(`total-ids-${city.name}`).textContent =
				"Error";
			document.getElementById(`population-${city.name}`).textContent =
				"Error";
			document.getElementById(`tourists-${city.name}`).textContent =
				"Error";
			document.getElementById(`apartments-${city.name}`).textContent =
				"Error"; // Fehleranzeige für Apartments
			document.getElementById(`airbnb-index-${city.name}`).textContent =
				"Error"; // Fehleranzeige für den neuen Index
		});
});
