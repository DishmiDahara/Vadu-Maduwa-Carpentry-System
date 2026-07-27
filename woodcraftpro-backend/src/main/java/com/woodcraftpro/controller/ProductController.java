package com.woodcraftpro.controller;

import com.woodcraftpro.model.Product;
import com.woodcraftpro.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByProductNameContainingIgnoreCase(search);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setProductName(productDetails.getProductName());
            product.setDescription(productDetails.getDescription());
            product.setBasePrice(productDetails.getBasePrice());
            product.setImageUrl(productDetails.getImageUrl());
            product.setAvailable(productDetails.getAvailable());
            if (productDetails.getCategory() != null) {
                product.setCategory(productDetails.getCategory());
            }
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
