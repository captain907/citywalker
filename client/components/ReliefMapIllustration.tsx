import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface ReliefMapIllustrationProps extends ViewProps {
  size?: 'small' | 'medium' | 'large';
  showRoute?: boolean;
}

export default function ReliefMapIllustration({ 
  size = 'medium',
  showRoute = true,
  style,
  ...props 
}: ReliefMapIllustrationProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 80 };
      case 'large':
        return { width: 280, height: 180 };
      default:
        return { width: 200, height: 130 };
    }
  };

  const dimensions = getSize();

  return (
    <View style={[styles.container, dimensions, style]} {...props}>
      {/* 纸面基底 */}
      <View style={styles.paperBase} />
      
      {/* 河流 - 瓷蓝色浮雕 */}
      <View style={[styles.river, { width: dimensions.width * 0.12 }]} />
      <View style={[styles.riverBranch, { width: dimensions.width * 0.06 }]} />
      
      {/* 桥 */}
      <View style={[styles.bridge, { left: dimensions.width * 0.3 }]} />
      
      {/* 街区 - 浅浮雕块 */}
      <View style={[styles.block1, { left: dimensions.width * 0.05, top: dimensions.height * 0.1 }]} />
      <View style={[styles.block2, { left: dimensions.width * 0.18, top: dimensions.height * 0.15 }]} />
      <View style={[styles.block3, { left: dimensions.width * 0.45, top: dimensions.height * 0.08 }]} />
      <View style={[styles.block4, { left: dimensions.width * 0.55, top: dimensions.height * 0.25 }]} />
      <View style={[styles.block5, { left: dimensions.width * 0.7, top: dimensions.height * 0.12 }]} />
      
      {/* 建筑 - 小凸起 */}
      <View style={[styles.building1, { left: dimensions.width * 0.1, top: dimensions.height * 0.12 }]} />
      <View style={[styles.building2, { left: dimensions.width * 0.5, top: dimensions.height * 0.1 }]} />
      <View style={[styles.building3, { left: dimensions.width * 0.75, top: dimensions.height * 0.18 }]} />
      
      {/* 树木 */}
      <View style={[styles.tree1, { left: dimensions.width * 0.25, top: dimensions.height * 0.35 }]} />
      <View style={[styles.tree2, { left: dimensions.width * 0.6, top: dimensions.height * 0.45 }]} />
      
      {/* 路线虚线 */}
      {showRoute && (
        <>
          <View style={[styles.routeStart, { left: dimensions.width * 0.08, top: dimensions.height * 0.55 }]} />
          <View style={[styles.routeLine1, { left: dimensions.width * 0.1, top: dimensions.height * 0.58 }]} />
          <View style={[styles.routeDot1, { left: dimensions.width * 0.28, top: dimensions.height * 0.58 }]} />
          <View style={[styles.routeLine2, { left: dimensions.width * 0.3, top: dimensions.height * 0.5 }]} />
          <View style={[styles.routeDot2, { left: dimensions.width * 0.5, top: dimensions.height * 0.35 }]} />
          <View style={[styles.routeLine3, { left: dimensions.width * 0.52, top: dimensions.height * 0.35 }]} />
          <View style={[styles.routeEnd, { left: dimensions.width * 0.78, top: dimensions.height * 0.35 }]} />
        </>
      )}
      
      {/* 等高线装饰 */}
      <View style={[styles.contour1, { top: dimensions.height * 0.6 }]} />
      <View style={[styles.contour2, { top: dimensions.height * 0.75 }]} />
      
      {/* 边框压痕 */}
      <View style={styles.frameImpression} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#F4EFE4',
  },
  
  // 纸面基底
  paperBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F0DF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6D4B4',
  },
  
  // 河流
  river: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#AFC7C8',
    borderRadius: 8,
    left: '35%',
    borderWidth: 0.5,
    borderColor: '#8FAEB0',
    opacity: 0.8,
  },
  
  riverBranch: {
    position: 'absolute',
    height: '40%',
    backgroundColor: '#C5D8D6',
    borderRadius: 6,
    left: '45%',
    top: '50%',
    borderWidth: 0.5,
    borderColor: '#9FB8BA',
    transform: [{ rotate: '-30deg' }],
    opacity: 0.7,
  },
  
  // 桥
  bridge: {
    position: 'absolute',
    top: '45%',
    width: 40,
    height: 8,
    backgroundColor: '#B98A45',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#8A5A2B',
    zIndex: 5,
  },
  
  // 街区
  block1: {
    position: 'absolute',
    width: 45,
    height: 30,
    backgroundColor: '#EDE4D2',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D4C4A8',
  },
  
  block2: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: '#EFE2C8',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
  
  block3: {
    position: 'absolute',
    width: 50,
    height: 40,
    backgroundColor: '#E6D4B4',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#B9A484',
  },
  
  block4: {
    position: 'absolute',
    width: 40,
    height: 35,
    backgroundColor: '#EDE4D2',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D4C4A8',
  },
  
  block5: {
    position: 'absolute',
    width: 30,
    height: 45,
    backgroundColor: '#EFE2C8',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
  
  // 建筑
  building1: {
    position: 'absolute',
    width: 12,
    height: 18,
    backgroundColor: '#B98A45',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#8A5A2B',
    zIndex: 3,
  },
  
  building2: {
    position: 'absolute',
    width: 15,
    height: 22,
    backgroundColor: '#A85F3D',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#7A3F1D',
    zIndex: 3,
  },
  
  building3: {
    position: 'absolute',
    width: 10,
    height: 15,
    backgroundColor: '#C18F4E',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#915F1E',
    zIndex: 3,
  },
  
  // 树木
  tree1: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: '#6F8A63',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#4F6A43',
    zIndex: 2,
  },
  
  tree2: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#5F7A53',
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: '#3F5A33',
    zIndex: 2,
  },
  
  // 路线
  routeStart: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#B85A3C',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#883A1C',
    zIndex: 10,
  },
  
  routeLine1: {
    position: 'absolute',
    width: 60,
    height: 3,
    backgroundColor: '#B85A3C',
    borderRadius: 1.5,
    opacity: 0.7,
    zIndex: 4,
  },
  
  routeDot1: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#B98A45',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#895A15',
    zIndex: 10,
  },
  
  routeLine2: {
    position: 'absolute',
    width: 3,
    height: 70,
    backgroundColor: '#B98A45',
    borderRadius: 1.5,
    opacity: 0.7,
    zIndex: 4,
  },
  
  routeDot2: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#6F8A63',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3F5A33',
    zIndex: 10,
  },
  
  routeLine3: {
    position: 'absolute',
    width: 80,
    height: 3,
    backgroundColor: '#6F8A63',
    borderRadius: 1.5,
    opacity: 0.7,
    zIndex: 4,
  },
  
  routeEnd: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#6F8A63',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F5A33',
    zIndex: 10,
  },
  
  // 等高线
  contour1: {
    position: 'absolute',
    left: '10%',
    width: '80%',
    height: 1,
    backgroundColor: '#C4B498',
    borderRadius: 0.5,
    opacity: 0.4,
    transform: [{ rotate: '1deg' }],
  },
  
  contour2: {
    position: 'absolute',
    left: '5%',
    width: '90%',
    height: 0.8,
    backgroundColor: '#B4A488',
    borderRadius: 0.4,
    opacity: 0.3,
    transform: [{ rotate: '-0.5deg' }],
  },
  
  // 边框压痕
  frameImpression: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 90, 43, 0.15)',
    borderStyle: 'dashed',
  },
});
