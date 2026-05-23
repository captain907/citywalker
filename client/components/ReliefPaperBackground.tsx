import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface ReliefPaperBackgroundProps extends ViewProps {
  showMapTexture?: boolean;
}

export default function ReliefPaperBackground({ 
  children, 
  showMapTexture = true, 
  style,
  ...props 
}: ReliefPaperBackgroundProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {/* 纸张纹理层 */}
      <View style={styles.paperTexture} />
      
      {/* 微地图纹理（若隐若现） */}
      {showMapTexture && (
        <View style={styles.mapTextureOverlay}>
          {/* 等高线装饰 */}
          <View style={styles.contourLine1} />
          <View style={styles.contourLine2} />
          <View style={styles.contourLine3} />
          
          {/* 压痕装饰 */}
          <View style={styles.imprintDot1} />
          <View style={styles.imprintDot2} />
          <View style={styles.imprintDot3} />
          <View style={styles.imprintDot4} />
        </View>
      )}
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFE4',
    position: 'relative',
    overflow: 'hidden',
  },
  paperTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4EFE4',
    // 模拟纸张质感的细微变化
    opacity: 1,
  },
  mapTextureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
  },
  // 等高线装饰
  contourLine1: {
    position: 'absolute',
    top: '20%',
    left: '-10%',
    width: '120%',
    height: 2,
    backgroundColor: '#8A5A2B',
    borderRadius: 1,
    transform: [{ rotate: '-2deg' }],
  },
  contourLine2: {
    position: 'absolute',
    top: '45%',
    left: '-10%',
    width: '120%',
    height: 1,
    backgroundColor: '#8A5A2B',
    borderRadius: 0.5,
    transform: [{ rotate: '1.5deg' }],
  },
  contourLine3: {
    position: 'absolute',
    top: '70%',
    left: '-10%',
    width: '120%',
    height: 1.5,
    backgroundColor: '#8A5A2B',
    borderRadius: 1,
    transform: [{ rotate: '-0.5deg' }],
  },
  // 压痕装饰点
  imprintDot1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4C4A8',
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
  imprintDot2: {
    position: 'absolute',
    top: '55%',
    left: '8%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4C4A8',
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
  imprintDot3: {
    position: 'absolute',
    bottom: '25%',
    right: '15%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4C4A8',
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
  imprintDot4: {
    position: 'absolute',
    bottom: '10%',
    left: '20%',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D4C4A8',
    borderWidth: 0.5,
    borderColor: '#C4B498',
  },
});
