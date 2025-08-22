package com.openclassrooms.mddapi.repositories;

import com.openclassrooms.mddapi.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticlesRepository extends JpaRepository<Article, Long> {
}
