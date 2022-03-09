package com.ksamar.library.repository;

import com.ksamar.library.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow,Integer> {
    List<Borrow> findByIsbn(String isbn);
}