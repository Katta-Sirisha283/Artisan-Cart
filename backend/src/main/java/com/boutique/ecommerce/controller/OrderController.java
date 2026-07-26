package com.boutique.ecommerce.controller;

import com.boutique.ecommerce.model.Order;
import com.boutique.ecommerce.repository.CustomerRepository;
import com.boutique.ecommerce.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public OrderController(OrderRepository orderRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> myOrders(Authentication auth) {
        var customer = customerRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByCustomerOrderByCreatedAtDesc(customer));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Order.Status status) {
        // Note: in a real app this endpoint would be restricted to admin roles.
        var order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
