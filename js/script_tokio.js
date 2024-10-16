// Verwende die d3-Bibliothek direkt aus einem CDN
import * as d3 from "https://cdn.skypack.dev/d3@7"; // Nutze "import" innerhalb eines Moduls

// Größe des SVG-Containers
const width = 700;
const height = 500;

// Farbskala
const color = d3.scaleOrdinal()
    .domain(["Entire home/apt", "Private room", "Shared room", "Hotel room"])
    .range(["#ffffff", "#B3B3B3", "#858585", "#e5e5e5"]);

// Erstelle ein SVG-Element
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font-family", "Inter, sans-serif")

// Verwende die `tokyoData`-Konstante aus der "tokyoData.js"
const data = tokyoData;

// Gruppiere die Daten nach "room_type" und zähle die Anzahl der Einträge pro Typ
const roomTypeData = d3.rollup(
  data,
  (v) => v.length,
  (d) => d.room_type
);

// Konvertiere die Daten in ein hierarchisches Format
const root = d3
  .hierarchy({ children: Array.from(roomTypeData, ([key, value]) => ({ name: key, value })) })
  .sum((d) => d.value)
  .sort((a, b) => b.value - a.value);

// Erstelle ein Treemap-Layout
d3.treemap().size([width, height]).padding(2)(root);

// Zeichne die Rechtecke der Treemap
const node = svg
  .selectAll("g")
  .data(root.leaves())
  .enter()
  .append("g")
  .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

// Rechtecke
node
  .append("rect")
  .attr("width", (d) => d.x1 - d.x0)
  .attr("height", (d) => d.y1 - d.y0)
  .attr("fill", (d) => color(d.data.name))

node
  .append("text")
  .attr("x", 10)
  .attr("y", 20)
  .text((d) => `${d.data.name}: ${d.value}`)
  .attr("fill", "#fff") // Weißer Text
  .style("font-size", "14px")
  .style("font-weight", "bold") // Fettschrift
  .style("overflow", "hidden");

console.log("Treemap erfolgreich erstellt.");
