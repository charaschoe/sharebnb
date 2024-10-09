const fs = require("fs");
const path = require("path");

// Path to the JSON file
const jsonFilePath = path.join(__dirname, "data", "capetown.json");

console.log(`Reading JSON file from: ${jsonFilePath}`);

// Read the JSON file
fs.readFile(jsonFilePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading the JSON file:", err);
		return;
	}

	console.log("Raw JSON data:", data);

	try {
		// Parse the JSON data
		const airbnbs = JSON.parse(data);

		// Count the number of Airbnbs
		const count = airbnbs.length;

		console.log(`Number of Airbnbs: ${count}`);
	} catch (parseErr) {
		console.error("Error parsing the JSON data:", parseErr);
	}
});
