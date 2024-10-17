import { populationData } from "../data/population.js";
import { apartments } from "../data/apartments.js"; // Import der Apartment-Daten

// Funktion zur Zählung der Gesamtanzahl der Vorkommen von '"id": '
function countIds(listings) {
	return listings.reduce((count, listing) => {
		return count + (listing.hasOwnProperty("id") ? 1 : 0);
	}, 0);
}

import { tokyoData } from "../data/tokyo.js";

const cities = [
	{ name: "paris", file: "../data/paris.json" },
	// { name: "tokyo", file: "../data/tokyo.js" },
	{ name: "new-york", file: "../data/newyork.json" },
];
console.log(`Data for tokyo:`, tokyoData);
const totalIds = countIds(tokyoData);

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
			
			// Check if city is Paris and then initiate the circle animation logic
			if (city.name === "paris") {
				initializeParisCircles(data); // Init animation with data
			}
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

// Funktion für Paris-Circles
function initializeParisCircles(data) {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const slider = document.getElementById("slider");
	const sliderValueDisplay = document.getElementById("slider-value");

	const maxRadius = 120; // Maximum radius of the largest circle

	let currentAvailableRadius = 0;
	let currentNonAvailableRadius = 0;
	let targetAvailableRadius = 0;
	let targetNonAvailableRadius = 0;
	const animationDuration = 500; // Animation duration in milliseconds
	let animationStartTime = null;

	// Adjust canvas for high DPI displays to prevent blurriness
	function adjustCanvasSize() {
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		
		// Set canvas width and height based on device pixel ratio for sharpness
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		
		// Scale the drawing context to match the device pixel ratio
		ctx.scale(dpr, dpr);
	}

	// Function to draw a circle
	// Function to draw a circle
// Function to draw a circle
// Function to draw a circle
// Function to draw a circle and percentage text
function drawCircle(x, y, radius, percentage) {
    // Zeichne den Kreis
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ffffff"; // Weißer Füllkreis
    ctx.fill();

    const backgroundColor = "#c5ecc9"; // Hintergrundfarbe
    const fontSize = 30; // Schriftgröße der Prozentzahl
    const text = percentage + "%";

    // Setze die Text-Eigenschaften
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(text).width;

    // Zeichne den Text in Weiß (für den gesamten Text, sowohl innen als auch außen)
    ctx.fillStyle = "#ffffff"; // Weiße Schriftfarbe
    ctx.fillText(text, x, y);

    // Clipping-Bereich für den inneren Kreis
    ctx.save(); // Speichere den aktuellen Canvas-Zustand
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); // Zeichne den Kreis als Clip-Bereich
    ctx.clip(); // Clip nur den inneren Teil des Kreises

    // Zeichne den Text erneut, diesmal in der Hintergrundfarbe nur innerhalb des Kreises
    ctx.fillStyle = backgroundColor; // Textfarbe = Hintergrundfarbe innerhalb des Kreises
    ctx.fillText(text, x, y);

    // Clipping aufheben
    ctx.restore(); // Stelle den Canvas-Zustand wieder her (Clip aufheben)
}





	// Function to calculate the average availability and non-availability
	function calculateAverages(minimumNights) {
		const filteredData = data.filter(airbnb => airbnb.minimum_nights === minimumNights);

		if (filteredData.length === 0) {
			return { availablePercentage: 0, nonAvailablePercentage: 0 };
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
