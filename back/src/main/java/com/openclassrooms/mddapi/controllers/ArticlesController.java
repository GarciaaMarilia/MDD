package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Article;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.openclassrooms.mddapi.repositories.ArticlesRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
public class ArticlesController {

    private final ArticlesRepository articlesRepository;

    public ArticlesController(ArticlesRepository articleRepository) {
        this.articlesRepository = articleRepository;
    }

    @PostMapping
    public Article createArticle(@RequestBody Article article) {
        article.setCreatedAt(LocalDateTime.now());
        return articlesRepository.save(article);
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return articlesRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> article = articlesRepository.findById(id);
        return article.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
