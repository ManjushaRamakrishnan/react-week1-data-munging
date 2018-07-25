(() => {
    let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        x = d3.scaleBand().range([0, width], .1).paddingInner(0.1).align(0.1),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal().range(["#6b486b", "#ff8c00"]),
        
        g = d3.select("svg#theftSVG")
            .append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("/data/output/theft.json", (err, data) => {
        z.domain(d3.keys(data[0]).filter((key) => { return (key !== "year" && key!="arrest" && key!="noArrest"); } ));

        data.forEach(function(d) {
            let col1 = 0, col2 = 0;
            d.theft = z.domain().map(function(theft) { return {theft: theft, col1: col1, col2: col1 += +d[theft]}; });
            console.log(d.theft)
            d.total = d.theft[d.theft.length - 1].col2;
        });

    data.sort((a, b) => { return b.total - a.total; });

    x.domain(data.map((d) => { return d.year; }));
    y.domain([0, d3.max(data, (d) => { return d.total; })]);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Theft");

    g.selectAll(".year")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return d.theft; })
        .enter().append("rect")
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.col2); })
        .attr("height", function(d) { return y(d.col1) - y(d.col2); })
        .style("fill", function(d) { return z(d.theft); });

    let legend = g.selectAll(".legend")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .data(z.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .style("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", ".32em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
});
})();