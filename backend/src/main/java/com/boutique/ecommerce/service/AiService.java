package com.boutique.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.model}")
    private String model;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Generates a compelling product description from raw product attributes.
     */
    public String generateProductDescription(String name, String category, String material) {
        String prompt = String.format(
            "Write a warm, evocative 2-3 sentence product description for a handmade %s called \"%s\" made of %s. " +
            "Write in a boutique, artisanal brand voice. Do not include a title, just the description text.",
            category, name, material
        );
        return callClaude(prompt);
    }

    /**
     * Answers a customer support question using simple context about the store.
     */
    public String chatSupport(String customerMessage, String storeContext) {
        String prompt = String.format(
            "You are a friendly customer support assistant for a handmade goods boutique (ceramics and jewelry). " +
            "Store context: %s. Answer the customer's question helpfully and concisely. " +
            "If you cannot answer confidently, say a human team member will follow up. " +
            "Customer question: %s",
            storeContext, customerMessage
        );
        return callClaude(prompt);
    }

    /**
     * Generates a short natural-language explanation of why products are recommended,
     * given the customer's recent activity.
     */
    public String explainRecommendation(String recentActivity, String recommendedProductName) {
        String prompt = String.format(
            "A customer recently viewed/purchased: %s. Explain in one short, friendly sentence why they " +
            "might also like this product: %s.",
            recentActivity, recommendedProductName
        );
        return callClaude(prompt);
    }

    private String callClaude(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI features are not configured (missing ANTHROPIC_API_KEY).";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectNode body = mapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", 300);
        var messages = mapper.createArrayNode();
        ObjectNode userMsg = mapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        messages.add(userMsg);
        body.set("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(body.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(ANTHROPIC_URL, entity, String.class);
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode contentArray = root.path("content");
            if (contentArray.isArray() && contentArray.size() > 0) {
                return contentArray.get(0).path("text").asText();
            }
            return "Sorry, I couldn't generate a response right now.";
        } catch (Exception e) {
            return "AI service temporarily unavailable: " + e.getMessage();
        }
    }
}
