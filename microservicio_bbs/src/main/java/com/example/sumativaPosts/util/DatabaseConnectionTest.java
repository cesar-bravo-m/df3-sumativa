package com.example.sumativaPosts.util;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConnectionTest {

    @Value("${oracle.net.tns_admin:./Wallet_DF3}")
    private String walletLocation;

    @Bean
    public CommandLineRunner testDatabaseConnection(DataSource dataSource) {
        return args -> {
            System.out.println("Probando conexión");
            System.out.println("Ubicación del wallet: " + walletLocation);
            
            System.setProperty("oracle.net.tns_admin", walletLocation);
            System.setProperty("oracle.net.ssl_server_dn_match", "true");
            
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("Conexión exitosa a la base de datos");
                System.out.println("Base de datos: " + conn.getMetaData().getDatabaseProductName());
                System.out.println("Versión: " + conn.getMetaData().getDatabaseProductVersion());
            } catch (SQLException e) {
                System.err.println("Error al conectar a la base de datos:");
                e.printStackTrace();
            }
        };
    }
} 