package com.boutique.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

    public static class RegisterRequest {
        @Email @NotBlank
        public String email;
        @NotBlank
        public String password;
        @NotBlank
        public String fullName;
    }

    public static class LoginRequest {
        @Email @NotBlank
        public String email;
        @NotBlank
        public String password;
    }

    public static class AuthResponse {
        public String token;
        public String email;
        public String fullName;

        public AuthResponse(String token, String email, String fullName) {
            this.token = token;
            this.email = email;
            this.fullName = fullName;
        }
    }
}
