// Lade die JSON-Datei und erstelle den Bar-Chart basierend auf room_type
d3.json("data/capetown2.json").then(function(data) {
  // Falls data ein einzelnes Objekt ist, es in ein Array konvertieren
  if (!Array.isArray(data)) {
    data = [data];
  }

  // Zähle die verschiedenen room_type-Attribute
  const roomTypeCounts = d3.rollup(
    data,
    v => v.length,
    d => d.room_type
  );

  // Konvertiere das Map-Objekt in ein Array für die D3-Datenverarbeitung
  const formattedData = Array.from(roomTypeCounts, ([room_type, count]) => ({ room_type, count }));

  // Dimensionen und Margins des Diagramms
  const width = 928;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;

  // X-Achse: Skala für die verschiedenen room_type (horizontal)
  const x = d3.scaleBand()
    .domain(formattedData.map(d => d.room_type))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  // Y-Achse: Skala für die Anzahl der jeweiligen room_type (vertikal)
  const y = d3.scaleLinear()
    .domain([0, d3.max(formattedData, d => d.count)])
    .nice()
    .range([height - marginBottom, marginTop]);

  // Erstelle das SVG-Element für das Diagramm
  const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Tooltip hinzufügen (verstecktes div)
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #d3d3d3")
    .style("padding", "5px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Füge Rechtecke (Balken) für die verschiedenen room_type hinzu
  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(formattedData)
    .join("rect")
    .attr("x", d => x(d.room_type))
    .attr("y", d => y(d.count))
    .attr("height", d => y(0) - y(d.count))
    .attr("width", x.bandwidth())
    // Tooltip-Ereignisse beim Hovern
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1);
      d3.select(this).attr("fill", "#ff7f0e"); // Ändere die Farbe des Balkens beim Hover
    })
    .on("mousemove", function(event, d) {
      tooltip
        .html(`Room Type: ${d.room_type}<br>Count: ${d.count}`)
        .style("left", (event.pageX + 10) + "px")  // Tooltip-Position relativ zur Maus
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
      d3.select(this).attr("fill", "steelblue");  // Farbe zurücksetzen
    });

  // Füge die X-Achse hinzu
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Füge die Y-Achse hinzu und beschrifte sie
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Count of Room Types"));
});
