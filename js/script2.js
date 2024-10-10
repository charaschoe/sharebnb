// Function to count the total number of occurrences of '"id": '
function countIds(listings) {
    return listings.reduce((count, listing) => {
        return count + (listing.hasOwnProperty('id') ? 1 : 0);
    }, 0);
}

// Fetch the Airbnb listings from the specified JSON file
fetch('/data/capetown.json')
    .then(response => response.json())
    .then(data => {
        const totalIds = countIds(data);
        document.getElementById('total-ids').textContent = totalIds;
    })
    .catch(error => {
        console.error('Error fetching the Airbnb listings:', error);
        document.getElementById('total-ids').textContent = 'Error';
    });
