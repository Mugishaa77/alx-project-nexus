// components/UI/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Loading posts...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default LoadingSpinner;