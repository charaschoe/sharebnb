import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

const container = document.getElementById("chart-container");
const tooltip = d3.select("#tooltip");
const domain = ["1", "2", "3", "4", "5-9", "10-19", "20-49", "50+"];
const hostListingsData = d3.rollup(
	tokyoData,
	(v) => v.length,
	(d) => {
		const count = d.calculated_host_listings_count;
		if (count >= 50) return "50+";
		if (count >= 20) return "20-49";
		if (count >= 10) return "10-19";
		if (count >= 5) return "5-9";
		return String(count);
	}
);
const totalEntries = tokyoData.length;
const sortedData = Array.from(hostListingsData).sort(
	(a, b) => domain.indexOf(a[0]) - domain.indexOf(b[0])
);

function renderHostChart() {
	if (!container) return;
	const rect = container.getBoundingClientRect();
	const width = Math.max(260, rect.width);
	const height = Math.max(180, rect.height);
	const margin = {
		top: Math.max(16, height * 0.08),
		right: Math.max(16, width * 0.05),
		bottom: Math.max(34, height * 0.14),
		left: Math.max(42, width * 0.11),
	};
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const svg = d3.select(container).selectAll("svg").data([null]).join("svg");
	svg.selectAll("*").remove();
	svg
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("role", "img")
		.attr("aria-label", "Tokyo host listing concentration");

	const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
	const x = d3.scalePoint().domain(domain).range([0, innerWidth]);
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(sortedData, (d) => d[1])])
		.nice()
		.range([innerHeight, 0]);
	const line = d3.line().x((d) => x(d[0])).y((d) => y(d[1]));

	g.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x).tickSize(0).tickPadding(8));

	g.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(6).tickFormat(d3.format("~s")));

	g.append("path")
		.datum(sortedData)
		.attr("fill", "none")
		.attr("stroke", "white")
		.attr("stroke-width", 3)
		.attr("d", line);

	g.selectAll(".dot")
		.data(sortedData)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("cx", (d) => x(d[0]))
		.attr("cy", (d) => y(d[1]))
		.attr("r", Math.max(5, Math.min(width, height) * 0.018))
		.attr("fill", "transparent")
		.attr("stroke", "white")
		.attr("stroke-width", 3)
		.on("mouseover", function (event, d) {
			d3.select(this).attr("r", Math.max(7, Math.min(width, height) * 0.026));
			const listingText = d[0] === "1" ? "listing" : "listings";
			const percentage = ((d[1] / totalEntries) * 100).toFixed(2);
			tooltip
				.style("opacity", 1)
				.html(`${d[1].toLocaleString("de-DE")} Airbnbs are from hosts with ${d[0]} ${listingText}. ${percentage}% of Tokyo listings.`);
		})
		.on("mouseout", function () {
			d3.select(this).attr("r", Math.max(5, Math.min(width, height) * 0.018));
			tooltip.style("opacity", 0);
		});

	g.append("text")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + margin.bottom - 4)
		.attr("text-anchor", "middle")
		.attr("fill", "white")
		.attr("font-size", "12")
		.text("Listings per host");
}

if (container) {
	const observer = new ResizeObserver(renderHostChart);
	observer.observe(container);
	renderHostChart();
}
