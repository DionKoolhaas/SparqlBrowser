
var width = 4000,
    height = 2000;

//stop een object in color, en je krijgt een html kleur terug
var color = d3.scaleLinear()
                .domain([-1, 0, 1])
                .range(["red", "white", "green"]);

//voeg een svg toe aan de dom
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


   var force = d3.forceSimulation(graph.nodes)
       .force("charge", d3.forceManyBody())
       .force("link", d3.forceLink(graph.links))
       .force("center", d3.forceCenter());

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("g")
      .attr("class", "link");

  link.append("line")
      .style("stroke-width", function(d) { return "3px"; });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node");
      //.call(force.drag);

  node.append("circle")
      .attr("r", function(d) { return 5; })
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
