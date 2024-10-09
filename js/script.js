document.addEventListener("DOMContentLoaded", function () {
	const dropdown = document.createElement("select");
	const inhabitantsDisplay = document.createElement("div");
	document.body.appendChild(dropdown);
	document.body.appendChild(inhabitantsDisplay);

	fetch("population.csv")
		.then((response) => response.text())
		.then((data) => {
			const cities = parseCSV(data);
			populateDropdown(cities);
			dropdown.addEventListener("change", function () {
				const selectedCity = dropdown.value;
				const population = cities[selectedCity];
				inhabitantsDisplay.textContent = `Inhabitants: ${population}`;
			});
		});

	function parseCSV(data) {
		const lines = data.split("\n");
		const result = {};
		lines.forEach((line) => {
			const [city, population] = line.split(",");
			if (city && population) {
				result[city] = population;
			}
		});
		return result;
	}

	function populateDropdown(cities) {
		for (const city in cities) {
			const option = document.createElement("option");
			option.value = city;
			option.textContent = city;
			dropdown.appendChild(option);
		}
	}
});
