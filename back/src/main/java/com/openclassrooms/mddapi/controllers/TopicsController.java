package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.repositories.TopicsRepository;

import com.openclassrooms.mddapi.services.TopicsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicsController {

    private final TopicsService topicsService;

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicsService.getAllTopics();
    }
}
