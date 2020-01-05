var graph = {
  "nodes": [
    {"uri": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "bron":"http://lod.onderwijsregistratie.nl"},
    {"uri": "http://www.w3.org/2002/07/owl#Class","bron":"http://lod.onderwijsregistratie.nl"},
    {"uri": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenOpleiding","bron":"http://lod.onderwijsregistratie.nl"},
    {"uri": "AangebodenVoOpleiding","bron":"http://lod.onderwijsregistratie.nl"},
    {"uri": "Is een Opleidingseenheid die door een Onderwijsaanbieder aangeboden wordt in het VO, in een bepaalde vorm, al dan niet op een bepaalde Onderwijslocatie.","bron":"http://lod.andere.uri"}
  ],
  "links": [
      {"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "target": "http://www.w3.org/2002/07/owl#Class", "subject": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding" , "property" :"http://www.w3.org/1999/02/22-rdf-syntax-ns#type",  "object": "http://www.w3.org/2002/07/owl#Class"},
      {"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "target": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenOpleiding", "subject": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "property": "http://www.w3.org/2000/01/rdf-schema#subClassOf",  "object": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenOpleiding"},
      {"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "target": "AangebodenVoOpleiding", "subject": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "property": "http://www.w3.org/2000/01/rdf-schema#label",  "object": "AangebodenVoOpleiding"},
      {"source": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "target": "Is een Opleidingseenheid die door een Onderwijsaanbieder aangeboden wordt in het VO, in een bepaalde vorm, al dan niet op een bepaalde Onderwijslocatie.", "subject": "http://lod.onderwijsregistratie.nl/cat/cdm/def/AangebodenVoOpleiding", "property": "http://www.w3.org/2000/01/rdf-schema#comment",  "object": "Is een Opleidingseenheid die door een Onderwijsaanbieder aangeboden wordt in het VO, in een bepaalde vorm, al dan niet op een bepaalde Onderwijslocatie."}
  ]
}