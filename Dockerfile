# Build using this command:
# docker buildx build --platform linux/amd64 --tag tgetzoyan/receipts:latest --push --no-cache .
FROM openjdk:17
COPY server/build/libs/server-0.0.1-SNAPSHOT.jar /opt
EXPOSE 8080
WORKDIR /opt
ENTRYPOINT ["java", "-jar","server-0.0.1-SNAPSHOT.jar"]
