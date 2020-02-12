
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
});