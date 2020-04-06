var source = "http://localhost:8080/rdf4j-workbench/repositories/rio/query";
var focusNode = null;

//https://data.pdok.nl/sparql
var width = 1500,
    height = 700,
    circleRadius = 8;

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
//we want nodes to be on top of links, so nodes need to at the end in the svg
var container_links = container.append("g");
var container_nodes = container.append("g");

var link_force = d3.forceLink().id(function(d) { return d.uri; }).distance(100);

var simulation = d3.forceSimulation(graph.nodes)
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('charge', d3.forceManyBody().strength(-3000))
  .force('link', link_force)
  .force("x", d3.forceX(width / 2).strength(1))
  .force("y", d3.forceY(height / 2).strength(1))
  .alpha(0.03)
  .alphaMin(0.01001);



function createVisualization() {
//add possible new nodes to the forces
simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link").links(graph.links);


var links = container_links.selectAll('.link')
    .data(graph.links)
    .enter()
    .append('g')
    .attr('class', 'link')

var lines = links.append('line')
    .attr('class', 'line');

var links_triangle = links.append("polygon")
    .attr("fill", "rgb(34,139,34)")
    .attr("points", "-4,-4 4,0 -4,4" )
    .attr("class", "links_triangle");

var links_text = links.append('text')
    .style("font-family", "Roboto")
    .attr("text-anchor", "left")
    .attr("fill", "rgb(128,128,128)")
    .attr("font-size", "7")
    .attr("x","15")
    .attr("y", "10")
    .attr("class", "links_text")
    .text(function (d) {return getTextFromUri(d.property) })
    .on("click", function(d) {
                window.open(d.property)
            });

var nodes = container_nodes
    .selectAll('.node')
    .data(graph.nodes).enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))
    .on("click", function(d) {
        clickNodeEvent(d, source);
    })
    .on("mouseover", function(d) {
        hoverNodeEvent(d, source);
    })
    .on("mouseout", mouseOutEvent);
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
      .text(function(d) {
        if (d.label == null) {
            return getTextFromUri(d.uri) ;
        } else {
            return d.label;
        }
      })
      .on("click", function(d) {
            //TODO: link openen werkt wel bij de properties, maar niet bij de subjecten
            window.open(d.uri)
        });

    restartSimulation();
}

function updateNodes() {
    container
        .selectAll('.node')
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style('opacity', function(node) {


        if (focusNode == null || node.uri == focusNode.uri ) {
            return '1';
        } else {
            var link = graph.links.find(function(d) {
                return (d.source.uri == node.uri && d.target.uri == focusNode.uri)
                    || (d.target.uri == node.uri && d.source.uri == focusNode.uri) ;
            });
            if (link != null) {
                return 1
            } else {
                return '0';
            }
        }
    });
    container
        .selectAll('.node').exit().remove()
}

function updateLinks() {
   container
       .selectAll('.link')
       .attr("transform", function(d) { return "translate(" + d.source.x + "," + d.source.y + ")"; })
            .style('opacity', function(d) {
        if (focusNode == null || d.source.uri == focusNode.uri || d.target.uri == focusNode.uri) {
            return '1';
        } else {
            return '0';
        }
    });
   container
       .selectAll('.line')
    .attr('x2', function(d) {
      return d.target.x - d.source.x
    })
    .attr('y2', function(d) {
      return d.target.y - d.source.y
    });
    container
           .selectAll('.line').exit().remove();

    container
           .selectAll('.links_triangle')
           .attr("transform", function(d) { return "translate(" + (d.target.x - d.source.x) / 2 + ","
                        + (d.target.y - d.source.y) / 2  + ") "
                        + "rotate(" + calculateDegreesToRotate(d.source.x, d.target.x, d.source.y, d.target.y ) +")"; });
    //.attr("x", function(d) { return (d.target.x - d.source.x) / 2 })
    //.attr("y", function(d) { return (d.target.y - d.source.y) / 2 });

    container
        .selectAll('.links_text')
        .attr("transform", function(d) {
            return "rotate(" + calculateDegreesToRotate(d.source.x, d.target.x, d.source.y, d.target.y ) +")";
        });
}

function calculateDegreesToRotate (x1,x2,y1,y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var radians_to_rotate = Math.atan2(deltaY, deltaX);
    var degrees_to_rotate = radians_to_rotate * (180/Math.PI);
    return degrees_to_rotate;
}

function ticked() {
    updateLinks();
    updateNodes();
}

function dragstarted(d) {
  restartSimulation();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(.01);
  d.fx = null;
  d.fy = null;
}

function restartSimulation() {
  if (d3.event == null || !d3.event.active) {
    simulation
    .alphaTarget(.01)
    .alpha(0.03)
    .restart();
  }
}

function getTextFromUri(uri) {
    var charStart = uri.lastIndexOf('/') + 1;
    return uri.substr(charStart, charStart + 20)
}