package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.TopicsRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private TopicsRepository topicsRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }

    public User subscribeUserToTopic(Long userId, Long topicId) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicsRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        user.getSubscriptions().add(topic);
        return repo.save(user);
    }

    public User unsubscribeUserFromTopic(Long userId, Long topicId) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicsRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        user.getSubscriptions().remove(topic);
        return repo.save(user);
    }

    public User getUserById(Long userId) {
        return repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
