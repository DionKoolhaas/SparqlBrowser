
var width = 4000,
    height = 2000;

//stop een object in color, en je krijgt een html kleur terug
var color = d3.scale.category20();

//stop er een getal (x) in, en je krijgt een getal (y) terug die in de buurt komt van sqrt(x) + 6
var radius = d3.scale.sqrt()
    .range([0, 6]);

//voeg een svg toe aan de dom
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(function(d) { return 40; });

d3.json("lod-graph.json", function(error, graph) {
  if (error) throw error;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .on("tick", tick)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("g")
      .attr("class", "link");

  link.append("line")
      .style("stroke-width", function(d) { return "3px"; });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .attr("r", function(d) { return radius(5); })
      .style("fill", function(d) { return color(d.bron); });

  node.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.uri.substr(d.uri.lastIndexOf('/') + 1); });

  function tick() {
    link.selectAll("line")
        .attr("x1", function(d) { return d.source.x ; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }
});