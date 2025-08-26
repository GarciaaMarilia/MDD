package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.ArticlesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticlesService {

    private final ArticlesRepository articlesRepository;
    private final UserService userService;

    public Article createArticle(Article article) {
        article.setCreatedAt(LocalDateTime.now());
        return articlesRepository.save(article);
    }

    public List<Article> getAllArticles() {
        return articlesRepository.findAll();
    }

    public List<Article> getArticlesByUser(Long userId) {
        User user = userService.getUserById(userId);
        Set<Topic> subscribedTopics = user.getSubscriptions();

        return articlesRepository.findByTopicIn(new ArrayList<>(subscribedTopics));
    }

    public Optional<Article> getArticleById(Long id) {
        return articlesRepository.findById(id);
    }
}
