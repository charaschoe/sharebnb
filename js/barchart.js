// Sanitize input data
function sanitizeData(data) {
	if (!Array.isArray(data)) return [];
	return data.map((item) => ({
		...item,
		price: Number(item.price) || 0,
		minimum_nights: Number(item.minimum_nights) || 0,
		availability_365: Number(item.availability_365) || 0,
	}));
}

// Initialize bar chart with error handling
async function initializeBarChart() {
	try {
		const container = document.getElementById("chart-container-paris");
		if (!container) {
			console.error("Chart container not found");
			return;
		}

		// Clear any existing content
		container.innerHTML = "";

		// Create SVG with proper namespace
		const svg = d3
			.select("#chart-container-paris")
			.append("svg")
			.attr("width", "100%")
			.attr("height", "400")
			.attr("viewBox", [0, 0, 800, 400])
			.attr("style", "max-width: 100%; height: auto;");

		// Fetch and sanitize data
		const response = await fetch("../data/paris.json");
		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		const sanitizedData = sanitizeData(data);

		// Create scales
		const x = d3
			.scaleBand()
			.domain(sanitizedData.map((d) => d.minimum_nights))
			.range([50, 750])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(sanitizedData, (d) => d.price)])
			.range([350, 50]);

		// Add axes
		svg.append("g")
			.attr("transform", `translate(0,${350})`)
			.call(d3.axisBottom(x))
			.selectAll("text")
			.style("fill", "#ffffff");

		svg.append("g")
			.attr("transform", "translate(50,0)")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.style("fill", "#ffffff");

		// Add bars with error handling
		svg.selectAll("rect")
			.data(sanitizedData)
			.enter()
			.append("rect")
			.attr("x", (d) => x(d.minimum_nights))
			.attr("y", (d) => y(d.price))
			.attr("width", x.bandwidth())
			.attr("height", (d) => 350 - y(d.price))
			.attr("fill", "#96bcab")
			.attr("opacity", 0.8)
			.on("mouseover", function (event, d) {
				d3.select(this).attr("opacity", 1);

				// Update hover info safely
				const hoverInfo = document.getElementById("hover-info");
				if (hoverInfo) {
					hoverInfo.textContent = `Price: €${d.price.toFixed(
						2
					)} per night`;
				}
			})
			.on("mouseout", function () {
				d3.select(this).attr("opacity", 0.8);

				// Reset hover info safely
				const hoverInfo = document.getElementById("hover-info");
				if (hoverInfo) {
					hoverInfo.textContent = "Hover over a bar to see details";
				}
			});
	} catch (error) {
		console.error("Error initializing bar chart:", error);
	}
}

// Initialize the chart when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeBarChart);
