package com.example.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;


import com.example.model.InventoryItem;
import com.example.model.Staff;
import com.example.service.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.servlet.ServletException;

@ExtendWith(MockitoExtension.class)
public class InventoryControllerTest {

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private InventoryController inventoryController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(inventoryController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testGetAvailableItems() throws Exception {
        // Arrange
        InventoryItem item1 = new InventoryItem();
        item1.setId(1L);
        item1.setName("Towels");
        item1.setQuantity(10);
        item1.setCategory("Bathroom");

        InventoryItem item2 = new InventoryItem();
        item2.setId(2L);
        item2.setName("Pillows");
        item2.setQuantity(5);
        item2.setCategory("Bedroom");

        List<InventoryItem> items = Arrays.asList(item1, item2);
        when(inventoryService.findAvailableItems()).thenReturn(items);

        // Act & Assert
        mockMvc.perform(get("/inventory/public/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Towels"))
                .andExpect(jsonPath("$[0].quantity").value(10))
                .andExpect(jsonPath("$[0].category").value("Bathroom"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Pillows"))
                .andExpect(jsonPath("$[1].quantity").value(5))
                .andExpect(jsonPath("$[1].category").value("Bedroom"));

        verify(inventoryService).findAvailableItems();
    }

    @Test
    void testGetOnDutyStaff() throws Exception {
        // Arrange
        Staff staff1 = new Staff();
        staff1.setId(1L);
        staff1.setName("John Doe");
        staff1.setRole("MANAGER");
        staff1.setOnDuty(true);

        Staff staff2 = new Staff();
        staff2.setId(2L);
        staff2.setName("Jane Smith");
        staff2.setRole("STAFF");
        staff2.setOnDuty(true);

        List<Staff> staffList = Arrays.asList(staff1, staff2);
        when(inventoryService.findOnDutyStaff()).thenReturn(staffList);

        // Act & Assert
        mockMvc.perform(get("/inventory/public/staff"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[0].role").value("MANAGER"))
                .andExpect(jsonPath("$[0].onDuty").value(true))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Jane Smith"))
                .andExpect(jsonPath("$[1].role").value("STAFF"))
                .andExpect(jsonPath("$[1].onDuty").value(true));

        verify(inventoryService).findOnDutyStaff();
    }

    @Test
    void testAddStaff_Success() throws Exception {
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

        when(inventoryService.addStaff(newStaff)).thenReturn(savedStaff);

        // Act & Assert
        mockMvc.perform(post("/inventory/staff")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-User-Role", "OWNER")
                .content(objectMapper.writeValueAsString(newStaff)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("New Staff"))
                .andExpect(jsonPath("$.role").value("HOUSEKEEPER"))
                .andExpect(jsonPath("$.onDuty").value(true));

        verify(inventoryService).addStaff(newStaff);
    }

    @Test
    void testAddStaff_Unauthorized() {
        // Arrange
        Staff newStaff = new Staff();
        newStaff.setName("New Staff");
        newStaff.setRole("HOUSEKEEPER");
        newStaff.setOnDuty(true);

        // Act & Assert
        Exception exception = assertThrows(ServletException.class, () -> {
            mockMvc.perform(post("/inventory/staff")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-User-Role", "MANAGER")
                    .content(objectMapper.writeValueAsString(newStaff)));
        });
        
        assertTrue(exception.getCause() instanceof RuntimeException);
        assertEquals("Requires OWNER role", exception.getCause().getMessage());
    }

    @Test
    void testAddItem_Success() throws Exception {
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

        when(inventoryService.addItem(newItem)).thenReturn(savedItem);

        // Act & Assert
        mockMvc.perform(post("/inventory/items")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-User-Role", "MANAGER")
                .content(objectMapper.writeValueAsString(newItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("Soap"))
                .andExpect(jsonPath("$.quantity").value(20))
                .andExpect(jsonPath("$.category").value("Bathroom"));

        verify(inventoryService).addItem(newItem);
    }

    @Test
    void testAddItem_Unauthorized() {
        // Arrange
        InventoryItem newItem = new InventoryItem();
        newItem.setName("Soap");
        newItem.setQuantity(20);
        newItem.setCategory("Bathroom");

        // Act & Assert
        Exception exception = assertThrows(ServletException.class, () -> {
            mockMvc.perform(post("/inventory/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-User-Role", "STAFF")
                    .content(objectMapper.writeValueAsString(newItem)));
        });
        
        assertTrue(exception.getCause() instanceof RuntimeException);
        assertEquals("Requires MANAGER or OWNER role", exception.getCause().getMessage());
    }
} 