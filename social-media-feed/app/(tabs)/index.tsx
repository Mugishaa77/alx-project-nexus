// app/(tabs)/index.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
  Text,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Post from '../../components/Posts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Post as PostType, Comment, User } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// Mock GraphQL-like queries for DummyJSON data (better English content)
class GraphQLService {
  private currentUser: User | null = null;
  private posts: PostType[] = [];
  private users: User[] = [];

  async initializeCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    // Get random user from DummyJSON as current user
    const userId = Math.floor(Math.random() * 30) + 1;
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`);
      const userData = await response.json();
      
      this.currentUser = {
        id: userData.id.toString(),
        name: `${userData.firstName} ${userData.lastName}`,
        username: userData.username,
        avatar: userData.image
      };
    } catch (error) {
      // Fallback user if API fails
      this.currentUser = {
        id: '1',
        name: 'Sally Wanga',
        username: 'mugisha',
        avatar: 'https://i.pravatar.cc/150?img=1'
      };
    }
    
    return this.currentUser;
  }

  async fetchUsers() {
    if (this.users.length > 0) return this.users;
    
    const response = await fetch('https://dummyjson.com/users?limit=30');
    const usersData = await response.json();
    
    this.users = usersData.users.map((user: any) => ({
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      email: user.email,
      avatar: user.image
    }));
    
    return this.users;
  }

  async fetchPosts(page: number = 1, limit: number = 10) {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Fetch posts with better English content from DummyJSON
    const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
      fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`),
      fetch('https://dummyjson.com/users?limit=30'),
      fetch('https://dummyjson.com/comments?limit=100')
    ]);

    const [postsData, usersData, commentsData] = await Promise.all([
      postsResponse.json(),
      usersResponse.json(),
      commentsResponse.json()
    ]);

    // Group comments by post (simulate post-comment relationships)
    const commentsByPost: { [key: string]: any[] } = {};
    
    // Distribute comments across posts
    commentsData.comments.forEach((comment: any, index: number) => {
      const postIndex = (index % postsData.posts.length) + 1;
      const postKey = postIndex;
      
      if (!commentsByPost[postKey]) {
        commentsByPost[postKey] = [];
      }
      
      if (commentsByPost[postKey].length < 5) { // Limit comments per post
        // Get a random user from the users data for the comment
        const randomUserIndex = Math.floor(Math.random() * usersData.users.length);
        const randomCommenter = usersData.users[randomUserIndex];
        
        commentsByPost[postKey].push({
          id: `comment-${comment.id}`,
          content: comment.body,
          author: {
            id: randomCommenter.id.toString(),
            name: `${randomCommenter.firstName} ${randomCommenter.lastName}`,
            username: randomCommenter.username,
            email: randomCommenter.email,
            avatar: randomCommenter.image
          },
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });

    // Transform posts with English content
    const transformedPosts: PostType[] = postsData.posts.map((post: any, index: number) => {
      // Get a random user for each post
      const randomUserIndex = Math.floor(Math.random() * usersData.users.length);
      const randomUser = usersData.users[randomUserIndex];
      
      return {
        id: `post-${post.id}`,
        content: post.body,
        author: {
          id: randomUser.id.toString(),
          name: `${randomUser.firstName} ${randomUser.lastName}`,
          username: randomUser.username,
          avatar: randomUser.image
        },
        likes: post.reactions?.likes || Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.7,
        shares: Math.floor(Math.random() * 50),
        isShared: false,
        comments: commentsByPost[index + 1] || [],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    });

    return transformedPosts;
  }

  async addComment(postId: string, content: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = await this.getCurrentUser();
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      content,
      author: currentUser,
      createdAt: new Date().toISOString()
    };

    // In a real app, this would be sent to your backend
    return { comment: newComment };
  }

  async getCurrentUser() {
    if (!this.currentUser) {
      await this.initializeCurrentUser();
    }
    return this.currentUser!;
  }

  async likePost(postId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }

  async sharePost(postId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
}

const graphqlService = new GraphQLService();

export default function FeedScreen() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Comment modal state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Initialize current user
  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await graphqlService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };
    initUser();
  }, []);

  // Fetch posts from DummyJSON via GraphQL-like service
  const fetchPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setRefreshing(true);
        setIsInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      console.log('Fetching posts, page:', pageNum);
      
      const newPosts = await graphqlService.fetchPosts(pageNum, 10);
      console.log('Received posts:', newPosts.length);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setIsInitialLoading(false);
    }
  };

  // Like post functionality with GraphQL-like service
  const handleLikePost = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.likes + (!post.isLiked ? 1 : -1)
            }
          : post
      )
    );

    try {
      await graphqlService.likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked, 
                likes: post.likes + (post.isLiked ? 1 : -1)
              }
            : post
        )
      );
    }
  };

  // Share post functionality
  const handleSharePost = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isShared: !post.isShared, 
              shares: (post.shares || 0) + (!post.isShared ? 1 : -1)
            }
          : post
      )
    );

    try {
      await graphqlService.sharePost(postId);
      const postUrl = `https://yourapp.com/post/${postId}`;
      await Clipboard.setStringAsync(postUrl);
      Alert.alert('Shared!', 'Post URL copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
      
      // Revert on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isShared: !post.isShared, 
                shares: (post.shares || 0) + (post.isShared ? 1 : -1)
              }
            : post
        )
      );
      
      Alert.alert('Error', 'Failed to share post. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!selectedPost || !commentText.trim() || !currentUser) return;

    setIsSubmittingComment(true);
    
    const tempCommentId = `temp-${Date.now()}-${Math.random()}`;
    
    // Create optimistic comment with current user data
    const optimisticComment: Comment = {
      id: tempCommentId,
      content: commentText.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments: [...post.comments, optimisticComment] }
          : post
      )
    );
    setSelectedPost(prev => prev ? {
      ...prev,
      comments: [...prev.comments, optimisticComment]
    } : null);

    try {
      const response = await graphqlService.addComment(selectedPost.id, commentText.trim());
      const realComment = response.comment;
      
      // Replace temp comment with real one
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === selectedPost.id 
            ? { 
                ...post, 
                comments: post.comments.map(c => 
                  c.id === tempCommentId ? realComment : c
                )
              }
            : post
        )
      );
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => 
          c.id === tempCommentId ? realComment : c
        )
      } : null);

      setCommentText('');
      Alert.alert('Success', 'Comment added successfully!');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      
      // Remove optimistic comment on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === selectedPost.id 
            ? { ...post, comments: post.comments.filter(c => c.id !== tempCommentId) }
            : post
        )
      );
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(c => c.id !== tempCommentId)
      } : null);
      
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Open comment modal
  const openCommentModal = (post: PostType) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  // Close comment modal
  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPost(null);
    setCommentText('');
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  const onRefresh = useCallback(async () => {
    setHasMore(true);
    await fetchPosts(1, false);
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchPosts(page + 1, true);
  }, [loadingMore, hasMore, page]);

  // Show loading only on initial load
  if (isInitialLoading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Current User Info Bar */}
      {currentUser && (
        <View style={styles.userInfoBar}>
          <Text style={styles.welcomeText}>
            Welcome, {currentUser.name} (@{currentUser.username})
          </Text>
        </View>
      )}

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCommentModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Comments ({selectedPost?.comments?.length || 0})
            </Text>
            <TouchableOpacity onPress={closeCommentModal}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <FlatList
            data={selectedPost?.comments || []}
            keyExtractor={(comment) => comment.id}
            renderItem={({ item: comment }) => (
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>
                    {comment.author?.name || 'Anonymous User'}
                  </Text>
                  <Text style={styles.commentUsername}>
                    @{comment.author?.username || 'unknown'}
                  </Text>
                  <Text style={styles.commentTime}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            )}
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <Text style={styles.emptyCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            }
          />

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            
            <View style={styles.modalFooter}>
              <Text style={styles.charCount}>
                {commentText.length}/500
              </Text>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!commentText.trim() || isSubmittingComment) && styles.submitButtonDisabled
                ]}
                onPress={handleAddComment}
                disabled={!commentText.trim() || isSubmittingComment}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <FlatList
        data={posts}
        renderItem={({ item }: { item: PostType }) => (
          <Post 
            post={item} 
            onLike={handleLikePost}
            onComment={openCommentModal}
            onShare={handleSharePost}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Fixed: Unique keys
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#5D0A85']}
            tintColor="#5D0A85"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <LoadingSpinner size="small" />
              <Text style={styles.footerText}>Loading more posts...</Text>
            </View>
          ) : !hasMore && posts.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>No more posts to load</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isInitialLoading && posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error ? 'Failed to load posts' : 'No posts available'}
              </Text>
              <TouchableOpacity onPress={() => fetchPosts(1)}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        contentContainerStyle={[
          styles.listContent,
          posts.length === 0 && styles.emptyListContent
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userInfoBar: {
    backgroundColor: '#5D0A85',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#5D0A85',
    fontSize: 16,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Comments list styles
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  commentUsername: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  emptyComments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyCommentsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  // Comment input styles
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  commentInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  charCount: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#5D0A85',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});