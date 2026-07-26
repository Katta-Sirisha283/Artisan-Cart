package com.boutique.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {
    @NotBlank
    public String shippingAddress;
}
