# Maven build envirionment
FROM maven:3.6.3-jdk-11 AS build

RUN mkdir -p /usr/share/maven/ref/
COPY settings.xml /usr/share/maven/ref/

COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
#RUN mvn -f /usr/src/app/pom.xml clean package
RUN mvn -f /usr/src/app/pom.xml clean package -s /usr/share/maven/ref/settings.xml
COPY iot.properties /usr/src/app/target/

# Java run
FROM openjdk:11-jre-slim
COPY --from=build /usr/src/app/target/iotclient-1.0.0.jar /usr/app/
COPY --from=build /usr/src/app/target/lib /usr/app/lib
COPY --from=build /usr/src/app/target/iot.properties /iot.properties
ENTRYPOINT ["java", "-jar", "/usr/app/iotclient-1.0.0.jar"]