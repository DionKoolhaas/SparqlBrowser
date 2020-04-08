function setDataSource(datasource){
    source = datasource;
    console.log(source);
    graph.nodes.forEach(function(node){
     getDataFromSource(node.uri, source, addRdfDataToVisualizationFunction(source));
     getSubjectsReferringToObject(node.uri, source, addRdfDataToVisualizationFunction(source));
    });
}

function clickNodeEvent(node, source) {
    $("#currentNodeUri").text(node.uri);
    $("#currentNodeLabel").text(node.label);
    $("#currentNodeComment").text(node.comment);
    if (isValidUri(node.uri)) {
        getDataFromSource(node.uri, source, addRdfDataToVisualizationFunction(source));
    }
    getSubjectsReferringToObject(node.uri, source, addRdfDataToVisualizationFunction(source));
}

function hoverNodeEvent(node, source) {
    $("#currentNodeUri").text(node.uri);
    if (isValidUri(node.uri)) {
        $("#currentNodeUri").attr("href",node.uri);
    } else {
        $("#currentNodeUri").removeAttr("href");
    }
    $("#currentNodeLabel").text(node.label);
    $("#currentNodeComment").text(node.comment);
    focusNode = node;
    ticked();
}

function mouseOutEvent() {
    focusNode = null;
    ticked();
}

function findData() {
    var input = $("#labelInputField").val();
    if (isValidUri(input)) {
        getDataFromSource(input, source, addRdfDataToVisualizationFunction(source));
        getSubjectsReferringToObject(input, source, addRdfDataToVisualizationFunction(source));
    } else {
    getUrisFromLabel(input, source, function(rdfData) {
        rdfData.forEach(function(triple) {
            getDataFromSource(triple.subject, source, addRdfDataToVisualizationFunction(source));
            getSubjectsReferringToObject(triple.subject, source, addRdfDataToVisualizationFunction(source));
        })
    });
    }
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
    uri1 = $("#uri1").val();
    uri2 = $("#uri2").val();
    getRelationPath(uri1,uri2, source, function(rdfData) {
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
    addLinkIfNotExists(triple, source);
}

function addLinkIfNotExists(triple, source) {
    var link = findLink(triple);
    if (link == null) {
        if (triple.property == "http://www.w3.org/2000/01/rdf-schema#label") {
            var node = addNodeIfNotExists(triple.subject);
            node.label = triple.object;
            return null;
        } else if (triple.property == "http://www.w3.org/2000/01/rdf-schema#comment") {
            var node = addNodeIfNotExists(triple.subject);
            node.comment = triple.object;
            return null;
        } else {
            addNodeIfNotExists(triple.object, source);
            var link = {
                "source": triple.subject,
                "target": triple.object,
                "property": triple.property
            };
            graph.links.push(link);
        }
    }
    return link;
}

function addNodeIfNotExists(subjectUri, source) {
    var node = findNode(subjectUri)
    if (node != null) {
        return node;
    } else {
        node = {
            "uri": subjectUri,
            "bron": source
        };
        graph.nodes.push(node)
    }
    return node;
}

function findNode(uri) {
    return graph.nodes.find(function(d) { return d.uri == uri});
}

function findLink(triple) {
    return graph.links.find(function(d) {
        return d.source.uri == triple.subject && d.property == triple.property && d.target.uri == triple.object;
    });
}

function isValidUri(input) {
    return /^(http|https):\/\/[^ "]+$/.test(input);
}