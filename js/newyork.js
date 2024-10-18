const apartmentPrices = {};
apartments.forEach((apartment) => {
	apartmentPrices[apartment.city.toLowerCase().replace(" ", "_")] =
		apartment.apartments;
});

const numberOfPeople = 50;

// Assuming apartmentPrices.js exports an object with prices
const averageRent = apartmentPrices["new_york"]; // Use the price from the external file

// Average salary calculation
const averageSalary = 134000 / 12; // Monthly income based on $134,000 annual salary

// Calculate affordable people based on the 30% rule
const affordablePeople = Math.floor(
	((averageSalary * 0.3) / averageRent) * numberOfPeople
);

const dotsContainer = document.getElementById("dots");
const infoText = document.getElementById("info-text");

for (let i = 0; i < numberOfPeople; i++) {
	const dot = document.createElement("div");
	dot.className =
		"dot " + (i < affordablePeople ? "affordable" : "non-affordable");

	dot.addEventListener("mouseenter", () => {
		infoText.textContent = `Median income is $${averageSalary.toFixed(
			2
		)} per month. Airbnb price per night is $${(averageRent / 30).toFixed(
			2
		)}.`;
	});

	dot.addEventListener("mouseleave", () => {
		infoText.textContent =
			"Out of 50 people, only a few can afford to live in NYC based on the median income.";
	});

	dotsContainer.appendChild(dot);
}