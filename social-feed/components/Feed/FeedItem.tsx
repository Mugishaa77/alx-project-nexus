// components/Feed/FeedItem.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '@/components/Themed';
// Update the import path below to the correct location of PostActions
import PostActions from '../Post/PostAction';
import { Post } from '@/types';

interface FeedItemProps {
  post: Post;
}

export default function FeedItem({ post }: FeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <Image source={{ uri: currentPost.author.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{currentPost.author.name}</Text>
          <Text style={styles.timestamp}>{currentPost.createdAt}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.content}>{currentPost.content}</Text>
      
      {/* Post Image (if exists) */}
      {currentPost.image && (
        <Image 
          source={{ uri: currentPost.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Post Actions */}
      <PostActions 
        post={currentPost}
        onCommentPress={() => setIsExpanded(!isExpanded)}
        onUpdatePost={(updatedPost) => setCurrentPost(updatedPost)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
});