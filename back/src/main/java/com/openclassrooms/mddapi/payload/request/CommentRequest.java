package com.openclassrooms.mddapi.payload.request;

import lombok.Data;

@Data
public class CommentRequest {
    private Long userId;
    private String content;
}
