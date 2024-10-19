// Verwende die d3-Bibliothek direkt aus einem CDN
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

// Größe des SVG-Containers
const height = 425;
const width = (700 / 500) * height; // Maintain the same aspect ratio

// Farbskala (angepasst für besseren Kontrast)
const color = d3.scaleOrdinal()
  .domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
  .range(["#fff", "#E5E5E5", "#858585", "#b3b3b3"]); // Kontrastreichere Farben

// Erstelle ein SVG-Element im richtigen Container
const svg = d3
  .select("#treemap-container")  // Hier wird der "treemap-container" verwendet
  .append("svg")
  .attr("width", width)
  .attr("height", height);

console.log("SVG-Element im #treemap-container erstellt:", svg);

// Verwende die `tokyoData`-Konstante aus der "tokyo.js"
const data = tokyoData;
console.log("Originaldaten:", data);

// Gruppiere die Daten nach "room_type" und zähle die Anzahl der Einträge pro Typ
const roomTypeData = d3.rollup(
  data,
  (v) => v.length,
  (d) => d.room_type
);
console.log("Gruppierte Daten nach room_type:", roomTypeData);

// Gesamtzahl der Einträge
const totalEntries = data.length;

// Anzahl der "Entire home/apt" Einträge
const entireHomeCount = roomTypeData.get("Entire home/apt") || 0;

// Berechnung des Prozentsatzes
const percentageEntireHome = ((entireHomeCount / totalEntries) * 100).toFixed(2);
console.log(`Prozentsatz der 'Entire home/apt': ${percentageEntireHome}%`);

// Ausgabe des Prozentsatzes in HTML
// d3.select("#percentage-output")
//   .text(`In ${percentageEntireHome}% der Zeit hast du ein Appartment für dich alleine.`);

// Konvertiere die Daten in ein hierarchisches Format
const root = d3
  .hierarchy({ children: Array.from(roomTypeData, ([key, value]) => ({ name: key, value })) })
  .sum((d) => d.value)
  .sort((a, b) => b.value - a.value);

console.log("Hierarchische Datenstruktur (root):", root);

// Erstelle ein Pack-Layout
d3.pack().size([width, height]).padding(2)(root);
console.log("Pack-Layout erstellt:", root.leaves());

// Zeichne die Kreise des Pack-Layouts
const node = svg
  .selectAll("g")
  .data(root.leaves())
  .enter()
  .append("g")
  .attr("transform", (d) => `translate(${d.x},${d.y})`);

console.log("Anzahl der Knoten (Kreise):", node.size());

// Kreise
node
  .append("circle")
  .attr("r", (d) => d.r)
  .attr("fill", (d) => color(d.data.name));

console.log("Kreise wurden gezeichnet.");

// Show percentage output on hover
node.on("mouseover", function (event, d) {
  d3.select(this).raise(); // Bring the hovered element to the front
  const roomType = d.data.name;
  const minNights = d.data.value;
  d3.select("#percentage-output")
    .text(`Room Type: ${roomType}, Minimum Nights: ${minNights}`);
});

console.log("Pack-Layout erfolgreich erstellt.");

// Funktion zum Aktualisieren des Pack-Layouts basierend auf dem ausgewählten Raumtyp
function updatePackLayout(roomType) {
  const filteredData = data.filter((d) => d.room_type === roomType);
  const minNightsData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.minimum_nights >= 7 ? "7+" : d.minimum_nights
  );

  const newRoot = d3
    .hierarchy({ children: Array.from(minNightsData, ([key, value]) => ({ name: key, value })) })
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3.pack().size([width, height]).padding(2)(newRoot);

  const nodes = svg.selectAll("g").data(newRoot.leaves());

  nodes
    .enter()
    .append("g")
    .merge(nodes)
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .each(function (d) {
      const g = d3.select(this);
      g.selectAll("circle").data([d])
        .enter()
        .append("circle")
        .merge(g.selectAll("circle"))
        .attr("r", (d) => d.r)
        .attr("fill", (d) => color(roomType));
    });

  nodes.exit().remove();

  nodes.on("mouseover", function (event, d) {
    const minNights = d.data.name;
    const count = d.value;
    d3.select("#percentage-output")
      .text(`Room Type: ${roomType}, Minimum Nights: ${minNights}, Count: ${count}`);
  }).on("mouseout", function (event, d) {
    d3.select("#percentage-output")
      .text(`Room Type: ${d.data.name}, Count: ${d.value}`);
  });

  nodes.on("click", () => {
    drawInitialPackLayout();
  });
}

function drawInitialPackLayout() {
  const root = d3
    .hierarchy({ children: Array.from(roomTypeData, ([key, value]) => ({ name: key, value })) })
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3.pack().size([width, height]).padding(2)(root);

  const node = svg.selectAll("g").data(root.leaves());

  node
    .enter()
    .append("g")
    .merge(node)
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .each(function (d) {
      const g = d3.select(this);
      g.selectAll("circle").data([d])
        .enter()
        .append("circle")
        .merge(g.selectAll("circle"))
        .attr("r", (d) => d.r)
        .attr("fill", (d) => color(d.data.name));
    });

  node.exit().remove();

  node.on("mouseover", function (event, d) {
    const roomType = d.data.name;
    const count = d.value;
    d3.select("#percentage-output")
      .text(`Room Type: ${roomType}, Count: ${count}`);
  }).on("mouseout", function (event, d) {
    d3.select("#percentage-output")
      .text(`Room Type: ${d.data.name}, Count: ${d.value}`);
  });

  node.on("click", (event, d) => {
    updatePackLayout(d.data.name);
  });
}

// Zeichne das initiale Pack-Layout
drawInitialPackLayout();
