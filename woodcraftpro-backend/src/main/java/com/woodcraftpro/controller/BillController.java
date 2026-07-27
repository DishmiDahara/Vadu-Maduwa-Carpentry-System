package com.woodcraftpro.controller;

import com.woodcraftpro.model.Bill;
import com.woodcraftpro.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        if (bill.getBillNumber() == null || bill.getBillNumber().isEmpty()) {
            bill.setBillNumber("WCP-INV-" + System.currentTimeMillis());
        }
        if (bill.getPaidAmount() == null) {
            bill.setPaidAmount(BigDecimal.ZERO);
        }
        if (bill.getTotalAmount() != null) {
            bill.setBalanceAmount(bill.getTotalAmount().subtract(bill.getPaidAmount()));
        }
        if (bill.getBalanceAmount().compareTo(BigDecimal.ZERO) <= 0) {
            bill.setStatus("PAID");
        } else if (bill.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            bill.setStatus("PARTIAL");
        } else {
            bill.setStatus("UNPAID");
        }
        return billRepository.save(bill);
    }
}
