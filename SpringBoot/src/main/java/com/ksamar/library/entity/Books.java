package com.ksamar.library.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private String groups;
    private String name;
    private String author;
    private String press;
    private Double price;
    private Integer quantity;
    private String isbn;
}
