// Verwende die d3-Bibliothek direkt aus einem CDN
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

// Größe des SVG-Containers
const width = 700;
const height = 500;

// Farbskala (angepasst für besseren Kontrast)
const color = d3.scaleOrdinal()
  .domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
  .range(["#fff", "#E5E5E5", "#B3B3B3", "#858585"]); // Kontrastreichere Farben

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
