package com.campushub.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campusHubOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Campus Hub Extended API - Mini Project Session 13")
                        .description("RESTful APIs for Campus Information Sharing and Lost & Found Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("IT209 Project Team")
                                .email("team@campus.edu.vn"))
                        .license(new License().name("Apache 2.0")));
    }
}
