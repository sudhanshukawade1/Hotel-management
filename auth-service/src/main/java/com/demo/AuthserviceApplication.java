package com.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaRepositories("com.repository")  // Explicitly scan repositories
@EntityScan("com.model")                  // Scan entities
@ComponentScan({"com"})
public class AuthserviceApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthserviceApplication.class);

    public static void main(String[] args) {
        logger.info("Starting Auth Service Application...");
        SpringApplication.run(AuthserviceApplication.class, args);
        logger.info("Auth Service Application started successfully");
    }
}
