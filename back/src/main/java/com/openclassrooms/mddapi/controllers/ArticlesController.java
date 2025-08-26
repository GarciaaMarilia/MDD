package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.payload.request.ArticleRequest;
import com.openclassrooms.mddapi.payload.response.ArticleResponse;
import com.openclassrooms.mddapi.services.ArticlesService;
import com.openclassrooms.mddapi.services.TopicsService;
import com.openclassrooms.mddapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticlesController {

    private final ArticlesService articlesService;
    private final TopicsService topicsService;
    private final UserService userService;

    @PostMapping
    public ArticleResponse createArticle(@RequestBody ArticleRequest dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setCreatedAt(LocalDateTime.now());
        article.setTopic(topicsService.getTopicById(dto.getTopicId()));
        article.setUser(userService.getUserById(dto.getUserId()));

        Article saved = articlesService.createArticle(article);
        return mapToResponse(saved);
    }

    private ArticleResponse mapToResponse(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTopic().getId(),
                article.getTitle(),
                article.getContent(),
                article.getCreatedAt(),
                article.getUser()
        );
    }


    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articlesService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articlesService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<ArticleResponse> getArticlesForUser(@PathVariable Long userId) {
        List<Article> articles = articlesService.getArticlesByUser(userId);
        return articles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
