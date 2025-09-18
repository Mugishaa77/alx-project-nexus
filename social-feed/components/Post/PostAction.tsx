// components/Post/PostActions.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { Post } from '@/types';

interface PostActionsProps {
  post: Post;
  onCommentPress: () => void;
  onUpdatePost: (post: Post) => void;
}

export default function PostActions({ post, onCommentPress, onUpdatePost }: PostActionsProps) {
  const handleLike = () => {
    const updatedPost = {
      ...post,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      isLiked: !post.isLiked,
    };
    onUpdatePost(updatedPost);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLike}>
        <Text style={[styles.buttonText, post.isLiked && styles.liked]}>
          ❤️ {post.likes}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onCommentPress}>
        <Text style={styles.buttonText}>💬 {post.comments.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>↗ Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 14,
  },
  liked: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});