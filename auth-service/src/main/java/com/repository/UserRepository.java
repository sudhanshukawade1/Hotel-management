package com.repository;
  // Make sure this matches your actual package

//import com.google.common.base.Optional;
import com.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository  
public interface UserRepository extends JpaRepository<User, Long> {

  // Finds a user by their email address
    Optional<User> findByEmail(String email);
}