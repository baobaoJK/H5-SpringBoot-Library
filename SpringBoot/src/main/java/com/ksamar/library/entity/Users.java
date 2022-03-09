package com.ksamar.library.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //设置Id自增
    private Integer id;
    private String groups;
    private String username;
    private String password;
    private String gender;
    private String id_card;
    private String phone;
    private String identity;
}
