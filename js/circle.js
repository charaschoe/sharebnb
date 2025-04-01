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

// Initialize circles with error handling
export function initializeParisCircles(data) {
	try {
		const sanitizedData = sanitizeData(data);
		const width = 500;
		const height = 500;
		const radius = Math.min(width, height) / 2 - 10;

		// Clear any existing SVG
		const container = document.querySelector(".svg-container svg");
		if (container) {
			container.innerHTML = "";
		}

		// Create SVG with proper namespace
		const svg = d3
			.select(".svg-container svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		// Create group for circles
		const g = svg
			.append("g")
			.attr("transform", `translate(${width / 2},${height / 2})`);

		// Create scales
		const priceScale = d3
			.scaleLinear()
			.domain([0, d3.max(sanitizedData, (d) => d.price)])
			.range([10, radius]);

		const colorScale = d3
			.scaleOrdinal()
			.domain(["low", "medium", "high"])
			.range(["#4CAF50", "#FFC107", "#F44336"]);

		// Create circles with error handling
		g.selectAll("circle")
			.data(sanitizedData)
			.enter()
			.append("circle")
			.attr("r", (d) => priceScale(d.price))
			.attr("fill", (d) => {
				const price = d.price;
				if (price < 100) return colorScale("low");
				if (price < 200) return colorScale("medium");
				return colorScale("high");
			})
			.attr("opacity", 0.6)
			.attr("stroke", "#fff")
			.attr("stroke-width", 1)
			.on("mouseover", function (event, d) {
				d3.select(this).attr("opacity", 1).attr("stroke-width", 2);

				// Update info text safely
				const infoText = document.getElementById("info-text-new-york");
				if (infoText) {
					infoText.textContent = `Price: €${d.price.toFixed(
						2
					)} per night`;
				}
			})
			.on("mouseout", function () {
				d3.select(this).attr("opacity", 0.6).attr("stroke-width", 1);

				// Reset info text safely
				const infoText = document.getElementById("info-text-new-york");
				if (infoText) {
					infoText.textContent =
						"In New York, Airbnb listings are spread across various neighborhoods, impacting local housing markets and contributing to rising rent prices. The concentration of short-term rentals in certain areas can lead to gentrification and displacement of long-term residents.";
				}
			});
	} catch (error) {
		console.error("Error initializing circles:", error);
	}
}
