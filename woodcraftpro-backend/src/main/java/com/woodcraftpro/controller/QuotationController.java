package com.woodcraftpro.controller;

import com.woodcraftpro.model.Quotation;
import com.woodcraftpro.repository.QuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "*")
public class QuotationController {

    @Autowired
    private QuotationRepository quotationRepository;

    @GetMapping
    public List<Quotation> getAllQuotations() {
        return quotationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quotation> getQuotationById(@PathVariable Long id) {
        return quotationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Quotation createQuotation(@RequestBody Quotation quotation) {
        if (quotation.getQuotationNumber() == null || quotation.getQuotationNumber().isEmpty()) {
            quotation.setQuotationNumber("WCP-QT-" + System.currentTimeMillis());
        }
        if (quotation.getItems() != null) {
            quotation.getItems().forEach(item -> item.setQuotation(quotation));
        }

        // Auto calculate total amount
        BigDecimal itemsTotal = quotation.getItems() != null ?
                quotation.getItems().stream()
                        .map(i -> i.getTotalPrice() != null ? i.getTotalPrice() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add) : BigDecimal.ZERO;

        BigDecimal mat = quotation.getMaterialCost() != null ? quotation.getMaterialCost() : BigDecimal.ZERO;
        BigDecimal lab = quotation.getLabourCost() != null ? quotation.getLabourCost() : BigDecimal.ZERO;
        BigDecimal add = quotation.getAdditionalCharges() != null ? quotation.getAdditionalCharges() : BigDecimal.ZERO;

        quotation.setTotalAmount(itemsTotal.add(mat).add(lab).add(add));

        return quotationRepository.save(quotation);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Quotation> updateQuotationStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return quotationRepository.findById(id).map(quotation -> {
            if (newStatus != null) {
                quotation.setStatus(newStatus);
            }
            return ResponseEntity.ok(quotationRepository.save(quotation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable Long id) {
        if (quotationRepository.existsById(id)) {
            quotationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
