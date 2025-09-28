// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch fake user data
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then((res) => res.json())
      .then((data) => {
        // Adapt API response to your UI fields
        setUser({
          id: data.id,
          name: data.name,
          username: data.username.toLowerCase(),
          bio: 'Mobile Developer | Building amazing apps 🚀',
          avatar: `https://i.pravatar.cc/150?u=${data.id}`, // fake avatar
          coverImage: 'https://picsum.photos/400/200', // fake cover
          postsCount: 12,
          followers: 234,
          following: 180,
          joinedDate: 'January 2024',
          website: data.website,
          location: data.address.city,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would go here');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive' },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5D0A85" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: user.coverImage }} style={styles.coverImage} />
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
          <Text style={styles.placeholderSubtext}>
            When you create posts, they'll appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Keep your styles the same...
const styles = StyleSheet.create({
  // 👇 same as your current styles
  container: { flex: 1, backgroundColor: '#fff' },
  coverContainer: { height: 150, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: -50, marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  statsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: 16 },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  userInfo: { paddingHorizontal: 16, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  username: { fontSize: 16, color: '#666', marginBottom: 12 },
  bio: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  details: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { marginLeft: 6, color: '#666', fontSize: 14 },
  link: { color: '#5D0A85' },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20, gap: 12 },
  editButton: { flex: 1, backgroundColor: '#5D0A85', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  settingsButton: { width: 50, backgroundColor: '#f0f0f0', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  profileNav: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  navItem: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  navText: { fontSize: 16, fontWeight: '600', color: '#5D0A85' },
  postsPreview: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  placeholderPost: { alignItems: 'center', padding: 40, backgroundColor: '#f8f8f8', borderRadius: 12 },
  placeholderText: { fontSize: 16, fontWeight: '600', color: '#666', marginTop: 12 },
  placeholderSubtext: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center' },
});
