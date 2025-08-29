package com.openclassrooms.mddapi.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long articleId;
    private Long userId;
    private String username;
}
