import { populationData } from "../data/population.js";
import { apartments } from "../data/apartments.js"; // Import der Apartment-Daten
import { tokyoData } from "../data/tokyo.js"; // Import der Tokyo JS-Daten

// Funktion zur Zählung der Gesamtanzahl der Vorkommen von '"id": '
function countIds(listings) {
	return listings.reduce((count, listing) => {
		return count + (listing.hasOwnProperty("id") ? 1 : 0);
	}, 0);
}

const cities = [
	{ name: "paris", file: "../data/paris.json" },
	{ name: "new-york", file: "../data/newyork.json" },
	// Tokyo hier manuell hinzufügen, da wir es direkt importieren
];

const numberFormatter = new Intl.NumberFormat("de-DE");

// ** Verarbeitung für Tokyo, da kein fetch verwendet wird **
console.log(`Data for tokyo:`, tokyoData);
const totalIdsTokyo = countIds(tokyoData);
const tokyoCityData = populationData.find((p) => p.city.toLowerCase().replace(" ", "-") === "tokyo");
const tokyoApartmentData = apartments.find((a) => a.city.toLowerCase().replace(" ", "-") === "tokyo");

if (tokyoCityData && tokyoApartmentData) {
	const populationTokyo = tokyoCityData.population;
	const touristsTokyo = tokyoCityData.tourists;
	const apartmentCountTokyo = tokyoApartmentData.apartments;
	const airbnbIndexTokyo = totalIdsTokyo / apartmentCountTokyo;

	document.getElementById(`total-ids-tokyo`).textContent = numberFormatter.format(totalIdsTokyo);
	document.getElementById(`population-tokyo`).textContent = `Population: ${numberFormatter.format(populationTokyo)}`;
	document.getElementById(`tourists-tokyo`).textContent = `Tourists: ${numberFormatter.format(touristsTokyo)}`;
	document.getElementById(`apartments-tokyo`).textContent = `Apartments: ${numberFormatter.format(apartmentCountTokyo)}`;
	document.getElementById(`airbnb-index-tokyo`).textContent = `Airbnb Index: ${numberFormatter.format(airbnbIndexTokyo)}`;
} else {
	console.error(`No data found for Tokyo`);
	document.getElementById(`total-ids-tokyo`).textContent = "Error";
	document.getElementById(`population-tokyo`).textContent = "Error";
	document.getElementById(`tourists-tokyo`).textContent = "Error";
	document.getElementById(`apartments-tokyo`).textContent = "Error";
	document.getElementById(`airbnb-index-tokyo`).textContent = "Error";
}

// ** Verarbeitung für die anderen Städte mit fetch **
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
			).textContent = `Apartments: ${numberFormatter.format(apartmentCount)}`;
			document.getElementById(
				`airbnb-index-${city.name}`
			).textContent = `Airbnb Index: ${numberFormatter.format(airbnbIndex)}`;
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

const apartmentPrices = {};
apartments.forEach((apartment) => {
	apartmentPrices[apartment.city.toLowerCase().replace(" ", "_")] =
		apartment.apartments;
});

const numberOfPeople = 50;

// Assuming apartmentPrices.js exports an object with prices
const averageRent = apartmentPrices["new_york"]; // Use the price from the external file

// Average salary calculation
const averageSalary = 134000 / 12; // Monthly income based on $134,000 annual salary

// Calculate affordable people based on the 30% rule
const affordablePeople = Math.floor(
	((averageSalary * 0.3) / averageRent) * numberOfPeople
);

const dotsContainer = document.getElementById("dots");
const infoText = document.getElementById("info-text");

for (let i = 0; i < numberOfPeople; i++) {
	const dot = document.createElement("div");
	dot.className =
		"dot " + (i < affordablePeople ? "affordable" : "non-affordable");

	dot.addEventListener("mouseenter", () => {
		infoText.textContent = `Median income is $${averageSalary.toFixed(
			2
		)} per month. Airbnb price per night is $${(averageRent / 30).toFixed(
			2
		)}.`;
	});

	dot.addEventListener("mouseleave", () => {
		infoText.textContent =
			"Out of 50 people, only a few can afford to live in NYC based on the median income.";
	});

	dotsContainer.appendChild(dot);
}
