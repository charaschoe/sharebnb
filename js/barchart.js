d3.json("data/paris.json").then(function(data) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    data = data.map(d => ({
        ...d,
        room_type: d.room_type.trim().toLowerCase()
    }));

    const uniqueRoomTypes = Array.from(new Set(data.map(d => d.room_type)));
    const roomTypeCounts = Array.from(d3.group(data, d => d.room_type), ([room_type, v]) => ({ room_type, count: v.length }));

    console.log("Erkannte Room Types und ihre Zähler:", roomTypeCounts);

    const roomTypeMap = new Map(roomTypeCounts.map(d => [d.room_type, d.count]));
    const formattedData = uniqueRoomTypes.map(type => ({
        room_type: type,
        count: roomTypeMap.get(type) || 0
    }));

    const width = 600;
    const height = 700;
    const marginTop = 30;
    const marginRight = 50; 
    const marginBottom = 80; 
    const marginLeft = 40;

    const x = d3.scaleBand()
        .domain(formattedData.map(d => d.room_type))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.count)])
        .range([height - marginBottom, marginTop]);

    const svg = d3.select("#chart").append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("overflow", "hidden");

    // Select the <p> element for displaying hover info
    const hoverInfo = d3.select("#hover-info");

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
            d3.select(this).attr("fill", "#ff7f0e");
            hoverInfo.text(`Room Type: ${d.room_type}, Count: ${d.count}`); // Display info
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "steelblue");
            hoverInfo.text("Hover over a bar to see details"); // Reset info when mouse out
        });

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSize(0).tickSizeOuter(0))
        .selectAll("text")
        .style("fill", "white")
        .style("text-anchor", "middle")
        .style("font-family", "Inter")
        .style("font-size", "14px")
        .style("font-weight", "400")
        .attr("dy", "25px");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(5, "s"))
        .call(g => g.selectAll("text")
            .style("fill", "white")
            .style("font-family", "Inter")
            .style("font-size", "14px")
            .style("font-weight", "400"))
        .call(g => g.selectAll(".tick line").style("stroke", "white"))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "white")
            .attr("text-anchor", "start")
            .text(""));
});
