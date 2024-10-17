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
			).textContent = `Apartments: ${numberFormatter.format(
				apartmentCount
			)}`;
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

		let totalAvailable = 0;
		let totalNonAvailable = 0;

		filteredData.forEach(airbnb => {
			totalAvailable += airbnb.availability_365;
			totalNonAvailable += (365 - airbnb.availability_365);
		});

		const averageAvailable = totalAvailable / filteredData.length;
		const averageNonAvailable = totalNonAvailable / filteredData.length;

		const availablePercentage = Math.round((averageAvailable / 365) * 100);
		const nonAvailablePercentage = 100 - availablePercentage;

		return { availablePercentage, nonAvailablePercentage };
	}

	// Function to update the target radii based on the slider value and data
	function updateCircles() {
		adjustCanvasSize(); // Adjust canvas size for sharpness on high-DPI displays

		const minimumNights = parseInt(slider.value, 10); // Get the minimum nights from the slider

		const { availablePercentage, nonAvailablePercentage } = calculateAverages(minimumNights);

		// Update target radii for the animation
		targetAvailableRadius = (availablePercentage / 100) * maxRadius;
		targetNonAvailableRadius = (nonAvailablePercentage / 100) * maxRadius;

		// Start animation
		animationStartTime = null;
		requestAnimationFrame(animateCircles);

		// Update the slider value display
		sliderValueDisplay.innerText = `Minimum Nights: ${minimumNights}`;
	}

	// Function to animate the circle sizes
	function animateCircles(timestamp) {
		if (!animationStartTime) animationStartTime = timestamp;
		const elapsed = timestamp - animationStartTime;

		// Calculate progress (0 to 1)
		const progress = Math.min(elapsed / animationDuration, 1);

		// Smoothly interpolate the radii
		currentAvailableRadius = currentAvailableRadius + (targetAvailableRadius - currentAvailableRadius) * progress;
		currentNonAvailableRadius = currentNonAvailableRadius + (targetNonAvailableRadius - currentNonAvailableRadius) * progress;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the "available" circle (left side)
		drawCircle(150, 150, currentAvailableRadius, Math.round((currentAvailableRadius / maxRadius) * 100));

		// Draw the "not available" circle (right side)
		drawCircle(350, 150, currentNonAvailableRadius, Math.round((currentNonAvailableRadius / maxRadius) * 100));

		// Continue the animation if it's not done yet
		if (progress < 1) {
			requestAnimationFrame(animateCircles);
		}
	}

	// Event listener for the slider input
	slider.addEventListener("input", updateCircles);

	// Set the initial canvas size based on device pixel ratio
	function initializeCanvas() {
		const dpr = window.devicePixelRatio || 1;
		canvas.style.width = '500px';
		canvas.style.height = '300px';
		canvas.width = 500 * dpr;
		canvas.height = 300 * dpr;
		ctx.scale(dpr, dpr);
	}

	// Initialize and draw the first frame
	initializeCanvas();
}
