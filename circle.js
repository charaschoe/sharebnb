const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("slider");
const sliderValueDisplay = document.getElementById("slider-value");

const maxRadius = 120; // Maximum radius of the largest circle
let data = []; // Placeholder for the data from paris.json

// Fetch the data from paris.json
fetch('data/paris.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        updateCircles(); // Call updateCircles with the fetched data
    })
    .catch(error => console.error('Error fetching JSON:', error));

// Adjust canvas for high DPI displays to prevent blurriness
function adjustCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas width and height based on device pixel ratio for sharpness
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the drawing context to match the device pixel ratio
    ctx.scale(dpr, dpr);
}

// Function to draw a circle
function drawCircle(x, y, radius, percentage) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ffffff"; // White fill
    ctx.fill();

    // Draw percentage text in the center of the circle
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(percentage + "%", x, y);
}

// Function to calculate the average availability and non-availability
function calculateAverages(minimumNights) {
    const filteredData = data.filter(airbnb => airbnb.minimum_nights === minimumNights);

    if (filteredData.length === 0) {
        return { availablePercentage: 0, nonAvailablePercentage: 0 };
    }

    let totalAvailable = 0;
    let totalNonAvailable = 0;

    filteredData.forEach(airbnb => {
        totalAvailable += airbnb.availability_365;
        totalNonAvailable += (365 - airbnb.availability_365);
    });

    const averageAvailable = totalAvailable / filteredData.length;
    const averageNonAvailable = totalNonAvailable / filteredData.length;

    const availablePercentage = Math.round((averageAvailable / 365) * 100);
    const nonAvailablePercentage = 100 - availablePercentage;

    return { availablePercentage, nonAvailablePercentage };
}

// Function to update the circle sizes dynamically based on the slider value and data
function updateCircles() {
    adjustCanvasSize(); // Adjust canvas size for sharpness on high-DPI displays

    const minimumNights = parseInt(slider.value, 10); // Get the minimum nights from the slider

    const { availablePercentage, nonAvailablePercentage } = calculateAverages(minimumNights);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the radii for each circle
    const availableRadius = (availablePercentage / 100) * maxRadius;
    const nonAvailableRadius = (nonAvailablePercentage / 100) * maxRadius;

    // Draw the "available" circle (left side)
    drawCircle(150, 150, availableRadius, availablePercentage);

    // Draw the "not available" circle (right side)
    drawCircle(350, 150, nonAvailableRadius, nonAvailablePercentage);

    // Update the slider value display
    sliderValueDisplay.innerText = `Minimum Nights: ${minimumNights}`;
}

// Event listener for the slider input
slider.addEventListener("input", updateCircles);

// Set the initial canvas size based on device pixel ratio
function initializeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = '500px';
    canvas.style.height = '300px';
    canvas.width = 500 * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);
}

// Initialize and draw the first frame
initializeCanvas();
