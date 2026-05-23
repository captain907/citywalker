import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface ReliefContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'inset' | 'outset' | 'paper';
  pressed?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ReliefContainer({ 
  children, 
  variant = 'default',
  pressed = false,
  onPress,
  style 
}: ReliefContainerProps) {
  const isPressable = onPress !== undefined;
  
  const containerStyle = [
    styles.base,
    styles[variant],
    pressed && styles.pressed,
    style
  ];

  if (isPressable) {
    return (
      <TouchableOpacity 
        style={containerStyle} 
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  default: {
    backgroundColor: '#F7F0DF',
    borderWidth: 1,
    borderColor: '#E0D4B8',
  },
  inset: {
    backgroundColor: '#EDE4D2',
    borderWidth: 1,
    borderColor: '#D4C4A8',
  },
  outset: {
    backgroundColor: '#F7F0DF',
    borderWidth: 1,
    borderColor: '#E0D4B8',
  },
  paper: {
    backgroundColor: '#F4EFE4',
    borderWidth: 1,
    borderColor: '#E4D8C0',
  },
  pressed: {
    backgroundColor: '#EDE4D2',
  },
});
