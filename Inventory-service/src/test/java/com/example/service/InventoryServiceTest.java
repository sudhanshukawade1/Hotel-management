package com.example.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.model.InventoryItem;
import com.example.model.Staff;
import com.example.repository.InventoryItemRepository;
import com.example.repository.StaffRepository;

@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private InventoryItemRepository itemRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Staff staff1, staff2;
    private InventoryItem item1, item2;

    @BeforeEach
    void setUp() {
        // Create test staff
        staff1 = new Staff();
        staff1.setId(1L);
        staff1.setName("John Doe");
        staff1.setRole("MANAGER");
        staff1.setOnDuty(true);

        staff2 = new Staff();
        staff2.setId(2L);
        staff2.setName("Jane Smith");
        staff2.setRole("STAFF");
        staff2.setOnDuty(true);

        // Create test items
        item1 = new InventoryItem();
        item1.setId(1L);
        item1.setName("Towels");
        item1.setQuantity(10);
        item1.setCategory("Bathroom");

        item2 = new InventoryItem();
        item2.setId(2L);
        item2.setName("Pillows");
        item2.setQuantity(5);
        item2.setCategory("Bedroom");
    }

    @Test
    void testFindAvailableItems() {
        // Arrange
        List<InventoryItem> expectedItems = Arrays.asList(item1, item2);
        when(itemRepository.findByQuantityGreaterThan(0)).thenReturn(expectedItems);

        // Act
        List<InventoryItem> actualItems = inventoryService.findAvailableItems();

        // Assert
        assertEquals(expectedItems.size(), actualItems.size());
        assertEquals(expectedItems.get(0).getId(), actualItems.get(0).getId());
        assertEquals(expectedItems.get(0).getName(), actualItems.get(0).getName());
        assertEquals(expectedItems.get(1).getId(), actualItems.get(1).getId());
        assertEquals(expectedItems.get(1).getName(), actualItems.get(1).getName());
        
        verify(itemRepository).findByQuantityGreaterThan(0);
    }

    @Test
    void testFindOnDutyStaff() {
        // Arrange
        List<Staff> expectedStaff = Arrays.asList(staff1, staff2);
        when(staffRepository.findByOnDutyTrue()).thenReturn(expectedStaff);

        // Act
        List<Staff> actualStaff = inventoryService.findOnDutyStaff();

        // Assert
        assertEquals(expectedStaff.size(), actualStaff.size());
        assertEquals(expectedStaff.get(0).getId(), actualStaff.get(0).getId());
        assertEquals(expectedStaff.get(0).getName(), actualStaff.get(0).getName());
        assertEquals(expectedStaff.get(1).getId(), actualStaff.get(1).getId());
        assertEquals(expectedStaff.get(1).getName(), actualStaff.get(1).getName());
        
        verify(staffRepository).findByOnDutyTrue();
    }

    @Test
    void testAddStaff() {
        // Arrange
        Staff newStaff = new Staff();
        newStaff.setName("New Staff");
        newStaff.setRole("HOUSEKEEPER");
        newStaff.setOnDuty(true);

        Staff savedStaff = new Staff();
        savedStaff.setId(3L);
        savedStaff.setName("New Staff");
        savedStaff.setRole("HOUSEKEEPER");
        savedStaff.setOnDuty(true);

        when(staffRepository.save(newStaff)).thenReturn(savedStaff);

        // Act
        Staff result = inventoryService.addStaff(newStaff);

        // Assert
        assertEquals(savedStaff.getId(), result.getId());
        assertEquals(savedStaff.getName(), result.getName());
        assertEquals(savedStaff.getRole(), result.getRole());
        assertEquals(savedStaff.isOnDuty(), result.isOnDuty());
        
        verify(staffRepository).save(newStaff);
    }

    @Test
    void testAddItem() {
        // Arrange
        InventoryItem newItem = new InventoryItem();
        newItem.setName("Soap");
        newItem.setQuantity(20);
        newItem.setCategory("Bathroom");

        InventoryItem savedItem = new InventoryItem();
        savedItem.setId(3L);
        savedItem.setName("Soap");
        savedItem.setQuantity(20);
        savedItem.setCategory("Bathroom");

        when(itemRepository.save(newItem)).thenReturn(savedItem);

        // Act
        InventoryItem result = inventoryService.addItem(newItem);

        // Assert
        assertEquals(savedItem.getId(), result.getId());
        assertEquals(savedItem.getName(), result.getName());
        assertEquals(savedItem.getQuantity(), result.getQuantity());
        assertEquals(savedItem.getCategory(), result.getCategory());
        
        verify(itemRepository).save(newItem);
    }
} 