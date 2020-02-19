function getDataFromSource(subjectUri, source) {
    var query = "SELECT * WHERE { <"+ subjectUri +"> ?property ?object } limit 10";
    queryDatabase(query, source, function(data){
        addDataToVisualization(subjectUri, source, data)
    });
}

function getUrisFromLabel(label, source, successCallback) {
    var query = 'SELECT ?subject WHERE {?subject <http://www.w3.org/2000/01/rdf-schema#label> "'+ label +'"@nl} limit 10';
    queryDatabase(query, source, function (data) {
        //convert resultset to RDF array (subject, property, Object)
        var rdfData = [];
        data.results.bindings.forEach(function(triple){
            addTripleToArray(rdfData, triple.subject.value, "http://www.w3.org/2000/01/rdf-schema#label", label);
        });
        successCallback(rdfData);
    });

}

function getDirectRelationsBetweenURI(uri1, uri2, source, successCallback) {
var query = "prefix :<http://anyuri.com>" +
    "SELECT * {"+
    "{<"+uri1+"> ?property1 <"+uri2+">}"+
    "UNION"+
    "{	<"+uri2+"> ?property1Reverse <"+uri1+">}"+
    "}"+
    "limit 10";
    queryDatabase(query, source, function (data) {
        //convert resultset to RDF array (subject, property, Object)
        var rdfData = [];
        data.results.bindings.forEach(function(triple) {
            if(triple.property1 != undefined) {
                addTripleToArray(rdfData, uri1, triple.property1.value, uri2);
            } else {
                addTripleToArray(rdfData, uri2, triple.property1.value, uri);
            }
        });
        successCallback(rdfData);
    });
}

function addTripleToArray(rdfData, subject, property, object) {
    rdfData.push({
        "subject" : subject,
        "property": property,
        "object": object
    });
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
        addLink(subjectUri, triple.property.value, triple.object.value);
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
    getUrisFromLabel(label, source, function(rdfData) {
        rdfData.forEach(function(triple){
            getDataFromSource(triple.subject, source);
        })
    });
}

function compareUris(){
    source = $("#sparqlEndpoint").val();
    uri1 = $("#uri1").val();
    uri2 = $("#uri2").val();
    getDirectRelationsBetweenURI(uri1,uri2, source, function(rdfData) {
        if (rdfData.length > 0) {
            //there are relations found between both nodes, so there is a reason to visualize them
            addNodeIfNotExists(uri1, source);
            addNodeIfNotExists(uri2, source);
            console.log(rdfData);
            rdfData.forEach(function(triple){
                addLink(triple.subject, triple.property, triple.object);
             });
             createVisualization();
        }
    });

}

function addLink(subject, property, object) {
    graph.links.push({
        "source": subject,
        "target": object,
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