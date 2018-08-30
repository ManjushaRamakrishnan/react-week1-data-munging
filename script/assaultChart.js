const margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    parseTime = d3.timeParse("%Y");

let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const arrestLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.arrest); });

const noArrestLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.noArrest); });

let renderAssualtGraph = (graphData) => {
  let data = graphData;
  // format the data
  data.forEach(function(d) {
      d.year = parseTime(d.year);
      d.arrest = +d.arrest;
      d.noArrest = +d.noArrest;
  });
  
  data.sort(function(a, b){
    return a["year"]-b["year"];
  });
 
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) {
      return Math.max(d.arrest, d.noArrest); 
  })]);
  
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "green")
      .attr("d", arrestLine);
  
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .attr("d", noArrestLine);  
  
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));
}

d3.json("/data/output/theft.json", function(error, graphData) {
  if (error) throw error;
  //render chart
  renderAssualtGraph(graphData);
});