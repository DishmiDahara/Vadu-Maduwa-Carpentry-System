package com.woodcraftpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 30)
    private String status = "NEW"; // NEW, CONTACTED, COMPLETED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
