// Function to count the total number of occurrences of '"id": '
function countIds(listings) {
    return listings.reduce((count, listing) => {
        return count + (listing.hasOwnProperty("id") ? 1 : 0);
    }, 0);
}

const cities = [
    { name: "cape-town", file: "/data/capetown.json" },
    { name: "paris", file: "/data/paris.json" },
    { name: "tokyo", file: "/data/tokyo.json" },
    { name: "new-york", file: "/data/newyork.json" },
    { name: "riodejaneiro", file: "/data/riodejaneiro.json" },
    { name: "sydney", file: "/data/sydney.json" },
    { name: "istanbul", file: "/data/istanbul.json" }
];

cities.forEach(city => {
    fetch(city.file)
        .then((response) => response.json())
        .then((data) => {
            const totalIds = countIds(data);
            document.getElementById(`total-ids-${city.name}`).textContent = totalIds;
        })
        .catch((error) => {
            console.error(`Error fetching the Airbnb listings for ${city.name}:`, error);
            document.getElementById(`total-ids-${city.name}`).textContent = "Error";
        });
});
