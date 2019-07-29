
$.ajax({
  headers: {
    "accept": "application/json"
  },
  type: "POST",
  url: "https://lod.onderwijsregistratie.nl/sparql",
  data: {
    "query": "select ?s ?p ?o where { ?s ?p ?o } limit 10"
  },
  success: function(data) {
   console.log(data)
  }
});


d3.csv("owlclasses.csv").then(function (data){
    var owlClasses = d3.select("svg")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
        .attr("class", "owlclasses")
        .attr("transform", function (d) {
            d.cx = Math.random(1, 1000) * 1000;
            d.cy = Math.random(1, 1000) * 1000;
            return "translate(" + 500 +"," + 500 + ")";
        })
    .on("mouseover", function (d) {
        console.log(d.name);
        d3.select(this)
            .append("text")
            .attr("class", "owlclassname")
            .text(d.name);
    });

    owlClasses.on("mouseout", function(d) {
        d3.select("text.owlclassname").remove();
    })

    owlClasses.transition()
        .duration(10000)
        .attr("transform", function(d) {
            var a = "translate(" + d.cx +"," + d.cy + ")";
            return a;
        });

     owlClasses.append("circle")
     .attr("r", 10)
});

var alphabet = "asdfjklqweruiozxcvbnm".split("");

d3.interval(function() {
    var sampleSize = Math.floor(Math.random()*21);
    var shuffle = d3.shuffle(alphabet).slice(sampleSize);
    console.log(shuffle);
    var selection = d3.select("#arrayOfLetters").selectAll("text").data(shuffle, d => d);

    selection.join(
    enter => enter.append("text").text(d => d).attr("x", (d, i) => i * 16),
    update => update.transition().attr("x", (d, i) => i * 16),
    exit => exit.remove()
    );

}, 2000);
