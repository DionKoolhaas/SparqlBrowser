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

function getSubjectsReferringToObject(objecttUri, source, successCallback) {
    var query;
    if (isValidUri(objecttUri)) {
        query = "SELECT * WHERE { ?subject ?property <"+ objecttUri +">  } limit 10";
    } else {
        query = "SELECT * WHERE { ?subject ?property '"+ objecttUri +"'  } limit 10";
    }
    queryDatabase(query, source, function(data) {
        var rdfData = [];
        data.results.bindings.forEach(function(triple) {
            addTripleToArray(rdfData, triple.subject.value, triple.property.value, objecttUri);
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
                addTripleToArray(rdfData, uri2, triple.property1Reverse.value, uri1);
            }
        });
        successCallback(rdfData);
    });
}
//#uri1 ?node uri2, + properties
function getRelationPath1Node(uri1, uri2, source, successCallback) {
    var query = "prefix :<http://anyuri.com>" +
    "SELECT * {" +
    "{<"+uri1+"> ?property1 ?node.}" +
    "UNION" +
    "{?node ?property1Reverse <"+uri1+">}" +
    "{<"+uri2+"> ?property2 ?node.}" +
    "UNION" +
    "{?node ?property2Reverse <"+uri2+">}" +
    "FILTER(!isLiteral(?node))" +
    "}"+
    "limit 3";
    queryDatabase(query, source, function (data) {
        //convert resultset to RDF array (subject, property, Object)
        var rdfData = [];
        data.results.bindings.forEach(function(triple) {

            if(triple.property1 != undefined) {
                addTripleToArray(rdfData, uri1, triple.property1.value, triple.node.value);
            } else {
                addTripleToArray(rdfData, triple.node.value, triple.property1Reverse.value, uri1);
            }

            if(triple.property2 != undefined) {
                addTripleToArray(rdfData, uri2, triple.property2.value, triple.node.value);
            } else {
                addTripleToArray(rdfData, triple.node.value, triple.property2Reverse.value, uri2);
            }
        });
        successCallback(rdfData);
    });
}

function getRelationPath2Node(uri1, uri2, source, successCallback) {
    var query = "prefix :<http://anyuri.com>" +
    "SELECT DISTINCT ?node " +
    "{" +
    "<"+uri1+"> (^!:|!:)/(^!:|!:) ?node." +
    "<"+uri2+"> (^!:|!:) ?node." +
    "}" +
    "limit 3";
    queryDatabase(query, source, function (data) {
        //convert resultset to RDF array (subject, property, Object)
        var rdfData = [];
        data.results.bindings.forEach(function(triple) {
            getRelationPath1Node(uri1, triple.node.value, source, successCallback);
            getDirectRelationsBetweenURI(uri2, triple.node.value, source, successCallback)
        });
    })
}

function getRelationPath(uri1, uri2, source, successCallback) {
    getDirectRelationsBetweenURI(uri1, uri2, source, successCallback);
    getRelationPath1Node(uri1, uri2, source, successCallback);
    getRelationPath2Node(uri1, uri2, source, successCallback);
    getRelationPath2Node(uri2, uri1, source, successCallback);
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
    data: {
        "action": "exec",
        "queryLn": "SPARQL",
         "ref": "text",
        "query" : query
    },
    //dataType: 'json',
    headers: {
        "Accept": "application/json"
    },
    success: successCallback,
    error: function(error){
        console.log('Could not connect to database')
        console.log(error)
    },
    type: 'POST',
    url: source
});
}