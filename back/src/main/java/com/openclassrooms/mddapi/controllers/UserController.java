package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/{userId}/subscribe/{topicId}")
    public ResponseEntity<User> subscribe(
            @PathVariable Long userId,
            @PathVariable Long topicId) {
        return ResponseEntity.ok(userService.subscribeUserToTopic(userId, topicId));
    }

    @DeleteMapping("/{userId}/unsubscribe/{topicId}")
    public ResponseEntity<User> unsubscribe(
            @PathVariable Long userId,
            @PathVariable Long topicId) {
        return ResponseEntity.ok(userService.unsubscribeUserFromTopic(userId, topicId));
    }

    @GetMapping("/{userId}/subscriptions")
    public ResponseEntity<Set<Topic>> getUserSubscriptions(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user.getSubscriptions());
    }
}
