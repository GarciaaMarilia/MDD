package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.payload.request.CommentRequest;
import com.openclassrooms.mddapi.services.CommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentsController {

    @Autowired
    private CommentsService commentService;

    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<Comment>> getCommentsByArticle(@PathVariable Long articleId) {
        try {
            List<Comment> comments = commentService.getCommentsByArticleId(articleId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/article/{articleId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long articleId,
            @Valid @RequestBody CommentRequest request) {
        try {
            Comment comment = commentService.createComment(articleId, request.getUserId(), request.getContent());
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}