export function initializeParisCircles(data) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const slider = document.getElementById("slider");
    const sliderValueDisplay = document.getElementById("slider-value");

    const maxRadius = 120; // Maximaler Radius des größten Kreises

    let currentAvailableRadius = 0;
    let currentNonAvailableRadius = 0;
    let targetAvailableRadius = 0;
    let targetNonAvailableRadius = 0;
    const animationDuration = 500; // Animationsdauer in Millisekunden
    let animationStartTime = null;

    // Anpassung der Canvas-Größe für hochauflösende Displays, um Unschärfe zu verhindern
    function adjustCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Setze die Breite und Höhe des Canvas basierend auf der Geräte-Pixel-Ratio
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Skalierung des Zeichenkontextes zur Anpassung an die Geräte-Pixel-Ratio
        ctx.scale(dpr, dpr);
    }

    // Funktion zur Berechnung der durchschnittlichen Verfügbarkeit und Nichtverfügbarkeit
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

    // Funktion zur Aktualisierung der Zielradien basierend auf dem Slider-Wert und den Daten
    function updateCircles() {
        adjustCanvasSize(); // Anpassung der Canvas-Größe für Schärfe auf hochauflösenden Displays

        const minimumNights = parseInt(slider.value, 10); // Holen des minimalen Nächte-Werts vom Slider

        const { availablePercentage, nonAvailablePercentage } = calculateAverages(minimumNights);

        // Aktualisieren der Zielradien für die Animation
        targetAvailableRadius = (availablePercentage / 100) * maxRadius;
        targetNonAvailableRadius = (nonAvailablePercentage / 100) * maxRadius;

        // Starte die Animation
        animationStartTime = null;
        requestAnimationFrame(animateCircles);

        // Aktualisiere die Anzeige des Slider-Werts
        sliderValueDisplay.innerText = `Minimum Nights: ${minimumNights}`;
    }

    // Funktion zur Animation der Kreisgrößen
    function animateCircles(timestamp) {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsed = timestamp - animationStartTime;

        // Berechnung des Fortschritts (0 bis 1)
        const progress = Math.min(elapsed / animationDuration, 1);

        // Weiche Interpolation der Radien
        currentAvailableRadius = currentAvailableRadius + (targetAvailableRadius - currentAvailableRadius) * progress;
        currentNonAvailableRadius = currentNonAvailableRadius + (targetNonAvailableRadius - currentNonAvailableRadius) * progress;

        // Löschen des Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Zeichnen des "available"-Kreises (linke Seite)
        drawCircle(150, 150, currentAvailableRadius, Math.round((currentAvailableRadius / maxRadius) * 100));

        // Zeichnen des "not available"-Kreises (rechte Seite)
        drawCircle(350, 150, currentNonAvailableRadius, Math.round((currentNonAvailableRadius / maxRadius) * 100));

        // Fortsetzen der Animation, falls sie noch nicht abgeschlossen ist
        if (progress < 1) {
            requestAnimationFrame(animateCircles);
        }
    }

    // Funktion zum Zeichnen eines Kreises und der Prozentanzeige
    function drawCircle(x, y, radius, percentage) {
        // Zeichnen des Kreises
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#ffffff"; // Füllfarbe des Kreises
        ctx.fill();

        const backgroundColor = "#c5ecc9"; // Hintergrundfarbe
        const fontSize = 30; // Schriftgröße der Prozentzahl
        const text = percentage + "%";

        // Setze die Text-Eigenschaften
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textWidth = ctx.measureText(text).width;

        // Zeichne den Text in Weiß (für den gesamten Text, sowohl innen als auch außen)
        ctx.fillStyle = "#ffffff"; // Weiße Schriftfarbe
        ctx.fillText(text, x, y);

        // Wenn der Kreis kleiner als der Text ist, färbe den Text im inneren Bereich des Kreises
        if (radius * 2 < textWidth) {
            ctx.save(); // Speichere den aktuellen Canvas-Zustand
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI); // Definiere den Clip-Bereich (innerhalb des Kreises)
            ctx.clip(); // Clip nur den inneren Teil des Kreises

            // Zeichne den Text erneut, diesmal in der Hintergrundfarbe nur innerhalb des Kreises
            ctx.fillStyle = backgroundColor; // Textfarbe = Hintergrundfarbe innerhalb des Kreises
            ctx.fillText(text, x, y);

            ctx.restore(); // Stelle den Canvas-Zustand wieder her
        }
    }

    // Eventlistener für den Slider-Input
    slider.addEventListener("input", updateCircles);

    // Setze die initiale Canvas-Größe basierend auf der Geräte-Pixel-Ratio
    function initializeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = '500px';
        canvas.style.height = '300px';
        canvas.width = 500 * dpr;
        canvas.height = 300 * dpr;
        ctx.scale(dpr, dpr);
    }

    // Initialisieren und Zeichnen des ersten Frames
    initializeCanvas();
}
