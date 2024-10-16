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

const contentData = {
	1: ["ShareBnB 1", "ShareBnB 2", "ShareBnB 3"],
	2: ["NEW YORK 1", "NEW YORK 2", "NEW YORK 3"],
	3: ["RIO 1", "RIO 2", "RIO 3"],
	4: ["CAPE TOWN 1", "CAPE TOWN 2", "CAPE TOWN 3"],
	5: ["PARIS 1", "PARIS 2", "PARIS 3"],
	6: ["TOKYO 1", "TOKYO 2", "TOKYO 3"],
	7: ["SYDNEY 1", "SYDNEY 2", "SYDNEY 3"],
	8: ["ISTANBUL 1", "ISTANBUL 2", "ISTANBUL 3"],
	// Füge hier Inhalte für die weiteren Tabs hinzu
};

let currentIndex = { 1: 0, 2: 0, 3: 0, 4: 0 };

document.querySelectorAll(".arrow").forEach((arrow) => {
	arrow.addEventListener("click", function () {
		const labelId = this.id.split("-")[1]; // extrahiert die ID (z.B. "1" aus "prev-1")
		const direction = this.id.split("-")[0]; // erkennt ob prev oder next

		// Inhalt für das jeweilige Label updaten
		if (direction === "prev") {
			currentIndex[labelId] =
				(currentIndex[labelId] - 1 + contentData[labelId].length) %
				contentData[labelId].length;
		} else {
			currentIndex[labelId] =
				(currentIndex[labelId] + 1) % contentData[labelId].length;
		}

		document.getElementById(`content-${labelId}`).textContent =
			contentData[labelId][currentIndex[labelId]];
	});
});
