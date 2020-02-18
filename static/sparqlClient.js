function getDataFromSource(subjectUri, source) {
    var query = "SELECT * WHERE { <"+ subjectUri +"> ?property ?object } limit 10";
    queryDatabase(query, source, function(data){
        addDataToVisualization(subjectUri, source, data)
    });
}

function getUrisFromLabel(label, source, successCallback) {
    var query = 'SELECT ?subject WHERE {?subject <http://www.w3.org/2000/01/rdf-schema#label> "'+ label +'"@nl} limit 10';
    queryDatabase(query, source, successCallback);
}

function addDataToVisualization(subjectUri, source, data) {
if (data.results.bindings.length > 0) {
    addNodeIfNotExists(subjectUri, source);
}
data.results.bindings.forEach(function(triple){
    addNodeIfNotExists(triple.object.value, source);

    var link = graph.links.find(function(d) {
        return d.source == subjectUri && d.target == triple.object.value && d.property == triple.property.value;
    });
    if (link != null) {
    } else {
        graph.links.push({
            "source": subjectUri,
            "target": triple.object.value,
            "property": triple.property.value
        })
    }

} );
createVisualization();
}

function addNodeIfNotExists(subjectUri, source) {
    var node = graph.nodes.find(function(d) { return d.uri == subjectUri})
    if (node != null) {
    } else {
        graph.nodes.push({
            "uri": subjectUri,
            "bron": source
        })
    }
}

createVisualization();
function findData() {

    source = $("#sparqlEndpoint").val();
    var label = $("#labelInputField").val();
    getUrisFromLabel(label, currentSparqlEndpoint, function(data){
        data.results.bindings.forEach(function(triple){
            getDataFromSource(triple.subject.value, source);
        })
        });
}

function findRelationsBetween2Labels(){

}

function queryDatabase(query, source, successCallback) {
  $.ajax({
    data: { "query" : query},
    //dataType: 'json',
    headers: {
        "Accept": "application/json"
    },
    success: successCallback,
    error: function(error){
        alert('Could not connect to database')
    },
    type: 'POST',
    url: source
});
}