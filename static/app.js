
var width = 2000,
    height = 1000,
    circleRadius = 10;

//stop een object in color, en je krijgt een html kleur terug
var color = d3.scaleOrdinal(d3.schemeSet1);


//voeg een svg toe aan de dom
var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    //inzoomen mogelijk maken
    .call(
        d3.zoom()
            .scaleExtent([.1, 4])
            .on("zoom", function() { container.attr("transform", d3.event.transform); })
    );

var container = svg.append("g");

var simulation = d3.forceSimulation(graph.nodes)
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('charge', d3.forceManyBody().strength(-3000))
  .force('link', d3.forceLink().links(graph.links).id(function(d) { return d.uri; }).distance(100))
  .force("x", d3.forceX(width / 2).strength(1))
  .force("y", d3.forceY(height / 2).strength(1))
  .on('tick', ticked);

var links = container.selectAll('.link')
    .data(graph.links)
    .enter()
    .append('g')
    .attr('class', '.link')

var lines = links.append('line');

var links_text = links.append('text')
    .style("font-family", "Roboto")
    .attr("text-anchor", "left")
    .attr("fill", "rgb(128,128,128)")
    .attr("font-size", "7")
    .attr("x","15")
    .attr("y", "0")
    .text(function (d) {return d.property.substr(d.property.lastIndexOf('/') + 1); })

var nodes = container
    .selectAll('.node')
    .data(graph.nodes).enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));
  nodes.append('circle')
    .attr('r', circleRadius)
    .style('fill', function(d) { return color(d.bron)})
    ;

  nodes.append("text")
      .style("font-family", "Roboto")
      .attr("text-anchor", "left")
      //tekst rechtsboven van circel plaatsen
      .attr("x", circleRadius)
      .attr("y", -circleRadius)
      .text(function(d) { return d.uri.substr(d.uri.lastIndexOf('/') + 1); });

function updateNodes() {
    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    nodes.exit().remove()
}

function updateLinks() {
   links.attr("transform", function(d) { return "translate(" + d.source.x + "," + d.source.y + ")"; });
   lines
    .attr('x2', function(d) {
      return d.target.x - d.source.x
    })
    .attr('y2', function(d) {
      return d.target.y - d.source.y
    });
    lines.exit().remove();

    links_text
    .attr("transform", function(d){
        var deltaX = d.target.x - d.source.x;
        var deltaY = d.target.y - d.source.y;
        var radians_to_rotate = Math.atan2(deltaY, deltaX);
        var degrees_to_rotate = radians_to_rotate * (180/Math.PI);
        return "rotate(" + degrees_to_rotate +")";
    });
}

function ticked() {
    updateLinks();
    updateNodes();
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