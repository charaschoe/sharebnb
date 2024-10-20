// Load data from JSON file
d3.json("data/newyork.json")
	.then(function (data) {
		// Comprehensive mapping of neighborhoods to districts
		const neighborhoodToDistrict = {
			// Manhattan
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
			// Brooklyn
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
			// Queens
			Astoria: "Queens",
			"Long Island City": "Queens",
			Flushing: "Queens",
			"Jackson Heights": "Queens",
			"Forest Hills": "Queens",
			"Rego Park": "Queens",
			"Jamaica Estates": "Queens",
			"Rockaway Beach": "Queens",
			// Bronx
			Riverdale: "Bronx",
			Kingsbridge: "Bronx",
			Fordham: "Bronx",
			Belmont: "Bronx",
			"Throgs Neck": "Bronx",
			"Pelham Bay": "Bronx",
			"City Island": "Bronx",
			// Staten Island
			"St. George": "Staten Island",
			"New Brighton": "Staten Island",
			Tompkinsville: "Staten Island",
			"Stapleton Heights": "Staten Island",
			"West Brighton": "Staten Island",
			"Great Kills": "Staten Island",
			Tottenville: "Staten Island",
			// Additional Bronx neighborhoods
			"West Farms": "Bronx",
			Melrose: "Bronx",
			Concourse: "Bronx",
			Highbridge: "Bronx",
			"University Heights": "Bronx",
			// Staten Island continued
			"New Dorp": "Staten Island",
			"Port Richmond": "Staten Island",
			Stapleton: "Staten Island",
			Rosebank: "Staten Island",
			"South Beach": "Staten Island",
			Oakwood: "Staten Island",
			Arrochar: "Staten Island",
			// Additional Brooklyn neighborhoods
			"Bushwick South": "Brooklyn",
			"Clinton Hill": "Brooklyn",
			"Boerum Hill": "Brooklyn",
			"Carroll Gardens": "Brooklyn",
			"Cobble Hill": "Brooklyn",
			"Vinegar Hill": "Brooklyn",
			"Downtown Brooklyn": "Brooklyn",
			"Prospect Lefferts Gardens": "Brooklyn",
			"Ditmas Park": "Brooklyn",
			Midwood: "Brooklyn",
			"Marine Park": "Brooklyn",
			Bensonhurst: "Brooklyn",
			"Bath Beach": "Brooklyn",
			Mapleton: "Brooklyn",
			"Fort Hamilton": "Brooklyn",
			"Gravesend Neck Road": "Brooklyn",
			Homecrest: "Brooklyn",
			Madison: "Brooklyn",
			"Old Mill Basin": "Brooklyn",
			"Plumb Beach": "Brooklyn",
			Georgetown: "Brooklyn",
			"Bergen Beach": "Brooklyn",
			"Floyd Bennett Field": "Brooklyn",
			"Spring Creek": "Brooklyn",
			"Highland Park": "Brooklyn",
			"City Line": "Brooklyn",
			"New Lots": "Brooklyn",
			"Paerdegat Basin": "Brooklyn",
			"Remsen Village": "Brooklyn",
			Rugby: "Brooklyn",
			Weeksville: "Brooklyn",
			"Wyckoff Gardens": "Brooklyn",
			"Ocean Hill": "Brooklyn",
			Brownsville: "Brooklyn",
			"Broadway Junction": "Brooklyn",
			"Ocean Parkway": "Brooklyn",
			Seagate: "Brooklyn",
			"Sea Gate": "Brooklyn",
		};

		// Count districts
		const districtCounts = {};
		data.forEach((listing) => {
			const neighborhood = listing.neighbourhood;
			const district = neighborhoodToDistrict[neighborhood] || "Other";
			if (districtCounts[district]) {
				districtCounts[district]++;
			} else {
				districtCounts[district] = 1;
			}
		});

		// Convert counts to an array suitable for D3
		const districtData = Object.keys(districtCounts).map((district) => ({
			district: district,
			count: districtCounts[district],
		}));

		const height = 425;
		const width = (700 / 500) * height;

		const svg = d3.select("svg");

		// Draw boundary circle
		const boundaryRadius = Math.min(width, height) / 2 - 20;
		const centerX = width / 2;
		const centerY = height / 2;

		svg.append("circle")
			.attr("cx", centerX)
			.attr("cy", centerY)
			.attr("r", boundaryRadius)
			.attr("fill", "none")
			.attr("stroke", "white")
			.attr("stroke-width", 2);

		const sizeScale = d3
			.scaleLinear()
			.domain([0, d3.max(districtData, (d) => d.count)])
			.range([20, 70]);

		const simulation = d3
			.forceSimulation(districtData)
			.force("x", d3.forceX(centerX).strength(0.1))
			.force("y", d3.forceY(centerY).strength(0.1))
			.force(
				"collision",
				d3.forceCollide().radius((d) => sizeScale(d.count) + 2)
			)
			.on("tick", ticked);

		const drag = d3
			.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);

		function ticked() {
			const u = svg.selectAll("circle.bubble").data(districtData);

			u.enter()
				.append("circle")
				.attr("class", "bubble")
				.attr("r", (d) => sizeScale(d.count))
				.call(drag)
				.merge(u)
				.attr("cx", (d) => {
					const r = sizeScale(d.count);
					const dx = d.x - centerX;
					const dy = d.y - centerY;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance + r > boundaryRadius) {
						const angle = Math.atan2(dy, dx);
						d.x = centerX + (boundaryRadius - r) * Math.cos(angle);
					}
					return d.x;
				})
				.attr("cy", (d) => {
					const r = sizeScale(d.count);
					const dx = d.x - centerX;
					const dy = d.y - centerY;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance + r > boundaryRadius) {
						const angle = Math.atan2(dy, dx);
						d.y = centerY + (boundaryRadius - r) * Math.sin(angle);
					}
					return d.y;
				});

			const t = svg.selectAll("text").data(districtData);

			t.enter()
				.append("text")
				.merge(t)
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y + 4)
				.text((d) => d.district);
		}

		function dragstarted(event, d) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
	})
	.catch(function (error) {
		console.error("Error loading or processing data:", error);
	});
