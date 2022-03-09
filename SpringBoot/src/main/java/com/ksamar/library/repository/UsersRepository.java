package com.ksamar.library.repository;

import com.ksamar.library.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsersRepository extends JpaRepository<Users,Integer> {
    Users findByPhone(String phone);
    List<Users> findByUsernameLike(String name);
}
