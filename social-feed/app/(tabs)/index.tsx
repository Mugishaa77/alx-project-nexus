// app/(tabs)/index.tsx
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import FeedItem from '@/components/Feed/FeedItem';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { useMockPosts } from '@/hooks/useMockPosts';

export default function FeedScreen() {
  const { posts, loading, refetch } = useMockPosts();

  const handleRefresh = () => {
    refetch();
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Feed</Text>
      
      <FlatList
        data={posts}
        renderItem={({ item }) => <FeedItem post={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});