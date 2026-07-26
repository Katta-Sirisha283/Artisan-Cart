package com.boutique.ecommerce.controller;

import com.boutique.ecommerce.service.AiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiService aiService;

    // A short static knowledge base the chatbot draws on. In a production system
    // this could be pulled from a CMS or FAQ database instead.
    private static final String STORE_CONTEXT =
        "We sell handmade ceramics and jewelry. Standard shipping takes 5-7 business days. " +
        "Returns are accepted within 30 days of delivery if the item is unused. " +
        "Each piece is handmade so slight variations in color/texture are normal, not defects.";

    public ChatController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = aiService.chatSupport(request.message(), STORE_CONTEXT);
        return new ChatResponse(reply);
    }

    record ChatRequest(String message) {}
    record ChatResponse(String reply) {}
}
