
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
  //.force('charge', d3.forceManyBody().strength(4000))
  .force("forceX", d3.forceX().strength(.1).x(width * .5))
          .force("forceY", d3.forceY().strength(.1).y(height * .5))
  .force('collision', d3.forceCollide().radius(function(d) {
      return 50
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
    .attr('r', 50)
    .style('fill', function(d) { return color(d.bron)})
    .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));
    //.merge(u)
    //.select('circle')

    u.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  u.exit().remove()
}

function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }