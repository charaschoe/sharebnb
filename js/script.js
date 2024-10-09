import fs from "fs";
import path from "path";

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
		const listings = JSON.parse(data);

		// Log the total number of listings
		console.log(`Total number of listings: ${listings.length}`);

		// Count the number of listings
		const count = listings.length;

		console.log(`Number of listings: ${count}`);
	} catch (parseErr) {
		console.error("Error parsing the JSON data:", parseErr);
	}
});
