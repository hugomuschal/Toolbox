package de.hugo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BackendInitializer.class, args);
        System.out.println("Backend gestartet");
    }

}
