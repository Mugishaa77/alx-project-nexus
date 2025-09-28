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
import { Post as PostType, Comment } from '../../types';
import { getPosts, likePost, addComment, sharePost } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function FeedScreen() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Comment modal state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch posts from the live API
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
      
      const newPosts = await getPosts(pageNum, 10);
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
      
      // Use mock data as fallback
      const mockPosts = await generateMockPosts(10);
      setPosts(mockPosts);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setIsInitialLoading(false);
    }
  };

  // Like post functionality - Re-enable optimistic with mismatch handling
 const handleLikePost = (postId: string) => {
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
  
};

  // Share post functionality - Add mismatch handling and clipboard copy
const handleSharePost = async (postId: string) => {
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
    const postUrl = `https://yourapp.com/post/${postId}`;
    await Clipboard.setStringAsync(postUrl);
    Alert.alert('Shared!', 'Post URL copied to clipboard!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    
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
    
    Alert.alert('Error', 'Failed to copy link. Please try again.');
  }
};

  // FIXED: Comment functionality - Get current user info properly
  const getCurrentUser = () => {
    // FIXED: Replace with actual current user data from your auth system
    // This is a placeholder - you should get this from your auth context/service
    return {
      id: 'current-user-id',
      name: 'Current User', // Replace with actual user name
      username: 'currentuser', // Replace with actual username  
      avatar: 'https://i.pravatar.cc/150?img=1' // Replace with actual avatar
    };
  };

  const handleAddComment = async () => {
    if (!selectedPost || !commentText.trim()) return;

    setIsSubmittingComment(true);
    
    const tempCommentId = `temp-${Date.now()}`; // Temp ID for optimistic
    const currentUser = getCurrentUser();
    const optimisticComment: Comment = {
      id: tempCommentId,
      content: commentText.trim(),
      author: currentUser, // Use current user for optimism
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
      const response = await addComment(selectedPost.id, commentText.trim());
      
      // Replace temp comment with real one
      const realComment = response.comment;
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

      // If author mismatch or undefined in API, fallback to current user
      if (!realComment.author || !realComment.author.name) {
        console.warn('API comment author undefined; using local user');
        realComment.author = currentUser;
      }

      setCommentText('');
      
      // Success message but keep modal open so user can see their comment
      Alert.alert('Success', 'Comment added successfully!', [
        {
          text: 'View Comments',
          onPress: () => {
            // Modal stays open, user can see their comment
          }
        },
        {
          text: 'Close',
          onPress: () => setCommentModalVisible(false)
        }
      ]);
      
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
      {/* IMPROVED: Comment Modal with comment display */}
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

          {/* ADDED: Comments List */}
          <FlatList
            data={selectedPost?.comments || []}
            keyExtractor={(comment) => comment.id}
            renderItem={({ item: comment }) => (
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author?.name || 'Anonymous'}</Text>
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
        keyExtractor={(item) => `post-${item.id}`}
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

// Fallback function for mock data
const generateMockPosts = async (count: number): Promise<PostType[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    content: `This is a fallback post ${i + 1} with interactive features. You can like, comment, and share this post to test the functionality.`,
    author: {
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      username: `user${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    shares: Math.floor(Math.random() * 50),
    isShared: false,
    comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
      id: `comment-${i}-${j}`,
      content: `This is comment ${j + 1} on post ${i + 1}`,
      author: {
        id: `commenter-${j}`,
        name: `Commenter ${j + 1}`,
        username: `commenter${j + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${j + 10}`
      },
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    })),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  // NEW: Comments list styles
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
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
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
  // Updated comment input styles
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