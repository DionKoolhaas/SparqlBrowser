function getDataFromSource(subjectUri, source, successCallback) {
    var query = "SELECT * WHERE { <"+ subjectUri +"> ?property ?object } limit 10";
    queryDatabase(query, source, function(data) {
        var rdfData = [];
        data.results.bindings.forEach(function(triple) {
            addTripleToArray(rdfData, subjectUri, triple.property.value, triple.object.value)
        });
        successCallback(rdfData);
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