import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

const container = document.getElementById("treemap-container");
const output = document.getElementById("percentage-output-room-types");
const color = d3
	.scaleOrdinal()
	.domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
	.range(["#ffffff", "#d7d7d7", "#8c8c8c", "#5e5e5e"]);

const roomTypeData = d3.rollup(
	tokyoData,
	(v) => v.length,
	(d) => d.room_type
);
const totalEntries = tokyoData.length;
let currentMode = "room-types";
let currentEntries = roomTypeData;
let currentIsNeighborhood = false;

function setOutput(text) {
	if (output) output.textContent = text;
}

function describeDatum(name, count, prefix = "There are") {
	const percentage = ((count / totalEntries) * 100).toFixed(2);
	return `${prefix} ${count.toLocaleString("de-DE")} ${name}. That is ${percentage}% of Tokyo listings.`;
}

function buildRoot(entries) {
	return d3
		.hierarchy({
			children: Array.from(entries, ([name, value]) => ({ name, value })),
		})
		.sum((d) => d.value)
		.sort((a, b) => b.value - a.value);
}

function resetToRoomTypes() {
	currentEntries = roomTypeData;
	currentIsNeighborhood = false;
	renderPack(buildRoot(currentEntries), currentIsNeighborhood);
	setOutput("Click a room type to inspect neighborhood distribution.");
}

function drillIntoRoomType(roomType) {
	const filteredData = tokyoData.filter((listing) => listing.room_type === roomType);
	currentEntries = d3.rollup(
		filteredData,
		(v) => v.length,
		(listing) => listing.neighbourhood
	);
	currentIsNeighborhood = true;
	renderPack(buildRoot(currentEntries), currentIsNeighborhood);
	setOutput(`Showing neighborhoods for ${roomType}. Click anywhere inside the chart to reset.`);
}

function renderCurrentPack() {
	renderPack(buildRoot(currentEntries), currentIsNeighborhood);
}

function renderPack(root, isNeighborhood = false) {
	if (!container) return;
	currentMode = isNeighborhood ? "neighborhoods" : "room-types";
	const rect = container.getBoundingClientRect();
	const width = Math.max(220, rect.width);
	const height = Math.max(180, rect.height);
	const svg = d3.select(container).selectAll("svg").data([null]).join("svg");

	svg.selectAll("*").remove();
	svg
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("role", "img")
		.attr("aria-label", "Tokyo Airbnb room type distribution");

	d3.pack().size([width, height]).padding(Math.max(3, Math.min(width, height) * 0.018))(root);

	const nodes = svg
		.selectAll("g")
		.data(root.leaves())
		.enter()
		.append("g")
		.attr("class", "pack-node")
		.attr("transform", (d) => `translate(${d.x},${d.y})`)
		.attr("tabindex", 0)
		.attr("role", "button")
		.attr("aria-label", (d) => `${d.data.name}: ${d.value.toLocaleString("de-DE")} listings`);

	nodes
		.append("circle")
		.attr("class", "pack-hit-area")
		.attr("r", (d) => d.r + Math.max(8, Math.min(width, height) * 0.025))
		.attr("fill", "transparent");

	nodes
		.append("circle")
		.attr("class", "pack-visible-circle")
		.attr("r", (d) => d.r)
		.attr("fill", (d) => (isNeighborhood ? "rgba(255,255,255,0.75)" : color(d.data.name)))
		.attr("opacity", 0.96);

	function activateNode(event, d) {
		event.stopPropagation();
		if (isNeighborhood) {
			resetToRoomTypes();
			return;
		}

		drillIntoRoomType(d.data.name);
	}

	nodes
		.on("mouseover", (event, d) => {
			setOutput(
				isNeighborhood
					? describeDatum(d.data.name, d.value, "This neighborhood contains")
					: describeDatum(d.data.name, d.value)
			);
		})
		.on("mouseout", () => {
			setOutput(isNeighborhood ? "Click anywhere inside the chart to return to room types." : "Click a room type to inspect neighborhood distribution.");
		})
		.on("click", activateNode)
		.on("keydown", (event, d) => {
			if (event.key === "Enter" || event.key === " ") {
				activateNode(event, d);
			}
		});

	nodes
		.append("text")
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.attr("pointer-events", "none")
		.text((d) => (d.r > 34 ? d.data.name : ""));

	svg.on("click", (event) => {
		if (event.target !== svg.node()) return;

		if (currentMode === "neighborhoods") {
			resetToRoomTypes();
			return;
		}

		const largestRoomType = Array.from(roomTypeData).sort((a, b) => b[1] - a[1])[0]?.[0];
		if (!largestRoomType) return;
		drillIntoRoomType(largestRoomType);
	});
}

if (container) {
	const observer = new ResizeObserver(renderCurrentPack);
	observer.observe(container);
	renderCurrentPack();
}
