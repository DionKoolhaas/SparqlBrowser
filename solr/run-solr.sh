sudo docker build -t dionkoolhaas/lod-solr .
sudo docker run -p 8983:8983 -t dionkoolhaas/lod-solr:latest