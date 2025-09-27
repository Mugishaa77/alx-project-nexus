import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
// Update the import path to the correct location of the Post component
// Update the import path to the correct location of the Post component
// Update the import path to the correct location of the Post component
// Update the import path below to the correct location of the Post component
import Post from '../../components/Posts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Post as PostType } from '../../types';
import { getPosts } from '../services/api'; // Import the function directly

export default function FeedScreen() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the live API
  const fetchPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      const newPosts = await getPosts(pageNum, 10); // Use the imported function directly
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
      // Fallback to mock data if API fails
      if (pageNum === 1) {
        const mockPosts = await generateMockPosts(10);
        setPosts(mockPosts);
      }
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
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

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Show loading only on initial load
  if (posts.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {error && posts.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => fetchPosts(1)}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }: { item: PostType }) => (
            <Post post={item} />
          )}
          keyExtractor={(item) => `post-${item.id}`}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
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
            error && posts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts available</Text>
                <Text style={styles.retryText} onPress={() => fetchPosts(1)}>
                  Tap to retry
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={[
            styles.listContent,
            posts.length === 0 && styles.emptyListContent
          ]}
        />
      )}
    </View>
  );
}

// Fallback function for mock data (keep as backup)
const generateMockPosts = async (count: number): Promise<PostType[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    content: `This is a fallback post ${i + 1} since the API is not available.`,
    author: {
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      username: `user${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    comments: [],
    createdAt: new Date().toISOString()
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
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
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
  },
});