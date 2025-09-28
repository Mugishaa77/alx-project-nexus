// app/components/Post.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Post as PostType } from '../types';
import ActionButton from './ActionButton';
import { Link } from 'expo-router';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (post: PostType) => void;
  onShare: (postId: string) => void;
}

export default function Post({ post, onLike, onComment, onShare }: PostProps) {
  const handleLikePress = () => {
    console.log('❤️ Post Component: Like pressed for post:', post.id);
    console.log('❤️ Post Component: onLike function:', typeof onLike);
    onLike(post.id);
  };

  const handleCommentPress = () => {
    console.log('💬 Post Component: Comment pressed for post:', post.id);
    console.log('💬 Post Component: onComment function:', typeof onComment);
    onComment(post);
  };

  const handleSharePress = () => {
    console.log('🔄 Post Component: Share pressed for post:', post.id);
    console.log('🔄 Post Component: onShare function:', typeof onShare);
    onShare(post.id);
  };

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.author.name}</Text>
          <Text style={styles.username}>@{post.author.username}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Link href={{ pathname: "/profile", params: { id: post.id } }} asChild>
        <TouchableOpacity>
          <Text style={styles.content}>{post.content}</Text>
          {post.imageUrl && (
            <Image 
              source={{ uri: post.imageUrl }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      </Link>

      {/* Post Actions */}
      <View style={styles.actions}>
        <ActionButton
          icon={post.isLiked ? "heart" : "heart-outline"}
          count={post.likes}
          onPress={handleLikePress}
          isActive={post.isLiked}
          label="Like"
        />
        
        <ActionButton
          icon="chatbubble-outline"
          count={post.comments.length}
          onPress={handleCommentPress}
          label="Comment"
        />
        
        <ActionButton
          icon={post.isShared ? "share-social" : "share-outline"}
          count={post.shares || 0}
          onPress={handleSharePress}
          isActive={post.isShared}
          label="Share"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
});