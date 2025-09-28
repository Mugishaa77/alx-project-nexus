import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  onPress: () => void;
  isActive?: boolean;
  label: string;
}

export default function ActionButton({ 
  icon, 
  count, 
  onPress, 
  isActive = false, 
  label 
}: ActionButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isActive ? '#5D0A85' : '#666'} 
        />
        <Text style={[
          styles.count, 
          isActive && styles.activeCount
        ]}>
          {count}
        </Text>
      </View>
      <Text style={[
        styles.label,
        isActive && styles.activeLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCount: {
    color: '#5D0A85',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeLabel: {
    color: '#5D0A85',
  },
});