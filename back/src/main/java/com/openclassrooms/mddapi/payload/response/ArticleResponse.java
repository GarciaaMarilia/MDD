package com.openclassrooms.mddapi.payload.response;

import com.openclassrooms.mddapi.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponse {
    private Long id;
    private Long topicId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private User user;
}