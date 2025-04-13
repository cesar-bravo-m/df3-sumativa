FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package spring-boot:repackage -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/s1a1-0.0.1-SNAPSHOT.jar app.jar

COPY Wallet_DF3 /app/Wallet_DF3

RUN useradd -m myuser
USER myuser

ENV TNS_ADMIN=/app/Wallet_DF3
ENV PATH=/app/Wallet_DF3:$PATH

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 