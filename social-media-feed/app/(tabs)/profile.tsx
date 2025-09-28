// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  username: 'alexdev',
  bio: 'React Native Developer | Building amazing mobile experiences 🚀',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop',
  postsCount: 24,
  followers: 1284,
  following: 563,
  joinedDate: 'January 2023',
  website: 'alexjohnson.dev',
  location: 'San Francisco, CA',
};

export default function ProfileScreen() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
    // In a real app, you'd navigate to an edit screen or show a modal
    Alert.alert('Edit Profile', 'Edit profile functionality would go here');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive' },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
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
        
        <View style={styles.details}>
          <Ionicons name="link-outline" size={16} color="#666" />
          <Text style={[styles.detailText, styles.link]}>{user.website}</Text>
        </View>
        
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
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Media</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Likes</Text>
        </TouchableOpacity>
      </View>

      {/* User's Posts Preview */}
      <View style={styles.postsPreview}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        <View style={styles.placeholderPost}>
          <Ionicons name="image-outline" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>No posts yet</Text>
          <Text style={styles.placeholderSubtext}>When you create posts, they'll appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  navItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D0A85',
  },
  postsPreview: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderPost: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});