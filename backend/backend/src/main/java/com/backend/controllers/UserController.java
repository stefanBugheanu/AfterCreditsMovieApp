package com.backend.controllers;

import com.backend.dtos.user.UserStatsDto;
import com.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @GetMapping("me/stats")
    public ResponseEntity<UserStatsDto>  getUserStats(){
        return ResponseEntity.ok(userService.getUserStats());
    }
}
