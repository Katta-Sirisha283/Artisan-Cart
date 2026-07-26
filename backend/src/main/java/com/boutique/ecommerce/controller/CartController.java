package com.boutique.ecommerce.controller;

import com.boutique.ecommerce.dto.CartItemRequest;
import com.boutique.ecommerce.dto.CheckoutRequest;
import com.boutique.ecommerce.model.CartItem;
import com.boutique.ecommerce.model.Order;
import com.boutique.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart(Authentication auth) {
        return cartService.getCart(auth.getName());
    }

    @PostMapping
    public ResponseEntity<?> addToCart(Authentication auth, @Valid @RequestBody CartItemRequest req) {
        try {
            return ResponseEntity.ok(cartService.addToCart(auth.getName(), req.productId, req.quantity));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(Authentication auth, @PathVariable Long cartItemId) {
        cartService.removeFromCart(auth.getName(), cartItemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication auth, @Valid @RequestBody CheckoutRequest req) {
        try {
            Order order = cartService.checkout(auth.getName(), req.shippingAddress);
            return ResponseEntity.ok(order);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    record ErrorResponse(String message) {}
}
