// Verwende die d3-Bibliothek direkt aus einem CDN
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

// Größe des SVG-Containers
const height = 425;
const width = (700 / 500) * height; // Maintain the same aspect ratio

// Farbskala (angepasst für besseren Kontrast)
const color = d3
	.scaleOrdinal()
	.domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
	.range(["#fff", "#E5E5E5", "#858585", "#b3b3b3"]); // Kontrastreichere Farben

// Erstelle ein SVG-Element im richtigen Container
const svg = d3
	.select("#treemap-container") // Hier wird der "treemap-container" verwendet
	.append("svg")
	.attr("width", width)
	.attr("height", height);

console.log("SVG-Element im #treemap-container erstellt:", svg);

// Verwende die `tokyoData`-Konstante aus der "tokyo.js"
const data = tokyoData;
console.log("Originaldaten:", data);

// Gruppiere die Daten nach "room_type" und zähle die Anzahl der Einträge pro Typ
const roomTypeData = d3.rollup(
	data,
	(v) => v.length,
	(d) => d.room_type
);
console.log("Gruppierte Daten nach room_type:", roomTypeData);

// Gesamtzahl der Einträge
const totalEntries = data.length;

// Anzahl der "Entire home/apt" Einträge
const entireHomeCount = roomTypeData.get("Entire home/apt") || 0;

// Berechnung des Prozentsatzes
const percentageEntireHome = ((entireHomeCount / totalEntries) * 100).toFixed(
	2
);
console.log(`Prozentsatz der 'Entire home/apt': ${percentageEntireHome}%`);

// Funktion zur Anzeige des Prozentsatzes
function showPercentageOutput(roomType, count, neighborhood = null) {
	let roomTypeName;
	switch (roomType) {
		case "Entire home/apt":
			roomTypeName = "entire apartments";
			break;
		case "Private room":
			roomTypeName = "private rooms";
			break;
		case "Shared room":
			roomTypeName = "shared rooms";
			break;
		case "Hotel room":
			roomTypeName = "Hotel rooms";
			break;
		default:
			roomTypeName = roomType;
	}
	let text = `There are ${count} ${roomTypeName}.`; //prozentzahl anzeigen!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	if (neighborhood !== null) {
		text += ` in the neighborhood ${neighborhood}.`;
	}
	const percentage = ((count / totalEntries) * 100).toFixed(2);
	text += ` That is ${percentage}%.`;
	d3.select("#percentage-output")
		.text(text)
		.style("display", "block")
		.style("position", "fixed")
		.style("left", "25%") // Center horizontally
		.style("transform", "translateX(-50%)") // Adjust for centering
		.style("top", "184px") // Fixed position from the bottom
		.style("font-size", "16px")
		.style("font-family", "Inter")
		.style("font-weight", "400");
}

// Funktion zum Zeichnen des Pack-Layouts
function drawPackLayout(root, isFiltered = false) {
	const nodes = svg.selectAll("g").data(root.leaves(), (d) => d.data.name);

	const nodesEnter = nodes
		.enter()
		.append("g")
		.attr("transform", (d) => `translate(${d.x},${d.y})`);

	nodesEnter
		.append("circle")
		.attr("r", (d) => d.r)
		.attr("fill", (d) => color(d.data.name));

	nodesEnter
		.merge(nodes)
		.attr("transform", (d) => `translate(${d.x},${d.y})`);

	nodes.exit().remove();

	nodesEnter
		.on("mouseover", function (event, d) {
			const roomType = d.data.name;
			const count = d.value;
			const neighborhood = isFiltered ? d.data.name : null;
			showPercentageOutput(roomType, count, neighborhood);
		})
		.on("mouseout", function () {
			d3.select("#percentage-output").style("display", "none");
		});

	nodesEnter.on("click", (event, d) => {
		if (isFiltered) {
			drawInitialPackLayout();
		} else {
			updatePackLayout(d.data.name);
		}
	});
}

// Funktion zum Aktualisieren des Pack-Layouts basierend auf dem ausgewählten Raumtyp
function updatePackLayout(roomType) {
	const filteredData = data.filter((d) => d.room_type === roomType);
	const neighborhoodData = d3.rollup(
		filteredData,
		(v) => v.length,
		(d) => d.neighbourhood
	);

	const newRoot = d3
		.hierarchy({
			children: Array.from(neighborhoodData, ([key, value]) => ({
				name: key,
				value,
			})),
		})
		.sum((d) => d.value)
		.sort((a, b) => b.value - a.value);

	d3.pack().size([width, height]).padding(2)(newRoot);

	drawPackLayout(newRoot, true);
}

// Zeichne das initiale Pack-Layout
function drawInitialPackLayout() {
	const root = d3
		.hierarchy({
			children: Array.from(roomTypeData, ([key, value]) => ({
				name: key,
				value,
			})),
		})
		.sum((d) => d.value)
		.sort((a, b) => b.value - a.value);

	d3.pack().size([width, height]).padding(2)(root);

	drawPackLayout(root);
}

drawInitialPackLayout();
