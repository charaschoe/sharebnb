d3.json("data/paris.json").then(function(data) {
    // Falls data ein einzelnes Objekt ist, es in ein Array konvertieren
    if (!Array.isArray(data)) {
        data = [data];
    }

    // Datenbereinigung: Entfernen von Leerzeichen und Konvertieren zu Kleinbuchstaben
    data = data.map(d => ({
        ...d,
        room_type: d.room_type.trim().toLowerCase()
    }));

    // Dynamisch alle einzigartigen room_type-Werte aus den Daten extrahieren
    const uniqueRoomTypes = Array.from(new Set(data.map(d => d.room_type)));

    // Zähle die verschiedenen room_type-Attribute
    const roomTypeCounts = Array.from(d3.group(data, d => d.room_type), ([room_type, v]) => ({ room_type, count: v.length }));

    // Debug: Zeige alle erkannten room_type-Werte und ihre Anzahl in der Konsole an
    console.log("Erkannte Room Types und ihre Zähler:", roomTypeCounts);

    // Erstelle eine Map und füge fehlende room_types mit Zähler 0 hinzu
    const roomTypeMap = new Map(roomTypeCounts.map(d => [d.room_type, d.count]));

    // Sichern Sie sich, dass alle gefundenen `uniqueRoomTypes` in den Daten enthalten sind
    const formattedData = uniqueRoomTypes.map(type => ({
        room_type: type,
        count: roomTypeMap.get(type) || 0
    }));

    // Dimensionen und Margins des Diagramms
const width = 700; // Angepasste Breite um 30% vergrößert (1200 * 1.3)
const height = 600; // Angepasste Höhe um 30% vergrößert (500 * 1.3)
const marginTop = 30;
const marginRight = 50; 
const marginBottom = 80; 
const marginLeft = 40;

// X-Achse: Skala für die verschiedenen room_type (horizontal)
const x = d3.scaleBand()
    .domain(formattedData.map(d => d.room_type))
    .range([marginLeft, formattedData.length * 195]) // Breiterer Bereich um 30% vergrößert (150 * 1.3)
    .padding(0.1); 

// Y-Achse: Skala für die Anzahl der jeweiligen room_type (vertikal)
const y = d3.scaleLinear()
    .domain([0, d3.max(formattedData, d => d.count)]) // Sicherstellen, dass die Skala bei 0 beginnt
    .range([height - marginBottom, marginTop]);

// Erstelle das SVG-Element für das Diagramm mit fester Höhe und horizontalem Scrollbereich
const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${formattedData.length * 195} ${height}`) // Vergrößert um 30%
    .attr("style", "max-width: 100%; height: auto; overflow-x: scroll;");


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
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
            d3.select(this).attr("fill", "#ff7f0e");
        })
        .on("mousemove", function(event, d) {
            tooltip
                .html(`Room Type: ${d.room_type}<br>Count: ${d.count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("fill", "steelblue");
        });

    // Füge die X-Achse hinzu
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSize(0).tickSizeOuter(0)) // Entfernt die kleinen Striche und überstehenden Linien
        .selectAll("text")
        .style("fill", "white")
        .style("text-anchor", "middle") // Zentriert den Text unter den Balken
        .style("font-family", "Inter")
        .style("font-size", "14px")
        .style("font-weight", "400")
        .attr("dy", "25px"); // Verschiebt die Texte um 10px nach unten

    // Füge die Y-Achse hinzu und beschrifte sie
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(5, "s"))
        .call(g => g.selectAll("text")
            .style("fill", "white")
            .style("font-family", "Inter")
            .style("font-size", "14px")
            .style("font-weight", "400")) // Setze das Schriftgewicht
        .call(g => g.selectAll(".tick line").style("stroke", "white"))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "white") // Setze die Beschriftungsfarbe auf Weiß
            .attr("text-anchor", "start")
            .text(""));
});
