package com.boutique.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {
    @NotNull
    public Long productId;

    @Min(1)
    public Integer quantity;
}
