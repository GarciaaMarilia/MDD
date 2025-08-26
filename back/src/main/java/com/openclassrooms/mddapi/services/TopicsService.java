package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.repositories.TopicsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicsService {

    private final TopicsRepository topicsRepository;

    public List<Topic> getAllTopics() {
        return topicsRepository.findAll();
    }

    public Topic getTopicById(Long id) {
        return topicsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic não encontrado com id: " + id));
    }
}
