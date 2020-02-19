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
            addTripleToGraphIfNotExists(triple, source);
        });
        createVisualization();
    }
}

function compareUris(){
    source = $("#sparqlEndpoint").val();
    uri1 = $("#uri1").val();
    uri2 = $("#uri2").val();
    getDirectRelationsBetweenURI(uri1,uri2, source, function(rdfData) {
        if (rdfData.length > 0) {
            //there are relations found between both nodes, so there is a reason to visualize them
            rdfData.forEach(function(triple){
                addTripleToGraphIfNotExists(triple, source);
             });
             createVisualization();
        }
    });

}

function addTripleToGraphIfNotExists(triple, source) {
    addNodeIfNotExists(triple.subject, source);
    addNodeIfNotExists(triple.object, source);
    addLinkIfNotExists(triple);
}

function addLinkIfNotExists(triple) {
    var link = graph.links.find(function(d) {
        return d.source.uri == triple.subject && d.property == triple.property && d.target.uri == triple.object;
        });
    if (link == null) {
        graph.links.push({
            "source": triple.subject,
            "target": triple.object,
            "property": triple.property
        });
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