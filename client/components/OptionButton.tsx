import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
}

export default function OptionButton({ 
  label, 
  selected, 
  onPress, 
  icon 
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mr-2 mb-2"
    >
      <View 
        className={`px-5 py-3.5 rounded-xl flex-row items-center`}
        style={{ 
          backgroundColor: selected ? '#EFE2C8' : '#F7F0DF',
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? '#B98A45' : '#E6D4B4',
          shadowColor: '#4A3A2A',
          shadowOffset: { width: 0, height: selected ? 4 : 2 },
          shadowOpacity: selected ? 0.12 : 0.06,
          shadowRadius: selected ? 6 : 4,
          elevation: selected ? 3 : 1,
        }}
      >
        {icon && (
          <View 
            className="mr-2"
            style={{ 
              opacity: selected ? 1 : 0.5,
            }}
          >
            <FontAwesome6 
              name={icon} 
              size={16} 
              color={selected ? '#B98A45' : '#8A5A2B'} 
            />
          </View>
        )}
        <Text 
          className="font-medium"
          style={{ 
            color: selected ? '#B98A45' : '#6B563A',
            fontSize: 14,
          }}
        >
          {label}
        </Text>
        {selected && (
          <View 
            className="ml-2"
          >
            <FontAwesome6 name="check" size={14} color="#B98A45" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
