FROM solr:8.4.1


# Enviroment
ENV SOLR_CORE lod_core
ENV SOLR_VERSION 8.4.1

# Create Directories
RUN mkdir -p /var/solr/data/$SOLR_CORE

# Adding Files

ADD ./conf/ /var/solr/data/$SOLR_CORE/conf/
ADD ./core.properties /var/solr/data/$SOLR_CORE

USER root

#RUN chown -R $SOLR_USER:$SOLR_USER /var/solr/server/solr/$SOLR_CORE
RUN chown -R $SOLR_USER:$SOLR_USER /var/solr/data/$SOLR_CORE
RUN chown -R $SOLR_USER:$SOLR_USER /var/solr/data/$SOLR_CORE/conf/lang/stopwords_en.txt
RUN chmod 777 /var/solr/data/$SOLR_CORE
#VOLUME /var/solr/data

# User
#USER $SOLR_USER:$SOLR_USER

#CMD ["solr-precreate", "mycore"]

#RUN mkdir -p /var/solr/data/lod_core

#ADD ./schema.xml /var/solr/data/lod_core/
#ADD ./solrconfig.xml /var/solr/data/lod_core/
#ADD ./core.properties /var/solr/data/lod_core/
CMD ["-force"]