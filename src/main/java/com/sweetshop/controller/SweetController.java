package com.sweetshop.controller;

import com.sweetshop.dto.SweetDTO;
import com.sweetshop.entity.Sweet;
import com.sweetshop.service.SweetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    @PostMapping
    public ResponseEntity<Sweet> createSweet(@Valid @RequestBody SweetDTO.CreateSweetRequest request) {
        return ResponseEntity.ok(sweetService.createSweet(request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(sweetService.searchSweets(name, category, minPrice, maxPrice));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sweet> updateSweet(
            @PathVariable Long id,
            @Valid @RequestBody SweetDTO.UpdateSweetRequest request) {
        return ResponseEntity.ok(sweetService.updateSweet(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<Sweet> purchaseSweet(@PathVariable Long id) {
        return ResponseEntity.ok(sweetService.purchaseSweet(id));
    }

    public ResponseEntity<Sweet> restockSweet(
            @PathVariable Long id,
            @Valid @RequestBody SweetDTO.RestockRequest request) {
        return ResponseEntity.ok(sweetService.restockSweet(id, request));
    }
}
