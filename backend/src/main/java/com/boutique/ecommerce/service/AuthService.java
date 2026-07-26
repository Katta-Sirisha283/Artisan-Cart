package com.boutique.ecommerce.service;

import com.boutique.ecommerce.dto.AuthDtos.*;
import com.boutique.ecommerce.model.Customer;
import com.boutique.ecommerce.repository.CustomerRepository;
import com.boutique.ecommerce.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (customerRepository.existsByEmail(req.email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        Customer customer = new Customer(req.email, passwordEncoder.encode(req.password), req.fullName);
        customerRepository.save(customer);
        String token = jwtUtil.generateToken(customer.getEmail());
        return new AuthResponse(token, customer.getEmail(), customer.getFullName());
    }

    public AuthResponse login(LoginRequest req) {
        Customer customer = customerRepository.findByEmail(req.email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(req.password, customer.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(customer.getEmail());
        return new AuthResponse(token, customer.getEmail(), customer.getFullName());
    }
}
