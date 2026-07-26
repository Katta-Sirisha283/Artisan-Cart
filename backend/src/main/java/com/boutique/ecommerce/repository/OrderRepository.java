package com.boutique.ecommerce.repository;

import com.boutique.ecommerce.model.Order;
import com.boutique.ecommerce.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByCreatedAtDesc(Customer customer);
}
