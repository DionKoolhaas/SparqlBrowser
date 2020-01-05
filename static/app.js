
var width = 600,
    height = 400;
var nodes = graph.nodes;
//stop een object in color, en je krijgt een html kleur terug
var color = d3.scaleOrdinal(d3.schemeSet1);


//voeg een svg toe aan de dom
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var simulation = d3.forceSimulation(nodes)
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('charge', d3.forceManyBody().strength(-100))
  .force('collision', d3.forceCollide().radius(function(d) {
      return 20
    }))
  .on('tick', ticked);

function ticked() {
console.log("you are being ticked")
  var u = svg
    .selectAll('.node')
    .data(nodes)

  u.enter()
    .append('g')
    .attr('class', 'node')
    .append('circle')
    .attr('r', 5)
    .style('fill', function(d) { return color(d.bron)})
    .merge(u)
    .select('circle')
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })

  u.exit().remove()
}