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

function getRelationsBetweenURI(uri1,uri2, source, successCallback) {
var query = "prefix :<http://anyuri.com>" +
    "SELECT * {"+
    "{<"+uri1+"> ?property1 <"+uri2+">}"+
    "UNION"+
    "{	<"+uri2+"> ?property1Reverse <"+uri1+">}"+
    "}"+
    "limit 10";
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
        addLink(subjectUri, triple.object.value, triple.property.value);
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

function findData() {

    source = $("#sparqlEndpoint").val();
    var label = $("#labelInputField").val();
    getUrisFromLabel(label, source, function(data) {
        data.results.bindings.forEach(function(triple){
            getDataFromSource(triple.subject.value, source);
        })
        });
}

function compareUris(){
    source = $("#sparqlEndpoint").val();
    uri1 = $("#uri1").val();
    uri2 = $("#uri2").val();
    getRelationsBetweenURI(uri1,uri2, source, function(data) {
        if (data.results.bindings.length > 0) {
            addNodeIfNotExists(uri1, source);
            addNodeIfNotExists(uri2, source);
            data.results.bindings.forEach(function(triple){
                if(triple.property1 != undefined) {
                    addLink(uri1, uri2, triple.property1.value);
                } else {
                    addLink(uri2, uri1, triple.property1Reverse.value);
                }
             });
             createVisualization();
        }
    });
    
}

function addLink(source, target, property) {
    graph.links.push({
        "source": source,
        "target": target,
        "property": property
    })
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