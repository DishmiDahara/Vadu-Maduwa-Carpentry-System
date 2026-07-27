package com.woodcraftpro.controller;

import com.woodcraftpro.model.Bill;
import com.woodcraftpro.model.Payment;
import com.woodcraftpro.repository.BillRepository;
import com.woodcraftpro.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @GetMapping
    public List<Payment> getAllPayments(@RequestParam(required = false) Long billId) {
        if (billId != null) {
            return paymentRepository.findByBillId(billId);
        }
        return paymentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody Payment payment) {
        if (payment.getReceiptNumber() == null || payment.getReceiptNumber().isEmpty()) {
            payment.setReceiptNumber("REC-" + System.currentTimeMillis());
        }

        if (payment.getBill() == null || payment.getBill().getId() == null) {
            return ResponseEntity.badRequest().body("Bill ID is required");
        }

        Optional<Bill> billOpt = billRepository.findById(payment.getBill().getId());
        if (billOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Bill not found");
        }

        Bill bill = billOpt.get();
        Payment savedPayment = paymentRepository.save(payment);

        // Update bill paid amount and balance
        BigDecimal currentPaid = bill.getPaidAmount() != null ? bill.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newPaid = currentPaid.add(payment.getAmount());
        bill.setPaidAmount(newPaid);
        bill.setBalanceAmount(bill.getTotalAmount().subtract(newPaid));

        if (bill.getBalanceAmount().compareTo(BigDecimal.ZERO) <= 0) {
            bill.setStatus("PAID");
        } else if (newPaid.compareTo(BigDecimal.ZERO) > 0) {
            bill.setStatus("PARTIAL");
        }

        billRepository.save(bill);

        return ResponseEntity.ok(savedPayment);
    }
}
