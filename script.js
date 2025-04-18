
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 900;
const height = 500;
const padding = 60;

const svg = d3.select("#chart");

fetch(url)
  .then(res => res.json())
  .then(data => {
    data.forEach(d => {
      d.Time = new Date(`1970-01-01T00:${d.Time}`);
      d.Year = new Date(`${d.Year}`);
    });

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Year))
      .range([padding, width - padding]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Time))
      .range([padding, height - padding]);

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Tooltip
    const tooltip = d3.select("#tooltip");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Time))
      .attr("r", 6)
      .attr("data-xvalue", d => d.Year.toISOString())
      .attr("data-yvalue", d => d.Time.toISOString())
      .style("fill", d => d.Doping ? "#e74c3c" : "#3498db")
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px")
          .attr("data-year", d.Year.toISOString())
          .html(`
            <strong>${d.Name}</strong>: ${d.Nationality}<br/>
            Year: ${d.Year.getFullYear()}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br/>
            ${d.Doping ? d.Doping : "No Doping Allegations"}
          `);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Legend
    const legend = d3.select("#legend");
    legend.html(`
      <span style="color: #3498db;">■</span> No doping allegations<br>
      <span style="color: #e74c3c;">■</span> Riders with doping allegations
    `);
  });