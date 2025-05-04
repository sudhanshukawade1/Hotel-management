package com.example;





import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@SpringBootApplication
@EnableDiscoveryClient


public class DemoApplication {
    
	// Main entry point for the Gateway service
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
	

}
