// app/components/Post.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMutation } from '@apollo/client/react';
import { Post as PostType } from '../types';
import ActionButton from './ActionButton';
import { Link } from 'expo-router';
import { LIKE_POST } from '../app/graphql/mutations';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const [likePost] = useMutation(LIKE_POST);

  const handleLike = async () => {
    try {
      await likePost({
        variables: { postId: post.id },
        optimisticResponse: {
          likePost: {
            __typename: 'Post',
            id: post.id,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          }
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
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
      <Link href={{ pathname: "/two", params: { id: post.id } }} asChild>
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
          onPress={handleLike}
          isActive={post.isLiked} label={''}        />
        
        <ActionButton
          icon="chatbubble-outline"
          count={post.comments.length}
          onPress={() => { } } label={''}        />
        
        <ActionButton
          icon="share-outline"
          onPress={() => Alert.alert('Share', 'Share functionality')} label={''}        />
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