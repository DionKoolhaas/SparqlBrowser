function clickNodeEvent(uri, source) {
    getDataFromSource(uri, source, addRdfDataToVisualizationFunction(source));
}

function findData() {
    source = $("#sparqlEndpoint").val();
    var label = $("#labelInputField").val();
    getUrisFromLabel(label, source, function(rdfData) {
        rdfData.forEach(function(triple){
            getDataFromSource(triple.subject, source, addRdfDataToVisualizationFunction(source));
        })
    });
}

function addRdfDataToVisualizationFunction(source) {
    return function(rdfData) {
        rdfData.forEach(function(triple) {
            addNodeIfNotExists(triple.subject, source);
            addNodeIfNotExists(triple.object, source);
            addLink(triple.subject, triple.property, triple.object);
        });
        createVisualization();
    }
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

function compareUris(){
    source = $("#sparqlEndpoint").val();
    uri1 = $("#uri1").val();
    uri2 = $("#uri2").val();
    getDirectRelationsBetweenURI(uri1,uri2, source, function(rdfData) {
        if (rdfData.length > 0) {
            //there are relations found between both nodes, so there is a reason to visualize them
            addNodeIfNotExists(uri1, source);
            addNodeIfNotExists(uri2, source);
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