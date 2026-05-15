const neighborhoodToDistrict = {
	Chelsea: "Manhattan",
	Harlem: "Manhattan",
	"Upper East Side": "Manhattan",
	"Upper West Side": "Manhattan",
	"Greenwich Village": "Manhattan",
	SoHo: "Manhattan",
	Tribeca: "Manhattan",
	"Financial District": "Manhattan",
	"East Village": "Manhattan",
	"Lower East Side": "Manhattan",
	Midtown: "Manhattan",
	"Hell's Kitchen": "Manhattan",
	Chinatown: "Manhattan",
	"East Harlem": "Manhattan",
	NoHo: "Manhattan",
	"Gramercy Park": "Manhattan",
	"Battery Park City": "Manhattan",
	"Little Italy": "Manhattan",
	"Washington Heights": "Manhattan",
	Inwood: "Manhattan",
	Williamsburg: "Brooklyn",
	Bushwick: "Brooklyn",
	"Park Slope": "Brooklyn",
	"Coney Island": "Brooklyn",
	"Brooklyn Heights": "Brooklyn",
	DUMBO: "Brooklyn",
	"Bedford-Stuyvesant": "Brooklyn",
	Flatbush: "Brooklyn",
	Greenpoint: "Brooklyn",
	"Prospect Heights": "Brooklyn",
	"Fort Greene": "Brooklyn",
	"Red Hook": "Brooklyn",
	"Sunset Park": "Brooklyn",
	"Bay Ridge": "Brooklyn",
	Astoria: "Queens",
	"Long Island City": "Queens",
	Flushing: "Queens",
	"Jackson Heights": "Queens",
	"Forest Hills": "Queens",
	"Rego Park": "Queens",
	"Jamaica Estates": "Queens",
	"Rockaway Beach": "Queens",
	Riverdale: "Bronx",
	Kingsbridge: "Bronx",
	Fordham: "Bronx",
	Belmont: "Bronx",
	"Throgs Neck": "Bronx",
	"Pelham Bay": "Bronx",
	"City Island": "Bronx",
	"St. George": "Staten Island",
	"New Brighton": "Staten Island",
	Tompkinsville: "Staten Island",
	"Stapleton Heights": "Staten Island",
	"West Brighton": "Staten Island",
	"Great Kills": "Staten Island",
	Tottenville: "Staten Island",
};

function countDistricts(data) {
	const districtCounts = {};
	data.forEach((listing) => {
		const district = neighborhoodToDistrict[listing.neighbourhood];
		if (!district) return;
		districtCounts[district] = (districtCounts[district] || 0) + 1;
	});

	return Object.entries(districtCounts).map(([district, count]) => ({
		district,
		count,
	}));
}

function renderNewYorkBubbles(container, districtData) {
	const rect = container.getBoundingClientRect();
	const width = Math.max(240, rect.width);
	const height = Math.max(180, rect.height);
	const diameter = Math.max(160, Math.min(width, height) - 8);
	const radius = diameter / 2;
	const centerX = width / 2;
	const centerY = height / 2;
	const svg = d3.select(container).select("svg");
	const caption = document.getElementById("info-text-new-york");
	const defaultCaption =
		"Click a borough bubble to compare listing pressure by area.";
	let selectedDistrict = null;

	svg.selectAll("*").remove();
	svg
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("role", "img");

	svg.append("circle")
		.attr("cx", centerX)
		.attr("cy", centerY)
		.attr("r", radius)
		.attr("fill", "none")
		.attr("stroke", "rgba(255,255,255,0.75)")
		.attr("stroke-width", 2);

	const hierarchy = d3
		.hierarchy({ children: districtData })
		.sum((d) => d.count)
		.sort((a, b) => b.value - a.value);
	const packed = d3.pack().size([diameter, diameter]).padding(6)(hierarchy);
	const nodesData = packed
		.leaves()
		.map((node) => ({
			...node.data,
			x: node.x + centerX - radius,
			y: node.y + centerY - radius,
			r: node.r,
		}));

	const total = d3.sum(districtData, (d) => d.count);
	const setCaption = (d) => {
		if (!caption) return;
		if (!d) {
			caption.textContent = defaultCaption;
			return;
		}
		const share = total ? ((d.count / total) * 100).toFixed(1) : "0.0";
		caption.textContent = `${d.district}: ${d.count.toLocaleString(
			"en-US"
		)} listings, ${share}% of the mapped sample.`;
	};

	const selectDistrict = (event, d) => {
		event.stopPropagation();
		selectedDistrict = selectedDistrict === d.district ? null : d.district;
		groups.classed("is-selected", (node) => node.district === selectedDistrict);
		setCaption(selectedDistrict ? d : null);
	};

	svg.on("click", () => {
		selectedDistrict = null;
		groups.classed("is-selected", false);
		setCaption(null);
	});

	const groups = svg
		.selectAll("g")
		.data(nodesData)
		.enter()
		.append("g")
		.attr("class", "borough-node")
		.attr("tabindex", 0)
		.attr("role", "button")
		.attr("aria-label", (d) => `${d.district}: ${d.count} Airbnb listings`)
		.attr("transform", (d) => `translate(${d.x},${d.y})`)
		.on("click", selectDistrict)
		.on("keydown", (event, d) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				selectDistrict(event, d);
			}
		});

	groups
		.append("circle")
		.attr("class", "borough-hit-area")
		.attr("r", (d) => d.r + 6);

	groups
		.append("circle")
		.attr("class", "borough-visible-circle")
		.attr("r", (d) => d.r);

	groups
		.append("text")
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.attr("fill", "white")
		.attr("font-weight", 700)
		.attr("font-size", (d) => Math.max(9, Math.min(16, d.r / 4)))
		.text((d) => d.district);

	setCaption(null);
}

d3.json("data/newyork.json")
	.then((data) => {
		const container = document.getElementById("new-york-bubbles");
		if (!container) return;
		const districtData = countDistricts(data);
		const render = () => renderNewYorkBubbles(container, districtData);
		const observer = new ResizeObserver(render);
		observer.observe(container);
		render();
	})
	.catch((error) => {
		console.error("Error loading or processing New York data:", error);
	});
