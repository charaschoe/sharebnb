// Load the JSON data
d3.json("istanbul.json")
	.then((data) => {
		// Calculate the total number of listings
		const totalListings = data.length;

		// Display the total on the webpage
		d3.select("#total").text(totalListings);
	})
	.catch((error) => {
		console.error("Error loading the JSON data:", error);
	});
