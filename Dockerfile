FROM nginx:alpine
RUN apk add openjdk17
COPY client/dist/client/* /usr/share/nginx/html/
COPY server/build/libs/server-0.0.1-SNAPSHOT.jar /opt
EXPOSE 80
EXPOSE 8080
ENTRYPOINT ["java", "-jar","/opt/server-0.0.1-SNAPSHOT.jar"]
CMD ["nginx", "-g", "\"daemon off;\""]