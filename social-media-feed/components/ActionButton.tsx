// components/ActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string | number; // Allow both string and number
  onPress: () => void;
  isActive?: boolean;
  count?: number;
}

export default function ActionButton({ icon, label, onPress, isActive = false }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={isActive ? '#007AFF' : '#666'} 
      />
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label.toString()} {/* Ensure it's a string */}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  activeLabel: {
    color: '#007AFF',
  },
});