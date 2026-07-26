package com.boutique.ecommerce.controller;

import com.boutique.ecommerce.model.Product;
import com.boutique.ecommerce.repository.ProductRepository;
import com.boutique.ecommerce.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final AiService aiService;

    public ProductController(ProductRepository productRepository, AiService aiService) {
        this.productRepository = productRepository;
        this.aiService = aiService;
    }

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String category,
                                 @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findAll();
    }

    @GetMapping("/featured")
    public List<Product> getFeatured() {
        return productRepository.findByFeaturedTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * AI-generated product description from basic attributes.
     * Lets the store owner add a product with minimal input and let AI write the copy.
     */
    @PostMapping("/generate-description")
    public ResponseEntity<?> generateDescription(@RequestBody GenerateDescriptionRequest req) {
        String description = aiService.generateProductDescription(req.name, req.category, req.material);
        return ResponseEntity.ok(new GenerateDescriptionResponse(description));
    }

    record GenerateDescriptionRequest(String name, String category, String material) {}
    record GenerateDescriptionResponse(String description) {}
}
