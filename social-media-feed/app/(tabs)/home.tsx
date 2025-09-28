// app/(tabs)/home.tsx
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

// GraphQL Client Setup with DummyJSON integration (similar to index.tsx)
class GraphQLClient {
  private currentUser: any = null;
  private posts: any[] = [];
  private users: any[] = [];

  async query(query: string, variables?: any): Promise<any> {
    // Simulate GraphQL query delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
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
    try {
      // Get a specific user from DummyJSON as the profile user
      const response = await fetch('https://dummyjson.com/users/1');
      const userData = await response.json();
      
      return {
        data: {
          user: {
            id: userData.id.toString(),
            name: 'Sally Wanga',
            username: 'mugisha',
            bio: 'Frontend Developer | Building amazing experiences with technology',
            avatar: userData.image,
            coverImage: `https://picsum.photos/400/200?random=${userData.id}`,
            postsCount: Math.floor(Math.random() * 200) + 50,
            followers: Math.floor(Math.random() * 5000) + 1000,
            following: Math.floor(Math.random() * 1000) + 200,
            joinedDate: 'January 2023',
            website: 'mugisha.dev',
            location: 'Nairobi, Kenya',
          }
        }
      };
    } catch (error) {
      // Fallback data if API fails
      return {
        data: {
          user: {
            id: '1',
            name: 'Sally Wanga',
            username: 'mugisha',
            bio: 'React Native Developer | Building amazing mobile experiences',
            avatar: 'https://i.pravatar.cc/150?img=1',
            coverImage: 'https://picsum.photos/400/200?random=1',
            postsCount: 100,
            followers: 1284,
            following: 563,
            joinedDate: 'January 2023',
            website: 'mugisha.dev',
            location: 'Nairobi, Kenya',
          }
        }
      };
    }
  }
  
  private async getUserPosts(offset: number, limit: number) {
    try {
      // Calculate skip for pagination
      const skip = offset;
      
      // Fetch posts and users from DummyJSON
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`),
        fetch('https://dummyjson.com/users?limit=30')
      ]);

      const [postsData, usersData] = await Promise.all([
        postsResponse.json(),
        usersResponse.json()
      ]);

      // Transform posts with English content and reliable images
      const enhancedPosts = postsData.posts.map((post: any, index: number) => {
        const hasImage = Math.random() > 0.4; // 60% chance of having an image
        const randomUserIndex = Math.floor(Math.random() * usersData.users.length);
        const randomUser = usersData.users[randomUserIndex];
        
        return {
          id: `post_${post.id}_${offset}`, // Unique ID with offset
          content: post.body, // DummyJSON already has good English content
          image: hasImage ? `https://picsum.photos/400/300?random=${post.id + offset}` : undefined,
          likes: post.reactions?.likes || Math.floor(Math.random() * 200) + 10,
          comments: Math.floor(Math.random() * 50) + 1,
          timestamp: this.getRandomTimestamp(),
          isLiked: Math.random() > 0.7,
          type: hasImage ? 'media' : 'text',
          userId: post.userId,
          author: {
            id: randomUser.id.toString(),
            name: `${randomUser.firstName} ${randomUser.lastName}`,
            username: randomUser.username,
            avatar: randomUser.image
          }
        };
      });
      
      return {
        data: {
          posts: enhancedPosts,
          hasMore: postsData.posts.length === limit, // If we got the full limit, there might be more
          total: 150 // DummyJSON has 150 posts
        }
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        data: {
          posts: [],
          hasMore: false,
          total: 0
        }
      };
    }
  }
  
  private getRandomTimestamp(): string {
    const timestamps = [
      'just now', '5m ago', '15m ago', '1h ago', '2h ago', '5h ago',
      '1d ago', '2d ago', '3d ago', '5d ago', '1w ago', '2w ago', '1mo ago'
    ];
    return timestamps[Math.floor(Math.random() * timestamps.length)];
  }
  
  private async likePost(postId: string) {
    return {
      data: {
        likePost: {
          id: postId,
          success: true,
        }
      }
    };
  }
  
  private async addComment(postId: string, comment: string) {
    return {
      data: {
        addComment: {
          id: `comment_${Date.now()}_${Math.random()}`, // More unique ID
          content: comment,
          author: 'You',
          timestamp: 'now',
        }
      }
    };
  }
  
  private async getComments(postId: string) {
    try {
      // Fetch real comments and users from DummyJSON
      const [commentsResponse, usersResponse] = await Promise.all([
        fetch(`https://dummyjson.com/comments?limit=5`),
        fetch(`https://dummyjson.com/users?limit=10`)
      ]);
      
      const [commentsData, usersData] = await Promise.all([
        commentsResponse.json(),
        usersResponse.json()
      ]);
      
      const enhancedComments = commentsData.comments.map((comment: any, index: number) => {
        const randomUser = usersData.users[index % usersData.users.length];
        
        return {
          id: `comment_${comment.id}_${postId}`, // Unique ID with post context
          content: comment.body, // DummyJSON comments are in English
          author: `${randomUser.firstName} ${randomUser.lastName}`,
          timestamp: this.getRandomTimestamp(),
          avatar: randomUser.image
        };
      });
      
      return {
        data: {
          comments: enhancedComments
        }
      };
    } catch (error) {
      return {
        data: {
          comments: []
        }
      };
    }
  }
}

// GraphQL Queries (unchanged)
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
        type
      }
      hasMore
      total
    }
  `,
  
  LIKE_POST: `
    mutation likePost($postId: ID!) {
      likePost(postId: $postId) {
        id
        success
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
  type: 'media' | 'text';
  userId?: number;
  author?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
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
    if (loadingMore || !hasMore || activeTab !== 'posts') return;
    
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
    console.log('Like pressed for post:', postId);
    
    // Optimistic update - update UI immediately
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));

    try {
      await client.query(QUERIES.LIKE_POST, { postId });
      console.log('Like request sent successfully');
    } catch (error) {
      console.error('Error liking post:', error);
      
      // Revert the optimistic update if server request failed
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));
      
      Alert.alert('Error', 'Failed to like post. Please try again.');
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

  // Enhanced filtering logic for more distinct media posts
  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'posts':
        return posts; // Show all posts
      case 'media':
        // Only show posts that have images (photos)
        return posts.filter(post => post.type === 'media' && post.image);
      case 'likes':
        return posts.filter(post => post.isLiked);
      default:
        return posts;
    }
  };

  const renderPost = ({ item: post, index }: { item: Post; index: number }) => (
    <View style={styles.postCard}>
      <Text style={styles.postContent}>{post.content}</Text>
      {post.image && (
        <TouchableOpacity onPress={() => {/* Handle image view */}}>
          <Image 
            source={{ uri: post.image }} 
            style={styles.postImage}
            onError={(error) => {
              console.log('Image failed to load:', error.nativeEvent.error);
            }}
          />
          {activeTab === 'media' && (
            <View style={styles.mediaBadge}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
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

  const renderHeader = () => (
    <>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: user?.coverImage }} 
          style={styles.coverImage}
          onError={(error) => {
            console.log('Cover image failed to load:', error.nativeEvent.error);
          }}
        />
        <View style={styles.coverOverlay} />
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity>
          <Image 
            source={{ uri: user?.avatar }} 
            style={styles.avatar}
            onError={(error) => {
              console.log('Avatar failed to load:', error.nativeEvent.error);
            }}
          />
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.stat}>
            <Text style={styles.statNumber}>{user?.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.stat}
            onPress={() => setFollowersModal(true)}
          >
            <Text style={styles.statNumber}>{user?.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.stat}
            onPress={() => setFollowersModal(true)}
          >
            <Text style={styles.statNumber}>{user?.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.bio}>{user?.bio}</Text>
        
        <View style={styles.details}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{user?.location}</Text>
        </View>
        
        <TouchableOpacity style={styles.details}>
          <Ionicons name="link-outline" size={16} color="#666" />
          <Text style={[styles.detailText, styles.link]}>{user?.website}</Text>
        </TouchableOpacity>
        
        <View style={styles.details}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Joined {user?.joinedDate}</Text>
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
            <Ionicons 
              name={
                tab === 'posts' ? 'grid-outline' : 
                tab === 'media' ? 'camera-outline' : 
                'heart-outline'
              } 
              size={18} 
              color={activeTab === tab ? '#5D0A85' : '#666'}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderEmptyState = () => {
    let emptyMessage = 'No posts yet';
    let emptySubtext = 'When you create posts, they\'ll appear here';
    let iconName = 'document-text-outline';
    
    if (activeTab === 'media') {
      emptyMessage = 'No photos';
      emptySubtext = 'Posts with photos will appear here';
      iconName = 'camera-outline';
    } else if (activeTab === 'likes') {
      emptyMessage = 'No liked posts';
      emptySubtext = 'Posts you like will appear here';
      iconName = 'heart-outline';
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons 
          name={iconName as any} 
          size={48} 
          color="#ccc" 
        />
        <Text style={styles.emptyStateText}>{emptyMessage}</Text>
        <Text style={styles.emptyStateSubtext}>{emptySubtext}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#5D0A85" />
          <Text style={styles.loadingText}>Loading more posts...</Text>
        </View>
      );
    }
    return null;
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

  const filteredPosts = getFilteredPosts();

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>{user.name}</Text>
      </Animated.View>

      {/* Enhanced FlatList with better infinite scrolling */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item, index) => `${activeTab}-${item.id}-${index}`} // Fixed: More unique keys
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.3}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={undefined} // Remove fixed height for dynamic content
      />

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
                    source={{ uri: comment.avatar || 'https://i.pravatar.cc/40?img=1' }}
                    style={styles.commentAvatar}
                    onError={(error) => {
                      console.log('Comment avatar failed to load:', error.nativeEvent.error);
                    }}
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
  flatListContent: {
    flexGrow: 1,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeNavText: {
    color: '#5D0A85',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
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
    position: 'relative',
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
  mediaBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(93, 10, 133, 0.8)',
    padding: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
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