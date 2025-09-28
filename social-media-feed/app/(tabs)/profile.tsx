// app/(tabs)/profile.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const { width } = Dimensions.get('window');

// GraphQL Client Setup (Mock implementation)
class GraphQLClient {
  private baseUrl = 'https://jsonplaceholder.typicode.com'; // Mock API
  
  async query(query: string, variables?: any): Promise<any> {
    // Simulate GraphQL query delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock GraphQL responses based on query type
    if (query.includes('getUserProfile')) {
      return this.getUserProfile();
    } else if (query.includes('getUserPosts')) {
      return this.getUserPosts(variables?.offset || 0, variables?.limit || 10);
    } else if (query.includes('likePost')) {
      return this.likePost(variables?.postId);
    } else if (query.includes('addComment')) {
      return this.addComment(variables?.postId, variables?.comment);
    } else if (query.includes('getComments')) {
      return this.getComments(variables?.postId);
    }
    
    throw new Error('Unknown query');
  }
  
  private async getUserProfile() {
    return {
      data: {
        user: {
          id: '1',
          name: 'Sally Wanga',
          username: 'mugisha',
          bio: 'React Native Developer | Building amazing mobile experiences 🚀',
          avatar: 'profilePic',
          coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop',
          postsCount: 24,
          followers: 1284,
          following: 563,
          joinedDate: 'January 2023',
          website: 'mugisha.dev',
          location: 'Nairobi, Kenya',
        }
      }
    };
  }
  
  private async getUserPosts(offset: number, limit: number) {
    const allPosts = [
      {
        id: '1',
        content: 'Just launched my new React Native app! 🚀',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
        likes: 42,
        comments: 8,
        timestamp: '2h ago',
        isLiked: false,
      },
      {
        id: '2',
        content: 'Beautiful sunset from my morning walk ☀️',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
        likes: 128,
        comments: 15,
        timestamp: '1d ago',
        isLiked: true,
      },
      {
        id: '3',
        content: 'Working on some exciting new features. Stay tuned! 💻',
        likes: 89,
        comments: 23,
        timestamp: '3d ago',
        isLiked: false,
      },
      {
        id: '4',
        content: 'Amazing conference today! Learned so much about React Native performance optimization 📚',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
        likes: 156,
        comments: 32,
        timestamp: '5d ago',
        isLiked: true,
      },
      {
        id: '5',
        content: 'Coffee and code - perfect Sunday morning ☕',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
        likes: 67,
        comments: 12,
        timestamp: '1w ago',
        isLiked: false,
      },
      // Add more mock posts for pagination
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `${6 + i}`,
        content: `Mock post content ${6 + i}. This is a sample post for testing pagination and infinite scrolling functionality.`,
        image: i % 3 === 0 ? `https://images.unsplash.com/photo-${1500000000000 + i}?w=300&h=200&fit=crop` : undefined,
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        timestamp: `${Math.floor(Math.random() * 30)}d ago`,
        isLiked: Math.random() > 0.5,
      }))
    ];
    
    const posts = allPosts.slice(offset, offset + limit);
    
    return {
      data: {
        posts: posts,
        hasMore: offset + limit < allPosts.length,
        total: allPosts.length
      }
    };
  }
  
  private async likePost(postId: string) {
    return {
      data: {
        likePost: {
          id: postId,
          likes: Math.floor(Math.random() * 200) + 50,
          isLiked: true,
        }
      }
    };
  }
  
  private async addComment(postId: string, comment: string) {
    return {
      data: {
        addComment: {
          id: Date.now().toString(),
          content: comment,
          author: 'You',
          timestamp: 'now',
        }
      }
    };
  }
  
  private async getComments(postId: string) {
    const mockComments = [
      {
        id: '1',
        content: 'Amazing work! Keep it up 👏',
        author: 'Sarah Miller',
        timestamp: '1h ago',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face'
      },
      {
        id: '2',
        content: 'This looks fantastic! Can\'t wait to try it out.',
        author: 'Mike Chen',
        timestamp: '3h ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
    ];
    
    return {
      data: {
        comments: mockComments
      }
    };
  }
}

// GraphQL Queries
const QUERIES = {
  GET_USER_PROFILE: `
    query getUserProfile($userId: ID!) {
      user(id: $userId) {
        id
        name
        username
        bio
        avatar
        coverImage
        postsCount
        followers
        following
        joinedDate
        website
        location
      }
    }
  `,
  
  GET_USER_POSTS: `
    query getUserPosts($userId: ID!, $offset: Int, $limit: Int) {
      posts(userId: $userId, offset: $offset, limit: $limit) {
        id
        content
        image
        likes
        comments
        timestamp
        isLiked
      }
      hasMore
      total
    }
  `,
  
  LIKE_POST: `
    mutation likePost($postId: ID!) {
      likePost(postId: $postId) {
        id
        likes
        isLiked
      }
    }
  `,
  
  ADD_COMMENT: `
    mutation addComment($postId: ID!, $comment: String!) {
      addComment(postId: $postId, comment: $comment) {
        id
        content
        author
        timestamp
      }
    }
  `,
  
  GET_COMMENTS: `
    query getComments($postId: ID!) {
      comments(postId: $postId) {
        id
        content
        author
        timestamp
        avatar
      }
    }
  `
};

interface Post {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  postsCount: number;
  followers: number;
  following: number;
  joinedDate: string;
  website: string;
  location: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  avatar?: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [followersModal, setFollowersModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const client = new GraphQLClient();
  const currentOffset = useRef(0);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const userResponse = await client.query(QUERIES.GET_USER_PROFILE, { userId: '1' });
      setUser(userResponse.data.user);
      setEditedUser(userResponse.data.user);
      
      // Load initial posts
      const postsResponse = await client.query(QUERIES.GET_USER_POSTS, { 
        userId: '1', 
        offset: 0, 
        limit: 10 
      });
      
      setPosts(postsResponse.data.posts);
      setHasMore(postsResponse.data.hasMore);
      currentOffset.current = 10;
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const response = await client.query(QUERIES.GET_USER_POSTS, {
        userId: '1',
        offset: currentOffset.current,
        limit: 10
      });
      
      setPosts(prev => [...prev, ...response.data.posts]);
      setHasMore(response.data.hasMore);
      currentOffset.current += 10;
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load more posts');
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    currentOffset.current = 0;
    try {
      const response = await client.query(QUERIES.GET_USER_POSTS, {
        userId: '1',
        offset: 0,
        limit: 10
      });
      
      setPosts(response.data.posts);
      setHasMore(response.data.hasMore);
      currentOffset.current = 10;
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh posts');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    console.log('Like pressed for post:', postId); // Debug log
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));

      // API call
      const response = await client.query(QUERIES.LIKE_POST, { postId });
      
      // Update with server response
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: response.data.likePost.likes, isLiked: response.data.likePost.isLiked }
          : post
      ));
      
    } catch (error) {
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes + 1 : post.likes - 1
            }
          : post
      ));
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleSharePost = async (post: Post) => {
    try {
      const message = `Check out this post by ${user?.name}:\n\n${post.content}`;
      await Share.share({
        message,
        title: 'Shared Post',
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const openCommentsModal = async (post: Post) => {
    setSelectedPost(post);
    setCommentsModal(true);
    
    try {
      const response = await client.query(QUERIES.GET_COMMENTS, { postId: post.id });
      setComments(response.data.comments);
    } catch (error) {
      Alert.alert('Error', 'Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    
    try {
      setCommentLoading(true);
      const response = await client.query(QUERIES.ADD_COMMENT, {
        postId: selectedPost.id,
        comment: newComment.trim()
      });
      
      setComments(prev => [response.data.addComment, ...prev]);
      setNewComment('');
      
      // Update comments count
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (user) {
      setEditedUser(user);
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = () => {
    if (editedUser) {
      setUser(editedUser);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          Alert.alert('Logged out', 'You have been logged out successfully');
        }
      },
    ]);
  };

 const renderPost = ({ item: post }: { item: Post; index: number }) => (
  <View style={styles.postCard}>
    <Text style={styles.postContent}>{post.content}</Text>
    {post.image && (
      <Image source={{ uri: post.image }} style={styles.postImage} />
    )}
    <View style={styles.postActions}>
      <TouchableOpacity 
        style={styles.postAction}
        onPress={() => handleLikePost(post.id)}
      >
        <Ionicons 
          name={post.isLiked ? "heart" : "heart-outline"} 
          size={20} 
          color={post.isLiked ? "#ff3040" : "#666"} 
        />
        <Text style={[styles.actionText, post.isLiked && { color: '#ff3040' }]}>
          {post.likes}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.postAction}
        onPress={() => openCommentsModal(post)}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#666" />
        <Text style={styles.actionText}>{post.comments}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.postAction}
        onPress={() => handleSharePost(post)}
      >
        <Ionicons name="share-outline" size={20} color="#666" />
      </TouchableOpacity>
      
      <Text style={styles.timestamp}>{post.timestamp}</Text>
    </View>
  </View>
);
  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#5D0A85" />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D0A85" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'posts':
        return posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.postsContainer}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderLoadingFooter}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>When you create posts, they'll appear here</Text>
          </View>
        );
      
      case 'media':
        const mediaPosts = posts.filter(post => post.image);
        return mediaPosts.length > 0 ? (
          <ScrollView style={styles.mediaGrid}>
            <View style={styles.mediaRow}>
              {mediaPosts.map((post) => (
                <TouchableOpacity key={post.id} style={styles.mediaItem}>
                  <Image source={{ uri: post.image }} style={styles.mediaImage} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No media posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Photos and videos will appear here</Text>
          </View>
        );
      
      case 'likes':
        return (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No liked posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Posts you like will appear here</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  // Animated header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5D0A85" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>{user.name}</Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: user.coverImage }} 
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.stat}>
              <Text style={styles.statNumber}>{user.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.stat}
              onPress={() => setFollowersModal(true)}
            >
              <Text style={styles.statNumber}>{user.followers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.stat}
              onPress={() => setFollowersModal(true)}
            >
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          
          <View style={styles.details}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{user.location}</Text>
          </View>
          
          <TouchableOpacity style={styles.details}>
            <Ionicons name="link-outline" size={16} color="#666" />
            <Text style={[styles.detailText, styles.link]}>{user.website}</Text>
          </TouchableOpacity>
          
          <View style={styles.details}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Joined {user.joinedDate}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Profile Navigation */}
        <View style={styles.profileNav}>
          {['posts', 'media', 'likes'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.navItem, activeTab === tab && styles.activeNavItem]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </Animated.ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Name</Text>
              <TextInput
                style={styles.editInput}
                value={editedUser?.name || ''}
                onChangeText={(text) => setEditedUser(prev => prev ? {...prev, name: text} : null)}
                placeholder="Your name"
              />
            </View>
            
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Username</Text>
              <TextInput
                style={styles.editInput}
                value={editedUser?.username || ''}
                onChangeText={(text) => setEditedUser(prev => prev ? {...prev, username: text} : null)}
                placeholder="Username"
              />
            </View>
            
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Bio</Text>
              <TextInput
                style={[styles.editInput, styles.bioInput]}
                value={editedUser?.bio || ''}
                onChangeText={(text) => setEditedUser(prev => prev ? {...prev, bio: text} : null)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Location</Text>
              <TextInput
                style={styles.editInput}
                value={editedUser?.location || ''}
                onChangeText={(text) => setEditedUser(prev => prev ? {...prev, location: text} : null)}
                placeholder="Your location"
              />
            </View>
            
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Website</Text>
              <TextInput
                style={styles.editInput}
                value={editedUser?.website || ''}
                onChangeText={(text) => setEditedUser(prev => prev ? {...prev, website: text} : null)}
                placeholder="Your website"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={commentsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCommentsModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.commentsContainer}>
            <ScrollView style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: comment.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                multiline
                maxLength={280}
              />
              <TouchableOpacity 
                style={[styles.commentButton, { opacity: newComment.trim() ? 1 : 0.5 }]}
                onPress={handleAddComment}
                disabled={!newComment.trim() || commentLoading}
              >
                {commentLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Followers Modal */}
      <Modal
        visible={followersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFollowersModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Followers</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>Followers list</Text>
            <Text style={styles.emptyStateSubtext}>This would show your followers</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingTop: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 150,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: -50,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  stat: {
    alignItems: 'center',
    padding: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  userInfo: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#5D0A85',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5D0A85',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    width: 50,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeNavItem: {
    borderBottomColor: '#5D0A85',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeNavText: {
    color: '#5D0A85',
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  actionText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    marginLeft: 'auto',
    color: '#999',
    fontSize: 12,
  },
  mediaGrid: {
    flex: 1,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  mediaItem: {
    width: (width - 8) / 3,
    height: (width - 8) / 3,
    padding: 2,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
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
    paddingTop: 50,
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSave: {
    fontSize: 16,
    color: '#5D0A85',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  editField: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  placeholder: {
    width: 50,
  },
  commentsContainer: {
    flex: 1,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  commentTimestamp: {
    color: '#999',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#f9f9f9',
  },
  commentButton: {
    backgroundColor: '#5D0A85',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});