package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
	    List<Staff> findByOnDutyTrue();
	}


