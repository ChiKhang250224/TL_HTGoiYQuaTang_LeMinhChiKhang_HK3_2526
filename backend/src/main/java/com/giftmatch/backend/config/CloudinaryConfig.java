package com.giftmatch.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        String finalCloudName = cloudName;
        String finalApiKey = apiKey;
        String finalApiSecret = apiSecret;

        // Fallback to manual .env loading if properties are empty
        if (finalCloudName == null || finalCloudName.isEmpty()) {
            try {
                java.io.File envFile = new java.io.File(".env");
                if (envFile.exists()) {
                    for (String line : java.nio.file.Files.readAllLines(envFile.toPath())) {
                        if (line.contains("=")) {
                            String[] parts = line.split("=", 2);
                            String key = parts[0].trim();
                            String val = parts[1].trim();
                            if (key.equals("CLOUDINARY_CLOUD_NAME")) finalCloudName = val;
                            if (key.equals("CLOUDINARY_API_KEY")) finalApiKey = val;
                            if (key.equals("CLOUDINARY_API_SECRET")) finalApiSecret = val;
                        }
                    }
                }
            } catch (Exception ignored) {}
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", finalCloudName);
        config.put("api_key", finalApiKey);
        config.put("api_secret", finalApiSecret);
        return new Cloudinary(config);
    }
}
