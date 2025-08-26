package com.openclassrooms.mddapi.payload.request;

import lombok.Data;

@Data
public class ArticleRequest {
    private Long topicId;
    private String title;
    private String content;
    private Long userId;
}
