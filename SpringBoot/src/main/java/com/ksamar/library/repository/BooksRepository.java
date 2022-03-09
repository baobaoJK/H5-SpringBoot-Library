package com.ksamar.library.repository;

import com.ksamar.library.entity.Books;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BooksRepository extends JpaRepository<Books,Integer> {
    List<Books> findByNameLike(String book);
    List<Books> findByIsbn(String Isbn);
}
