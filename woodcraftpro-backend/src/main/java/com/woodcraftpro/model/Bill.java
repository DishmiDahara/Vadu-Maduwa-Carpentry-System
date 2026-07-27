package com.woodcraftpro.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", nullable = false, unique = true, length = 50)
    private String billNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quotation_id")
    private Quotation quotation;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAmount;

    @Column(length = 30)
    private String status = "UNPAID"; // UNPAID, PARTIAL, PAID

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "due_date")
    private LocalDate dueDate;
}
