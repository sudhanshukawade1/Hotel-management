package com.example.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.model.InventoryItem;
import com.example.model.Staff;
import com.example.service.InventoryService;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
	
	private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);
	
	private final InventoryService inventoryservice;
	
	public InventoryController(InventoryService inventoryservice) {
		this.inventoryservice = inventoryservice;
		logger.debug("InventoryController initialized");
	}
	
	// Public Endpoints
	@GetMapping("/public/items")
	public List<InventoryItem> getAvailableItems() {
		logger.info("GET request received for /inventory/public/items");
		List<InventoryItem> items = inventoryservice.findAvailableItems();
		logger.debug("Returning {} available items", items.size());
		return items;
	}
	
	// Get all on-duty staff members
	@GetMapping("/public/staff")
	public List<Staff> getOnDutyStaff() {
		logger.info("GET request received for /inventory/public/staff");
		List<Staff> staff = inventoryservice.findOnDutyStaff();
		logger.debug("Returning {} on-duty staff members", staff.size());
		return staff;
	}
	
	// Secured Endpoints 
	// Add a new staff member
	@PostMapping("/staff")
	public Staff addStaff(@RequestBody Staff staff,
			@RequestHeader("X-User-Role") String role) {
		
		logger.info("POST request received for /inventory/staff");
		logger.debug("Request to add staff member: {}, role={}", staff.getName(), staff.getRole());
		
		if (!"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to add staff by role: {}", role);
			throw new RuntimeException("Requires OWNER role");
		}
		
		logger.debug("Authorization successful with role: {}", role);
		Staff savedStaff = inventoryservice.addStaff(staff);
		logger.info("Staff member added successfully with ID: {}", savedStaff.getId());
		return savedStaff;
	}
	
	// Add a new item
	@PostMapping("/items")
	public InventoryItem addItem(@RequestBody InventoryItem item,
			@RequestHeader("X-User-Role") String role) {
		
		logger.info("POST request received for /inventory/items");
		logger.debug("Request to add inventory item: {}, category={}", item.getName(), item.getCategory());
		
		if(!"MANAGER".equals(role) && !"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to add inventory item by role: {}", role);
			throw new RuntimeException("Requires MANAGER or OWNER role");
		}
		
		logger.debug("Authorization successful with role: {}", role);
		InventoryItem savedItem = inventoryservice.addItem(item);
		logger.info("Inventory item added successfully with ID: {}", savedItem.getId());
		return savedItem;
	}
	
	// update an item
	@PutMapping("/items/{id}")
	public InventoryItem updateItem(@PathVariable Long id, @RequestBody InventoryItem item, @RequestHeader("X-User-Role") String role) {
		logger.info("PUT request received for /inventory/items/{}", id);
		if (!"MANAGER".equals(role) && !"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to update inventory item by role: {}", role);
			throw new RuntimeException("Requires MANAGER or OWNER role");
		}
		return inventoryservice.updateItem(id, item);
	}
    
	// Delete an item
	@DeleteMapping("/items/{id}")
	public void deleteItem(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
		logger.info("DELETE request received for /inventory/items/{}", id);
		if (!"MANAGER".equals(role) && !"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to delete inventory item by role: {}", role);
			throw new RuntimeException("Requires MANAGER or OWNER role");
		}
		inventoryservice.deleteItem(id);
	}
    // update a staff member
	@PutMapping("/staff/{id}")
	public Staff updateStaff(@PathVariable Long id, @RequestBody Staff staff, @RequestHeader("X-User-Role") String role) {
		logger.info("PUT request received for /inventory/staff/{}", id);
		if (!"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to update staff by role: {}", role);
			throw new RuntimeException("Requires OWNER role");
		}
		return inventoryservice.updateStaff(id, staff);
	}
    // Delete a staff member
	@DeleteMapping("/staff/{id}")
	public void deleteStaff(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
		logger.info("DELETE request received for /inventory/staff/{}", id);
		if (!"OWNER".equals(role)) {
			logger.warn("Unauthorized attempt to delete staff by role: {}", role);
			throw new RuntimeException("Requires OWNER role");
		}
		inventoryservice.deleteStaff(id);
	}

}
