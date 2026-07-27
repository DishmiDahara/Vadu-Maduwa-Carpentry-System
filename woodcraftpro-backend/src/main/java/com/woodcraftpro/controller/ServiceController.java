package com.woodcraftpro.controller;

import com.woodcraftpro.model.ServiceEntity;
import com.woodcraftpro.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping
    public ServiceEntity createService(@RequestBody ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(@PathVariable Long id, @RequestBody ServiceEntity details) {
        return serviceRepository.findById(id).map(service -> {
            service.setServiceName(details.getServiceName());
            service.setDescription(details.getDescription());
            service.setIconName(details.getIconName());
            service.setImageUrl(details.getImageUrl());
            return ResponseEntity.ok(serviceRepository.save(service));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
