package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.repositories.ArticlesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticlesService {

    private final ArticlesRepository articlesRepository;

    public Article createArticle(Article article) {
        article.setCreatedAt(LocalDateTime.now());
        return articlesRepository.save(article);
    }

    public List<Article> getAllArticles() {
        return articlesRepository.findAll();
    }

    public Optional<Article> getArticleById(Long id) {
        return articlesRepository.findById(id);
    }
}
