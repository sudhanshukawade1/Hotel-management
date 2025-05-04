package com.example.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.model.InventoryItem;
import com.example.model.Staff;
import com.example.repository.InventoryItemRepository;
import com.example.repository.StaffRepository;
import com.example.exception.AppExceptions;

@Service
public class InventoryService {
	
	private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
	
	private final StaffRepository staffRepo;
	private final InventoryItemRepository itemRepo;
	
	public InventoryService(StaffRepository staffRepo , InventoryItemRepository itemRepo) {
		this.staffRepo = staffRepo;
		this.itemRepo = itemRepo;
		logger.debug("InventoryService initialized");
	}
	
	// public methods
	
	public List<InventoryItem> findAvailableItems() {
		logger.info("Finding all items with quantity greater than 0");
		
		List<InventoryItem> items = itemRepo.findByQuantityGreaterThan(0);
		
		logger.debug("Found {} available items", items.size());
		return items;
	}
	
	public List<Staff> findOnDutyStaff() {
		logger.info("Finding all staff members who are on duty");
		
		List<Staff> onDutyStaff = staffRepo.findByOnDutyTrue();
		
		logger.debug("Found {} staff members on duty", onDutyStaff.size());
		return onDutyStaff;
	}
	
	
	// secured methods
	
	public Staff addStaff(Staff staff) {
		logger.info("Adding new staff member: {}, role={}", staff.getName(), staff.getRole());
		
		Staff savedStaff = staffRepo.save(staff);
		
		logger.debug("Staff member saved with ID: {}", savedStaff.getId());
		return savedStaff;
	}
	
	public InventoryItem addItem(InventoryItem item) {
		logger.info("Adding new inventory item: {}, category={}", item.getName(), item.getCategory());
		logger.debug("Item details: quantity={}", item.getQuantity());
		
		InventoryItem savedItem = itemRepo.save(item);
		
		logger.debug("Inventory item saved with ID: {}", savedItem.getId());
		return savedItem;
	}

	public InventoryItem updateItem(Long id, InventoryItem updated) {
		logger.info("Updating inventory item with ID: {}", id);
		InventoryItem item = itemRepo.findById(id)
			.orElseThrow(() -> new AppExceptions.ItemNotFoundException("Item not found"));
		item.setName(updated.getName());
		item.setQuantity(updated.getQuantity());
		item.setCategory(updated.getCategory());
		InventoryItem saved = itemRepo.save(item);
		logger.info("Inventory item updated with ID: {}", saved.getId());
		return saved;
	}

	public void deleteItem(Long id) {
		logger.info("Deleting inventory item with ID: {}", id);
		itemRepo.deleteById(id);
		logger.info("Inventory item deleted with ID: {}", id);
	}

	public Staff updateStaff(Long id, Staff updated) {
		logger.info("Updating staff with ID: {}", id);
		Staff staff = staffRepo.findById(id)
			.orElseThrow(() -> new AppExceptions.StaffNotFoundException("Staff not found"));
		staff.setName(updated.getName());
		staff.setRole(updated.getRole());
		staff.setOnDuty(updated.isOnDuty());
		Staff saved = staffRepo.save(staff);
		logger.info("Staff updated with ID: {}", saved.getId());
		return saved;
	}

	public void deleteStaff(Long id) {
		logger.info("Deleting staff with ID: {}", id);
		staffRepo.deleteById(id);
		logger.info("Staff deleted with ID: {}", id);
	}
}