
(function(){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .range([0, width], .1);

var y = d3.scaleLinear()
.range([height, 0]);

var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6"]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y)
   
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("/output/theft.json", function(data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "year" && key!="arrest" && key!="notArrest"); }));

    data.forEach(function(d) {
        console.log(d)
        let y0 = 0;
        d.theft = color.domain().map(function(theft) { return {theft: theft, y0: y0, y1: y0 += +d[theft]}; });
        console.log(d.theft)
        d.total = d.theft[d.theft.length - 1].y1;
    });

data.sort(function(a, b) { return b.total - a.total; });

x.domain(data.map(function(d) { return d.year; }));
y.domain([0, d3.max(data, function(d) { return d.total; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Crimes");

let year = svg.selectAll(".year")
    .data(data)
  .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });

year.selectAll("rect")
    .data(function(d) { return d.theft; })
  .enter().append("rect")
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.theft); });

var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
});
})();

  

