package com.woodcraftpro.controller;

import com.woodcraftpro.model.Inquiry;
import com.woodcraftpro.repository.InquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    @GetMapping
    public List<Inquiry> getAllInquiries(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return inquiryRepository.findByStatus(status);
        }
        return inquiryRepository.findAll();
    }

    @PostMapping
    public Inquiry createInquiry(@RequestBody Inquiry inquiry) {
        if (inquiry.getStatus() == null) {
            inquiry.setStatus("NEW");
        }
        return inquiryRepository.save(inquiry);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Inquiry> updateInquiryStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return inquiryRepository.findById(id).map(inquiry -> {
            if (newStatus != null) {
                inquiry.setStatus(newStatus);
            }
            return ResponseEntity.ok(inquiryRepository.save(inquiry));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        if (inquiryRepository.existsById(id)) {
            inquiryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
