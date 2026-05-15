function loadParisData() {
	if (!window.parisDataPromise) {
		window.parisDataPromise = fetch("data/paris.json").then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		});
	}

	return window.parisDataPromise;
}

function getPrice(listing) {
	return Number(listing.price ?? listing.column_10) || 0;
}

function aggregateMinimumNights(data) {
	const buckets = new Map();

	data.forEach((listing) => {
		const minimumNights = Number(listing.minimum_nights) || 0;
		if (minimumNights < 1 || minimumNights > 32) return;

		const current = buckets.get(minimumNights) || {
			minimumNights,
			count: 0,
			totalPrice: 0,
		};
		current.count += 1;
		current.totalPrice += getPrice(listing);
		buckets.set(minimumNights, current);
	});

	return Array.from(buckets.values())
		.sort((a, b) => a.minimumNights - b.minimumNights)
		.map((bucket) => ({
			...bucket,
			averagePrice: bucket.count ? bucket.totalPrice / bucket.count : 0,
		}));
}

async function initializeBarChart() {
	try {
		const container = document.getElementById("chart-container-paris");
		const hoverInfo = document.getElementById("hover-info");
		if (!container || !window.d3) return;

		const data = await loadParisData();
		const chartData = aggregateMinimumNights(data);

		function render() {
			const rect = container.getBoundingClientRect();
			const width = Math.max(260, rect.width);
			const height = Math.max(180, rect.height);
			const margin = {
				top: Math.max(14, height * 0.08),
				right: Math.max(14, width * 0.04),
				bottom: Math.max(34, height * 0.15),
				left: Math.max(42, width * 0.11),
			};
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			const svg = d3.select(container).selectAll("svg").data([null]).join("svg");
			svg.selectAll("*").remove();
			svg
				.attr("class", "paris-bar-chart")
				.attr("viewBox", [0, 0, width, height])
				.attr("preserveAspectRatio", "xMidYMid meet")
				.attr("role", "img")
				.attr("aria-label", "Paris Airbnb listings grouped by minimum nights");

			const g = svg
				.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);

			const x = d3
				.scaleBand()
				.domain(chartData.map((d) => d.minimumNights))
				.range([0, innerWidth])
				.padding(0.18);

			const y = d3
				.scaleLinear()
				.domain([0, d3.max(chartData, (d) => d.count)])
				.nice()
				.range([innerHeight, 0]);

			g.append("g")
				.attr("class", "axis axis-x")
				.attr("transform", `translate(0,${innerHeight})`)
				.call(
					d3
						.axisBottom(x)
						.tickValues([1, 2, 3, 4, 5, 7, 10, 14, 21, 30, 32])
				);

			g.append("g")
				.attr("class", "axis axis-y")
				.call(d3.axisLeft(y).ticks(4).tickFormat(d3.format("~s")));

			g.selectAll("rect")
				.data(chartData)
				.enter()
				.append("rect")
				.attr("x", (d) => x(d.minimumNights))
				.attr("y", (d) => y(d.count))
				.attr("width", x.bandwidth())
				.attr("height", (d) => innerHeight - y(d.count))
				.attr("rx", 2)
				.on("mouseover", function (event, d) {
					d3.select(this).attr("class", "is-active");
					if (hoverInfo) {
						hoverInfo.textContent = `${d.count.toLocaleString(
							"de-DE"
						)} listings require at least ${
							d.minimumNights
						} night(s). Average price: EUR ${Math.round(
							d.averagePrice
						).toLocaleString("de-DE")}.`;
					}
				})
				.on("mouseout", function () {
					d3.select(this).attr("class", null);
					if (hoverInfo) {
						hoverInfo.textContent = "Hover over a bar to see details.";
					}
				});
		}

		const observer = new ResizeObserver(render);
		observer.observe(container);
		render();
	} catch (error) {
		console.error("Error initializing Paris bar chart:", error);
	}
}

document.addEventListener("DOMContentLoaded", initializeBarChart);
