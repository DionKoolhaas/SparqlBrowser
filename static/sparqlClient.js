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
    //graph.nodes.push({"uri": "nootje", "bron":"http://lod.onderwijsregistratie.nl"})
    //graph.links.push({"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenOpleiding", "target": "http://www.w3.org/2002/07/owl#Class", "property" :"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})

var test ={
  "head": {
    "link": [],
    "vars": [
      "property",
      "object"
    ]
  },
  "results": {
    "distinct": false,
    "ordered": true,
    "bindings": [
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#Thing"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://xmlns.com/foaf/0.1/Person"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://dbpedia.org/ontology/Person"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#Agent"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#NaturalPerson"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q24229398"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://www.wikidata.org/entity/Q5"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://dbpedia.org/ontology/Agent"
        }
      },
      {
        "property": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "object": {
          "type": "uri",
          "value": "http://schema.org/Person"
        }
      }
    ]
  }
}

function addDataToVisualization(subjectUri, source) {
if (test.results.bindings.length > 0) {
    graph.nodes.push({
            "uri": subjectUri,
            "source": source
        });
}
test.results.bindings.forEach(function(triple){
    var node = graph.nodes.find(function(d) { return d.uri == triple.object.value})
    if (node != null) {
        console.log("the node existss:" + triple.object.value);
    } else {
        console.log("add to nodes")
        graph.nodes.push({
            "uri": triple.object.value,
            "source": source
        })
    }

    var link = graph.links.find(function(d) {
        return d.source == subjectUri && d.target == triple.object.value && d.property == triple.property.value;
    });
    if (link != null) {
        console.log("link existss")
    } else {
        graph.links.push({
            "source": subjectUri,
            "target": triple.object.value,
            "property": triple.property.value
        })
    }

} );
}

addDataToVisualization("http://dbpedia.org/resource/Johan_Derksen", "http://dbpedia.org/sparql");
createVisualization();

}, 2000);