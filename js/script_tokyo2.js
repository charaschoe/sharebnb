import * as d3 from "https://cdn.skypack.dev/d3@7";
import { tokyoData } from "../data/tokyo.js";

const height = 450;
const width = (700 / 500) * height;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const data = tokyoData;

const hostListingsData = d3.rollup(
    data,
    (v) => v.length,
    (d) => {
        const count = d.calculated_host_listings_count;
        if (count >= 50) return "50+";
        if (count >= 20) return "20-49";
        if (count >= 10) return "10-19";
        if (count >= 5) return "5-9";
        return count.toString();
    }
);

const totalEntries = data.length;
const entireHomeCount = hostListingsData.get("Entire home/apt") || 0;
const percentageEntireHome = ((entireHomeCount / totalEntries) * 100).toFixed(2);

d3.select("#percentage-output")
    .text(`In ${percentageEntireHome}% der Zeit hast du ein Appartment für dich alleine.`);

const x = d3.scalePoint()
    .domain(["1", "2", "3", "4", "5-9", "10-19", "20-49", "50+"])
    .range([0, width - margin.left - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(Array.from(hostListingsData.values()))])
    .nice()
    .range([height - margin.top - margin.bottom, 0]);

const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

// Sortiere die Daten nach der x-Achsen-Domäne
const sortedData = Array.from(hostListingsData).sort((a, b) => {
    return x.domain().indexOf(a[0]) - x.domain().indexOf(b[0]);
});

const xAxis = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0).tickPadding(10).tickFormat(""));

const yAxis = svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10).tickFormat(""));

// Add x-axis label
xAxis.append("text")
    .attr("class", "axis-label")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", margin.bottom - 10)
    .style("fill", "white")
    .style("text-anchor", "middle")
    .text("Anzahl der Wohnungen des Hosts");

// Add y-axis label
yAxis.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height - margin.top - margin.bottom) / 2)
    .attr("y", -margin.left + 10)
    .style("fill", "white")
    .style("text-anchor", "left")
    .text("Anzahl der AirBnBs");

// Initiale Animation für die Linie
const path = svg.append("path")
    .datum(sortedData)
    .attr("fill", "none")
    .attr("stroke", "white")                // Farbe der Linie
    .attr("stroke-width", 5)
    .attr("d", line);

const totalLength = path.node().getTotalLength();

path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

const tooltip = d3.select("#tooltip");

// Initiale Animation für die Punkte
svg.selectAll(".dot")
    .data(sortedData)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d[0]))
    .attr("cy", d => y(d[1]))
    .attr("r", 0)
    .attr("fill", "white")              // Farbe der Punkte
    .transition()
    .duration(2000)
    .attr("r", 10);

svg.selectAll(".dot")
    .on("mouseover", function(event, d) {
        d3.select(this).transition()
            .duration(200)
            .attr("r", 13);

        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        const listingText = d[0] === "1" ? "Inserat" : "Inseraten";
        const percentage = ((d[1] / totalEntries) * 100).toFixed(2);
        tooltip.html(`<b>${d[1]}</b> AirBnBs sind von Hosts mit <b>${d[0]} </b>${listingText}.<br> Das sind <b>${percentage}%</b> aller AirBnBs in Tokio!`)
            .style("left", `${margin.left + 815}px`)
            .style("top", `${height - margin.bottom + 370}px`)
            .style("background-color", "transparent")
            .style("color", "white")
            .style("border", "none")  
            .style("font-size", "16px")
            .style("font-family", "Inter")
            .style("text-shadow", "none")  // Remove drop shadow
            .style("stroke", "transparent");
        })
        .on("mouseout", function() {
        d3.select(this).transition()
            .duration(200)
            .attr("r", 10);

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
