/*
$.ajax({
    data: { "query" :"SELECT * WHERE { <http://dbpedia.org/resource/Johan_Derksen> ?property ?object } limit 10"},
    //dataType: 'json',
    headers: {
        "Accept": "application/json"
    },
    success: function(data){
        console.log(data);
    },
    error: function(){
        console.log("Device control failed");
    },
    type: 'POST',
    url: 'http://dbpedia.org/sparql'
});*/

createVisualization();

setTimeout(function(){
    console.log("add data")
    graph.nodes.push({"uri": "nootje", "bron":"http://lod.onderwijsregistratie.nl"})
    graph.links.push({"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenOpleiding", "target": "http://www.w3.org/2002/07/owl#Class", "property" :"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
    createVisualization();
}, 2000);
