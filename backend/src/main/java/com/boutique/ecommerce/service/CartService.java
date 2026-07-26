package com.boutique.ecommerce.service;

import com.boutique.ecommerce.model.*;
import com.boutique.ecommerce.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository,
                        CustomerRepository customerRepository, OrderRepository orderRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    private Customer requireCustomer(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
    }

    public List<CartItem> getCart(String email) {
        return cartItemRepository.findByCustomer(requireCustomer(email));
    }

    @Transactional
    public CartItem addToCart(String email, Long productId, int quantity) {
        Customer customer = requireCustomer(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        return cartItemRepository.findByCustomerAndProductId(customer, productId)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> cartItemRepository.save(new CartItem(customer, product, quantity)));
    }

    @Transactional
    public void removeFromCart(String email, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        cartItemRepository.delete(item);
    }

    @Transactional
    public Order checkout(String email, String shippingAddress) {
        Customer customer = requireCustomer(email);
        List<CartItem> items = cartItemRepository.findByCustomer(customer);
        if (items.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(shippingAddress);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            Product product = item.getProduct();
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            OrderItem orderItem = new OrderItem(order, product, item.getQuantity(), product.getPrice());
            order.getItems().add(orderItem);

            // decrement stock
            product.setStockQuantity(Math.max(0, product.getStockQuantity() - item.getQuantity()));
            productRepository.save(product);
        }
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByCustomer(customer);
        return saved;
    }
}
