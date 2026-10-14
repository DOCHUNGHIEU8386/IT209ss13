package com.campushub.service;

import com.campushub.dto.CommentDto;
import com.campushub.dto.CreateCommentRequest;
import com.campushub.dto.CreatePostRequest;
import com.campushub.dto.PostDto;
import com.campushub.entity.Category;
import com.campushub.entity.Comment;
import com.campushub.entity.Post;
import com.campushub.entity.User;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.CategoryRepository;
import com.campushub.repository.CommentRepository;
import com.campushub.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final AuthService authService;

    public List<PostDto> getAllPosts(Long categoryId, String search) {
        List<Post> posts;
        if (search != null && !search.trim().isEmpty()) {
            posts = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByCreatedAtDesc(search, search);
        } else if (categoryId != null) {
            posts = postRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream().map(this::toPostDto).collect(Collectors.toList());
    }

    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + id));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return toPostDto(post);
    }

    @Transactional
    public PostDto createPost(CreatePostRequest request, Long authorId) {
        User author = authService.getUserById(authorId);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên mục với ID: " + request.getCategoryId()));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .category(category)
                .likeCount(0)
                .viewCount(0)
                .build();

        return toPostDto(postRepository.save(post));
    }

    @Transactional
    public PostDto likePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + id));
        post.setLikeCount(post.getLikeCount() + 1);
        return toPostDto(postRepository.save(post));
    }

    public List<CommentDto> getPostComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream().map(this::toCommentDto).collect(Collectors.toList());
    }

    @Transactional
    public CommentDto addComment(Long postId, CreateCommentRequest request, Long authorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + postId));
        User author = authService.getUserById(authorId);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .author(author)
                .post(post)
                .build();

        return toCommentDto(commentRepository.save(comment));
    }

    private PostDto toPostDto(Post post) {
        int commentCount = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId()).size();
        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getFullName())
                .categoryId(post.getCategory().getId())
                .categoryName(post.getCategory().getName())
                .likeCount(post.getLikeCount())
                .viewCount(post.getViewCount())
                .commentCount(commentCount)
                .createdAt(post.getCreatedAt())
                .build();
    }

    private CommentDto toCommentDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getFullName())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
