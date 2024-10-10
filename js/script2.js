import { populationData } from "../data/population.js";

// Function to count the total number of occurrences of '"id": '
function countIds(listings) {
    return listings.reduce((count, listing) => {
        return count + (listing.hasOwnProperty("id") ? 1 : 0);
    }, 0);
}

const cities = [
    { name: "cape-town", file: "../data/capetown.json" },
    { name: "paris", file: "../data/paris.json" },
    { name: "tokyo", file: "../data/tokyo.json" },
    { name: "new-york", file: "../data/newyork.json" },
    { name: "rio", file: "../data/riodejaneiro.json" },
    { name: "sydney", file: "../data/sydney.json" },
    { name: "istanbul", file: "../data/istanbul.json" },
];

const numberFormatter = new Intl.NumberFormat("de-DE");

cities.forEach((city) => {
    fetch(city.file)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Data for ${city.name}:`, data); // Debugging-Ausgabe
            const totalIds = countIds(data);
            const cityData = populationData.find(p => p.city.toLowerCase().replace(" ", "-") === city.name);
            if (!cityData) {
                console.error(`No population data found for ${city.name}`);
                return;
            }
            const population = cityData.population;
            const tourists = cityData.tourists;
            document.getElementById(`total-ids-${city.name}`).textContent =
                numberFormatter.format(totalIds);
            document.getElementById(`population-${city.name}`).textContent =
                `Population: ${numberFormatter.format(population)}`;
            document.getElementById(`tourists-${city.name}`).textContent =
                `Tourists: ${numberFormatter.format(tourists)}`;
        })
        .catch((error) => {
            console.error(
                `Error fetching the Airbnb listings for ${city.name}:`,
                error
            );
            document.getElementById(`total-ids-${city.name}`).textContent =
                "Error";
            document.getElementById(`population-${city.name}`).textContent =
                "Error";
            document.getElementById(`tourists-${city.name}`).textContent =
                "Error";
        });
});
