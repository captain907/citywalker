import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ArchiveCardProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  unlocked: boolean;
  count?: number;
  total?: number;
  onPress?: () => void;
  size?: 'small' | 'medium';
}

export default function ArchiveCard({
  title,
  icon,
  unlocked,
  count,
  total,
  onPress,
  size = 'medium',
  ...props
}: ArchiveCardProps) {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 120 };
      default:
        return { width: 140, height: 160 };
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[styles.container, getSizeStyle(), !unlocked && styles.locked]} 
      activeOpacity={0.9}
      onPress={onPress}
      {...props}
    >
      {/* 浮雕边框层 */}
      <View style={[styles.borderLayer, !unlocked && styles.lockedBorder]} />
      
      {/* 高光层 */}
      <View style={styles.highlightLayer} />
      
      {/* 内容层 */}
      <View style={styles.contentLayer}>
        {/* 图鉴微缩图案区域 */}
        <View style={[styles.illustrationArea, !unlocked && styles.lockedIllustration]}>
          {/* 装饰性浮雕图案 */}
          {unlocked ? (
            <>
              <View style={styles.decoBlock1} />
              <View style={styles.decoBlock2} />
              <View style={styles.decoDot1} />
              <View style={styles.decoDot2} />
              <View style={styles.decoLine} />
            </>
          ) : (
            <View style={styles.lockPattern} />
          )}
        </View>
        
        {/* 标题区域 */}
        <View style={styles.titleArea}>
          <Text style={[styles.title, !unlocked && styles.lockedText]} numberOfLines={2}>
            {title}
          </Text>
          
          {/* 进度/数量 */}
          {(count !== undefined && total !== undefined) && (
            <View style={styles.progressRow}>
              <View style={styles.progressDots}>
                {[...Array(Math.min(total, 5))].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.progressDot, 
                      i < count ? styles.progressDotFilled : styles.progressDotEmpty
                    ]} 
                  />
                ))}
              </View>
              <Text style={[styles.progressText, !unlocked && styles.lockedText]}>
                {count}/{total}
              </Text>
            </View>
          )}
          
          {/* 解锁状态标记 */}
          {!unlocked && (
            <View style={styles.lockBadge}>
              <Text style={styles.lockText}>未解锁</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 印章式装饰 */}
      {unlocked && (
        <View style={styles.sealStamp}>
          <Text style={styles.sealText}>藏</Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F7F0DF',
  },
  
  locked: {
    backgroundColor: '#EDE4D2',
    opacity: 0.7,
  },
  
  // 浮雕边框
  borderLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C4B498',
    zIndex: 1,
  },
  
  lockedBorder: {
    borderColor: '#B4A488',
    borderStyle: 'dashed',
  },
  
  // 高光层
  highlightLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '60%',
    bottom: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 16,
    zIndex: 2,
  },
  
  // 内容层
  contentLayer: {
    position: 'relative',
    zIndex: 3,
    padding: 12,
    height: '100%',
  },
  
  // 图鉴微缩图案区域
  illustrationArea: {
    flex: 1,
    backgroundColor: '#EFE2C8',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4C4A8',
    position: 'relative',
    overflow: 'hidden',
  },
  
  lockedIllustration: {
    backgroundColor: '#E0D4C2',
  },
  
  // 装饰性图案
  decoBlock1: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 25,
    height: 18,
    backgroundColor: '#B98A45',
    borderRadius: 3,
    opacity: 0.6,
  },
  
  decoBlock2: {
    position: 'absolute',
    top: 25,
    right: 20,
    width: 20,
    height: 22,
    backgroundColor: '#6F8A63',
    borderRadius: 4,
    opacity: 0.5,
  },
  
  decoDot1: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    width: 8,
    height: 8,
    backgroundColor: '#AFC7C8',
    borderRadius: 4,
  },
  
  decoDot2: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    width: 6,
    height: 6,
    backgroundColor: '#B85A3C',
    borderRadius: 3,
  },
  
  decoLine: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    height: 1.5,
    backgroundColor: '#C4B498',
    borderRadius: 1,
    opacity: 0.4,
  },
  
  // 锁定图案
  lockPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 标题区域
  titleArea: {
    alignItems: 'center',
  },
  
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A3A2A',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  
  lockedText: {
    color: '#8A7A6A',
  },
  
  // 进度行
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  
  progressDots: {
    flexDirection: 'row',
    gap: 3,
  },
  
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  
  progressDotFilled: {
    backgroundColor: '#B98A45',
  },
  
  progressDotEmpty: {
    backgroundColor: '#D4C4A8',
  },
  
  progressText: {
    fontSize: 10,
    color: '#6B563A',
    fontWeight: '500',
  },
  
  // 锁定徽章
  lockBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#E0D4C2',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#B4A488',
  },
  
  lockText: {
    fontSize: 9,
    color: '#8A7A6A',
    fontWeight: '500',
  },
  
  // 印章装饰
  sealStamp: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(184, 90, 60, 0.15)',
    borderWidth: 1.5,
    borderColor: '#B85A3C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ rotate: '-15deg' }],
  },
  
  sealText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B85A3C',
    fontFamily: 'serif',
  },
});
