// Verwende die d3-Bibliothek direkt aus einem CDN
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

// Größe des SVG-Containers
const width = 700;
const height = 500;

// Farbskala (angepasst für besseren Kontrast)
const color = d3.scaleOrdinal()
  .domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
  .range(["#fff", "#E5E5E5", "#858585", "#b3b3b3"]); // Kontrastreichere Farben

// Erstelle ein SVG-Element im richtigen Container
const svg = d3
  .select("#treemap-container")  // Hier wird der "treemap-container" verwendet
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font-family", "Inter, sans-serif");

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
d3.select("#percentage-output")
  .text(`In ${percentageEntireHome}% der Zeit hast du ein Appartment für dich alleine.`);

// Konvertiere die Daten in ein hierarchisches Format
const root = d3
  .hierarchy({ children: Array.from(roomTypeData, ([key, value]) => ({ name: key, value })) })
  .sum((d) => d.value)
  .sort((a, b) => b.value - a.value);

console.log("Hierarchische Datenstruktur (root):", root);

// Erstelle ein Treemap-Layout
d3.treemap().size([width, height]).padding(2)(root);
console.log("Treemap-Layout erstellt:", root.leaves());

// Zeichne die Rechtecke der Treemap
const node = svg
  .selectAll("g")
  .data(root.leaves())
  .enter()
  .append("g")
  .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

console.log("Anzahl der Knoten (Rechtecke):", node.size());

// Rechtecke
node
  .append("rect")
  .attr("width", (d) => d.x1 - d.x0)
  .attr("height", (d) => d.y1 - d.y0)
  .attr("fill", (d) => color(d.data.name));

console.log("Rechtecke wurden gezeichnet.");

// Text (mit schwarzem Text für bessere Sichtbarkeit)
node
  .append("text")
  .attr("x", 10)
  .attr("y", 20)
  .text((d) => `${d.data.name}: ${d.value}`)
  .attr("fill", "#000") // Schwarzer Text
  .style("font-size", "14px")
  .style("font-weight", "bold");

console.log("Texte wurden hinzugefügt.");
console.log("Treemap erfolgreich erstellt.");

// Funktion zum Aktualisieren der Treemap basierend auf dem ausgewählten Raumtyp
function updateTreemap(roomType) {
  // Filtere die Daten nach dem ausgewählten Raumtyp
  const filteredData = data.filter((d) => d.room_type === roomType);

  // Gruppiere die gefilterten Daten nach "minimum_nights" und zähle die Anzahl der Einträge pro Typ
  const minNightsData = d3.rollup(
    filteredData,
    (v) => v.length,
    (d) => d.minimum_nights >= 7 ? "7+" : d.minimum_nights
  );

  // Konvertiere die Daten in ein hierarchisches Format
  const newRoot = d3
    .hierarchy({ children: Array.from(minNightsData, ([key, value]) => ({ name: key, value })) })
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  // Erstelle ein neues Treemap-Layout
  d3.treemap().size([width, height]).padding(2)(newRoot);

  // Aktualisiere die Rechtecke der Treemap
  const nodes = svg.selectAll("g").data(newRoot.leaves());

  nodes
    .enter()
    .append("g")
    .merge(nodes)
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
    .each(function (d) {
      const g = d3.select(this);

      g.selectAll("rect")
        .data([d])
        .enter()
        .append("rect")
        .merge(g.selectAll("rect"))
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => color(roomType));

      g.selectAll("text")
        .data([d])
        .enter()
        .append("text")
        .merge(g.selectAll("text"))
        .attr("x", 10)
        .attr("y", 20)
        .text((d) => `Minimum ${d.data.name} Night${d.data.name > 1 ? 's' : ''}: ${d.value} AirBnBs`)     //hier wird der Text von minimum_nights angezeigt
        .attr("fill", "#000")
        .style("font-size", "14px")
        .style("font-weight", "lighter");
    });

  nodes.exit().remove();

  // Event-Listener für Klicks auf die Knoten
  nodes.on("click", () => {
    drawInitialTreemap();
  });
}

// Funktion zum Zeichnen der initialen Treemap
function drawInitialTreemap() {
  // Konvertiere die Daten in ein hierarchisches Format
  const root = d3
    .hierarchy({ children: Array.from(roomTypeData, ([key, value]) => ({ name: key, value })) })
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  // Erstelle ein Treemap-Layout
  d3.treemap().size([width, height]).padding(2)(root);

  // Zeichne die Rechtecke der Treemap
  const node = svg.selectAll("g").data(root.leaves());

  node
    .enter()
    .append("g")
    .merge(node)
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
    .each(function (d) {
      const g = d3.select(this);

      g.selectAll("rect")
        .data([d])
        .enter()
        .append("rect")
        .merge(g.selectAll("rect"))
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => color(d.data.name));

      g.selectAll("text")
        .data([d])
        .enter()
        .append("text")
        .merge(g.selectAll("text"))
        .attr("x", 10)
        .attr("y", 20)
        .text((d) => `${d.data.name}: ${d.value} AirBnBs`)        //hier wird der Text von roomtypes angezeigt
        .attr("fill", "#000")
        .style("font-size", "14px")
        .style("font-weight", "lighter");
    });

  node.exit().remove();

  // Event-Listener für Klicks auf die Knoten
  node.on("click", (event, d) => {
    updateTreemap(d.data.name);
  });
}

// Zeichne die initiale Treemap
drawInitialTreemap();


// // Funktion zum Hinzufügen von Hover-Effekten
// function addHoverEffects() {
//   svg.selectAll("g")
//     .on("mouseover", function (event, d) {
//       d3.select(this).select("text").style("visibility", "visible");
//     })
//     .on("mouseout", function (event, d) {
//       d3.select(this).select("text").style("visibility", "hidden");
//     })
//     .select("text")
//     .style("visibility", "hidden");
// }

// // Füge die Hover-Effekte hinzu
// addHoverEffects();

