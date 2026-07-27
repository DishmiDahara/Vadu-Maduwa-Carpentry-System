package com.woodcraftpro.controller;

import com.woodcraftpro.model.Gallery;
import com.woodcraftpro.repository.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {

    @Autowired
    private GalleryRepository galleryRepository;

    @GetMapping
    public List<Gallery> getAllGalleryItems(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
            return galleryRepository.findByCategoryIgnoreCase(category);
        }
        return galleryRepository.findAll();
    }

    @PostMapping
    public Gallery createGalleryItem(@RequestBody Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGalleryItem(@PathVariable Long id) {
        if (galleryRepository.existsById(id)) {
            galleryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
