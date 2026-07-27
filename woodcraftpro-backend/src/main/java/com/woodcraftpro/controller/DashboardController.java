package com.woodcraftpro.controller;

import com.woodcraftpro.model.Bill;
import com.woodcraftpro.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private BillRepository billRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalProducts = productRepository.count();
        long totalInquiries = inquiryRepository.count();
        long newInquiries = inquiryRepository.findByStatus("NEW").size();
        long totalQuotations = quotationRepository.count();
        long totalBills = billRepository.count();

        List<Bill> bills = billRepository.findAll();
        BigDecimal totalRevenue = bills.stream()
                .map(Bill::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstandingBalance = bills.stream()
                .map(Bill::getBalanceAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalProducts", totalProducts);
        stats.put("totalInquiries", totalInquiries);
        stats.put("newInquiries", newInquiries);
        stats.put("totalQuotations", totalQuotations);
        stats.put("totalBills", totalBills);
        stats.put("totalRevenue", totalRevenue);
        stats.put("outstandingBalance", outstandingBalance);

        return stats;
    }
}
