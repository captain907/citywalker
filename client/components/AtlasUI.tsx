import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { atlasAssets } from '@/assets/atlasAssets';

type AtlasIconName = React.ComponentProps<typeof FontAwesome6>['name'];
type PanelVariant = 'paper' | 'raised' | 'sunken' | 'ticket';
type TagVariant = 'default' | 'selected';
type MapVariant = 'home' | 'quest' | 'route' | 'complete' | 'profile' | 'mini';
type MiniatureVariant = 'memory' | 'food' | 'landmark' | 'vibe';
type AtlasImageSource = any;

export const atlasColors = {
  paper: '#E8DED2',
  paperAlt: '#EEE6DB',
  paperDeep: '#DDD0C0',
  edge: '#E1D4BC',
  edgeDark: '#CBB897',
  relief: '#F1E9DE',
  shadow: '#C3B091',
  ink: '#4D3A2C',
  subInk: '#7C6650',
  bronze: '#A97A43',
  bronzeDeep: '#7C552A',
  mutedBlue: '#AFC2C7',
  mutedBlueDeep: '#7F9AA4',
  warmRed: '#B86A53',
  moss: '#7A8B66',
  gold: '#C49A5C',
  line: '#D9C9AB',
  wood: '#8C5C34',
  woodDeep: '#6E4220',
};

const outerShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '0 2px 0 rgba(240,231,219,0.72) inset, 0 -3px 10px rgba(173, 146, 111, 0.12) inset, 0 10px 24px rgba(123, 93, 58, 0.08)',
  } as ViewStyle,
  default: {
    shadowColor: atlasColors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});

export function AtlasBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.background, style]}>
      <Image
        source={atlasAssets.paperBackground}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 900" preserveAspectRatio="none">
        <Rect x="0" y="0" width="400" height="900" fill={atlasColors.paper} />
        <Path
          d="M8 72c34-18 70-23 119-18 40 3 69 17 112 11 38-6 71-26 152-12"
          stroke="#D5C3A4"
          strokeWidth="1.2"
          fill="none"
          opacity="0.35"
        />
        <Path
          d="M-6 118c24 17 66 29 112 18 44-10 79-35 134-24 36 7 80 34 166 18"
          stroke="#D8C9B2"
          strokeWidth="1"
          fill="none"
          opacity="0.28"
        />
        <Path
          d="M14 756c45-29 93-34 144-18 57 18 103 31 154 14 34-11 48-28 84-24"
          stroke="#D5C3A4"
          strokeWidth="1.3"
          fill="none"
          opacity="0.28"
        />
        <Path
          d="M32 652c18-11 36-20 58-22 19-2 39 1 63-5 26-6 42-23 66-29 23-5 42 3 59 8"
          stroke="#D5C8B0"
          strokeWidth="1"
          fill="none"
          opacity="0.24"
        />
        <Path
          d="M34 182c0 0 19-15 45-14 25 1 50 22 80 18 35-4 58-28 98-24 31 3 57 20 85 17"
          stroke="#CDB899"
          strokeWidth="0.9"
          fill="none"
          opacity="0.16"
        />
        <Path
          d="M268 178c17 10 29 21 44 38 8 9 18 14 35 20"
          stroke="#D5C3A4"
          strokeWidth="1"
          fill="none"
          opacity="0.18"
        />
        <Circle cx="52" cy="142" r="2.6" fill="#D5C3A4" opacity="0.45" />
        <Circle cx="338" cy="118" r="2.2" fill="#D5C3A4" opacity="0.38" />
        <Circle cx="302" cy="768" r="2.8" fill="#D5C3A4" opacity="0.35" />
        <Circle cx="86" cy="826" r="2.1" fill="#D5C3A4" opacity="0.3" />
        <Rect x="20" y="20" width="360" height="860" rx="28" fill="none" stroke="#E2D3B8" opacity="0.25" />
      </Svg>
      <View style={styles.backgroundTint} />
      <View style={styles.paperNoise} />
      {children}
    </View>
  );
}

export function AtlasPanel({
  children,
  style,
  variant = 'raised',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: PanelVariant;
}) {
  return (
    <View style={[styles.panelBase, panelVariantStyles[variant], style]}>
      <View pointerEvents="none" style={styles.panelHighlight} />
      <View pointerEvents="none" style={styles.panelInnerFrame} />
      {variant === 'ticket' ? (
        <>
          <View pointerEvents="none" style={[styles.ticketHole, { left: -7, top: 28 }]} />
          <View pointerEvents="none" style={[styles.ticketHole, { left: -7, bottom: 28 }]} />
          <View pointerEvents="none" style={[styles.ticketHole, { right: -7, top: 28 }]} />
          <View pointerEvents="none" style={[styles.ticketHole, { right: -7, bottom: 28 }]} />
        </>
      ) : null}
      {children}
    </View>
  );
}

export function AtlasMedallion({
  icon,
  size = 44,
  label,
  tone = 'bronze',
  style,
}: {
  icon: AtlasIconName;
  size?: number;
  label?: string;
  tone?: 'bronze' | 'paper';
  style?: StyleProp<ViewStyle>;
}) {
  const isBronze = tone === 'bronze';
  return (
    <View
      style={[
        styles.medallion,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isBronze ? '#E8D8BD' : atlasColors.paperAlt,
          borderColor: isBronze ? '#AF8A57' : atlasColors.edge,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.medallionInner,
          {
            borderRadius: size / 2 - 4,
            borderColor: isBronze ? '#C8A26C' : '#E4D7BF',
          },
        ]}
      />
      <FontAwesome6
        name={icon}
        size={Math.max(14, size * 0.36)}
        color={isBronze ? atlasColors.bronzeDeep : atlasColors.bronze}
      />
      {label ? <Text style={styles.medallionLabel}>{label}</Text> : null}
    </View>
  );
}

export function AtlasAssetBadge({
  source,
  size = 44,
  style,
  contentFit = 'contain',
  framed = false,
  scale,
}: {
  source: AtlasImageSource;
  size?: number;
  style?: StyleProp<ViewStyle>;
  contentFit?: 'contain' | 'cover' | 'fill';
  framed?: boolean;
  scale?: number;
}) {
  const imageSize = size * (scale ?? (framed ? 0.78 : 0.96));

  return (
    <View
      style={[
        styles.assetBadgeBase,
        framed && styles.assetBadgeFramed,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <Image source={source} contentFit={contentFit} style={[styles.assetBadgeImage, { width: imageSize, height: imageSize }]} />
    </View>
  );
}

export function AtlasDivider({
  title,
  style,
  labelStyle,
}: {
  title?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={[styles.dividerWrap, style]}>
      <View style={styles.dividerLine} />
      {title ? <Text style={[styles.dividerText, labelStyle]}>{title}</Text> : <View style={styles.dividerGlyph} />}
      <View style={styles.dividerLine} />
    </View>
  );
}

export function AtlasTag({
  label,
  selected = false,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const variant: TagVariant = selected ? 'selected' : 'default';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tagBase, tagStyles[variant], pressed && styles.tagPressed, style]}>
      <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function AtlasPill({
  label,
  style,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function AtlasProgressBar({
  value,
  max = 100,
  tone = 'bronze',
  height = 10,
  style,
}: {
  value: number;
  max?: number;
  tone?: 'bronze' | 'red' | 'blue' | 'gold' | 'moss';
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = Math.max(0, Math.min(1, value / max));
  const fillColor = {
    bronze: atlasColors.bronze,
    red: atlasColors.warmRed,
    blue: atlasColors.mutedBlueDeep,
    gold: atlasColors.gold,
    moss: atlasColors.moss,
  }[tone];

  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${progress * 100}%`,
            backgroundColor: fillColor,
            borderRadius: height / 2,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.progressHighlight,
          {
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

export function AtlasWoodButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: AtlasIconName;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.woodButton, pressed && styles.woodButtonPressed, style]}>
      <View pointerEvents="none" style={styles.woodInnerBorder} />
      <View pointerEvents="none" style={styles.woodCornerLeft} />
      <View pointerEvents="none" style={styles.woodCornerRight} />
      <View style={styles.woodContent}>
        {icon ? <FontAwesome6 name={icon} size={16} color="#F8ECD8" /> : null}
        <Text style={styles.woodLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function AtlasMapIllustration({
  variant = 'home',
  height = 220,
  style,
  source,
  framed = true,
  aspectRatio,
}: {
  variant?: MapVariant;
  height?: number;
  style?: StyleProp<ViewStyle>;
  source?: AtlasImageSource;
  framed?: boolean;
  aspectRatio?: number;
}) {
  if (source) {
    if (!framed) {
      return (
        <View style={[styles.mapBareShell, aspectRatio ? { aspectRatio } : { height }, style]}>
          <Image source={source} contentFit="contain" style={StyleSheet.absoluteFill} />
        </View>
      );
    }

    return (
      <AtlasPanel variant="sunken" style={[styles.mapShell, { height }, style]}>
        <Image source={source} contentFit="cover" style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={styles.photoMapOverlay} />
      </AtlasPanel>
    );
  }

  const showRoute = variant === 'route';
  const showPins = variant === 'profile';
  const showPavilion = variant === 'complete';

  return (
    <AtlasPanel variant="sunken" style={[styles.mapShell, { height }, style]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice">
        <Rect x="0" y="0" width="360" height="220" rx="22" fill="#F7F1E6" />

        <Path
          d="M20 27c37-18 72-18 112-8 22 6 53 12 79 3 18-6 42-23 72-16 18 4 34 14 56 12"
          stroke="#DCCBAB"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <Path
          d="M4 176c34-10 72-10 101-2 40 11 70 19 110 11 45-10 78-29 137-23"
          stroke="#D3C2A3"
          strokeWidth="1.8"
          fill="none"
          opacity="0.52"
        />

        <Path
          d="M26 194c21-43 46-61 70-84 29-28 37-67 74-92 28-18 74-19 109 0 35 19 55 54 67 93-18 8-33 20-54 34-24 16-59 35-115 39-46 4-102-5-151 10z"
          fill="#F2E7D1"
          stroke="#DECCAB"
          strokeWidth="2.5"
        />

        <Path
          d="M70 204c19-38 38-51 56-68 20-19 35-56 68-76 28-18 62-14 86 1 26 15 43 46 47 92-21 13-57 31-105 38-39 6-99 2-152 13z"
          fill="#F8F4EA"
          stroke="#EFE5D4"
          strokeWidth="2"
          opacity="0.88"
        />

        <Path
          d="M19 149c52-40 93-54 122-94 17-24 48-48 91-45 35 2 60 19 89 49 13 13 23 24 37 30-22 20-47 26-68 39-23 14-39 42-74 53-43 13-104 13-197-32z"
          fill="#AEC5C9"
          stroke="#8EA8AE"
          strokeWidth="2.5"
          opacity="0.8"
        />

        <Path
          d="M0 171c24-10 44-15 67-36 18-16 28-34 48-42 17-7 36-1 54 4 26 8 48 9 71-3 27-13 48-42 73-51 20-8 34-4 57 7"
          stroke="#E9DFCE"
          strokeWidth="4"
          fill="none"
        />
        <Path
          d="M20 177c24-10 44-15 67-36 18-16 28-34 48-42 17-7 36-1 54 4 26 8 48 9 71-3 27-13 48-42 73-51 20-8 34-4 57 7"
          stroke="#D6C4A4"
          strokeWidth="1.2"
          fill="none"
          opacity="0.8"
        />
        <Path
          d="M61 195c16-14 28-32 48-41 24-12 55-7 82-12 31-6 47-25 66-46 13-15 31-30 57-38"
          stroke="#D7C7AC"
          strokeWidth="1.2"
          fill="none"
          opacity="0.65"
        />

        <Rect x="83" y="135" width="66" height="6" rx="3" fill="#B89763" opacity="0.88" />
        <Rect x="230" y="121" width="55" height="5" rx="2.5" fill="#B89763" opacity="0.82" />

        <G opacity="0.92">
          <ReliefBuilding x={84} y={88} scale={1.05} />
          <ReliefBuilding x={118} y={102} scale={0.74} />
          <ReliefBuilding x={148} y={80} scale={0.84} />
          <ReliefBuilding x={220} y={70} scale={1.08} />
          <ReliefBuilding x={252} y={95} scale={0.78} />
          <ReliefBuilding x={274} y={132} scale={0.88} />
          <ReliefBuilding x={176} y={130} scale={0.98} />
          <ReliefBuilding x={144} y={142} scale={0.62} />
          <ReliefBuilding x={102} y={152} scale={0.74} />
        </G>

        <ReliefTree x={134} y={106} scale={1.08} />
        <ReliefTree x={160} y={115} scale={0.86} />
        <ReliefTree x={206} y={86} scale={1.05} />
        <ReliefTree x={244} y={84} scale={0.9} />
        <ReliefTree x={292} y={118} scale={0.88} />
        <ReliefTree x={222} y={150} scale={0.76} />

        {variant !== 'complete' ? (
          <>
            <Ellipse cx="46" cy="169" rx="12" ry="4" fill="#C7B49A" opacity="0.55" />
            <Path
              d="M34 165h14l5 4H29z"
              fill="#F0E5D2"
              stroke="#BFA987"
              strokeWidth="1"
            />
            <Line x1="41" y1="165" x2="41" y2="157" stroke="#A7895F" strokeWidth="1.4" />
            <Path d="M41 158c6 1 8 4 9 6" stroke="#A7895F" strokeWidth="1.1" fill="none" />
          </>
        ) : null}

        {showPavilion ? (
          <G>
            <Ellipse cx="186" cy="143" rx="74" ry="20" fill="#CCB79B" opacity="0.33" />
            <Path
              d="M150 146h71"
              stroke="#B4915C"
              strokeWidth="3"
              opacity="0.55"
            />
            <Path
              d="M162 104h44l16 12h-76z"
              fill="#A97A43"
              stroke="#7C552A"
              strokeWidth="2"
            />
            <Path
              d="M170 117h28l10 8h-48z"
              fill="#E8D0A8"
              stroke="#B78E59"
              strokeWidth="1.5"
            />
            <Rect x="168" y="126" width="36" height="24" rx="3" fill="#F7EBDD" stroke="#C6AB7F" strokeWidth="1.5" />
            <Line x1="178" y1="126" x2="178" y2="150" stroke="#B48B56" strokeWidth="1.2" />
            <Line x1="194" y1="126" x2="194" y2="150" stroke="#B48B56" strokeWidth="1.2" />
            <Line x1="168" y1="136" x2="204" y2="136" stroke="#DFC7A1" strokeWidth="1.2" />
          </G>
        ) : null}

        {showRoute ? (
          <>
            <Path
              d="M95 150c18-25 27-30 45-58 15-22 33-33 52-35 26-4 33 14 46 26 10 10 24 18 40 24-14 14-22 29-27 42-7 18-6 29-17 47-11 17-33 29-62 34-30 5-60 1-77-10-17-11-21-34-34-70-4-12-9-21-20-27"
              stroke="#AF4A37"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
            />
            {[
              [154, 72, '1'],
              [239, 110, '2'],
              [79, 140, '3'],
              [201, 170, '4'],
              [172, 143, '5'],
            ].map(([cx, cy, label]) => (
              <G key={`${cx}-${cy}`}>
                <Circle cx={cx as number} cy={cy as number} r="13" fill="#A06E33" stroke="#FAEED9" strokeWidth="2.4" />
                <Circle cx={cx as number} cy={cy as number} r="10" fill="#B9894F" opacity="0.9" />
                <SvgText
                  x={cx as number}
                  y={(cy as number) + 4}
                  fontSize="10"
                  fill="#FFF8EB"
                  textAnchor="middle"
                  fontWeight="700"
                >
                  {label}
                </SvgText>
              </G>
            ))}
          </>
        ) : null}

        {showPins ? (
          <>
            {[[
              92, 132,
            ], [148, 82], [224, 118], [284, 90]].map(([x, y]) => (
              <G key={`${x}-${y}`}>
                <Circle cx={x} cy={y} r="7" fill="#C37F42" />
                <Circle cx={x} cy={y} r="3" fill="#FFF1DF" />
                <Path d={`M${x} ${y + 7}l-5 10h10z`} fill="#C37F42" />
              </G>
            ))}
          </>
        ) : null}
      </Svg>
    </AtlasPanel>
  );
}

export function AtlasCollectionCard({
  progress,
  status,
  variant,
  style,
  imageSource,
}: {
  title: string;
  progress: string;
  status: string;
  variant: MiniatureVariant;
  style?: StyleProp<ViewStyle>;
  imageSource?: AtlasImageSource;
}) {
  return (
    <View style={[styles.collectionCard, style]}>
      <View style={styles.collectionArtWrap}>
        {imageSource ? (
          <Image source={imageSource} contentFit="contain" style={StyleSheet.absoluteFill} />
        ) : (
          <AtlasMiniature variant={variant} />
        )}
      </View>
      <View style={styles.collectionFooter}>
        <Text style={styles.collectionProgress}>{progress}</Text>
        <Text style={styles.collectionStatus}>{status}</Text>
      </View>
    </View>
  );
}

function ReliefBuilding({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path d="M0 18h26v18H0z" fill="#F2E4CB" stroke="#C4A476" strokeWidth="1.5" />
      <Path d="M-4 18l17-9 17 9" fill="#B88750" stroke="#81572B" strokeWidth="1.8" />
      <Path d="M6 9h14l7 4H-1z" fill="#D8BD90" stroke="#A47740" strokeWidth="1.2" />
      <Line x1="9" y1="18" x2="9" y2="36" stroke="#B28C59" strokeWidth="1.1" />
      <Line x1="17" y1="18" x2="17" y2="36" stroke="#B28C59" strokeWidth="1.1" />
      <Rect x="11" y="24" width="5" height="12" rx="1" fill="#C19056" opacity="0.7" />
    </G>
  );
}

function ReliefTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Circle cx="0" cy="0" r="8" fill="#BCA57D" />
      <Circle cx="8" cy="2" r="6" fill="#CDB081" />
      <Circle cx="-7" cy="4" r="6" fill="#B69465" />
      <Rect x="-1.5" y="7" width="3" height="10" rx="1" fill="#8A6A46" />
    </G>
  );
}

function AtlasMiniature({ variant }: { variant: MiniatureVariant }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 140 92" preserveAspectRatio="xMidYMid slice">
      <Rect x="0" y="0" width="140" height="92" rx="12" fill="#F4EEE2" />
      <Path d="M6 76c18-11 32-11 49-6 13 4 26 9 42 7 19-3 25-12 38-14" stroke="#DAC8AA" strokeWidth="1" fill="none" />
      {variant === 'memory' ? (
        <>
          <Path d="M18 62h30V43H18z" fill="#F3E6D0" stroke="#C2A174" strokeWidth="1.4" />
          <Path d="M13 43l20-12 20 12" fill="#B7864D" stroke="#7D5628" strokeWidth="1.5" />
          <Path d="M74 65h22V39H74z" fill="#F3E6D0" stroke="#C2A174" strokeWidth="1.2" />
          <Path d="M68 39l17-10 17 10" fill="#B98B52" stroke="#805729" strokeWidth="1.4" />
          <Path d="M112 69V36" stroke="#B58C58" strokeWidth="2" />
          <Path d="M104 45h16" stroke="#D3B283" strokeWidth="2" />
        </>
      ) : null}
      {variant === 'food' ? (
        <>
          <Ellipse cx="74" cy="58" rx="31" ry="15" fill="#EFE1CA" stroke="#BDA07C" strokeWidth="1.5" />
          <Path d="M45 53c5-15 57-15 62 0" fill="#D5A56C" stroke="#B17645" strokeWidth="1.4" />
          <Path d="M96 24l12 6-6 14" stroke="#B78953" strokeWidth="3" fill="none" strokeLinecap="round" />
          {[56, 67, 78, 88].map((x) => (
            <Circle key={x} cx={x} cy="53" r="4.8" fill="#C68442" />
          ))}
        </>
      ) : null}
      {variant === 'landmark' ? (
        <>
          <Path d="M22 64h54V45l-10-12H32L22 45z" fill="#F2E5CF" stroke="#C0A076" strokeWidth="1.5" />
          <Path d="M46 33V23" stroke="#B18A59" strokeWidth="2" />
          <Circle cx="46" cy="21" r="4" fill="#C7995D" />
          <Path d="M96 69V30" stroke="#B28A59" strokeWidth="2" />
          <Path d="M88 43h16" stroke="#D0B081" strokeWidth="2" />
        </>
      ) : null}
      {variant === 'vibe' ? (
        <>
          <Path d="M17 68h96" stroke="#D2BE9D" strokeWidth="1.5" />
          <Path d="M25 67V42h18v25" fill="#F2E7D4" stroke="#BDA17B" strokeWidth="1.4" />
          <Path d="M49 67V36h24v31" fill="#F2E7D4" stroke="#BDA17B" strokeWidth="1.4" />
          <Path d="M79 67V44h25v23" fill="#F2E7D4" stroke="#BDA17B" strokeWidth="1.4" />
          {[34, 60, 91].map((x) => (
            <Circle key={x} cx={x} cy="53" r="3.2" fill="#C37F42" opacity="0.8" />
          ))}
          <Path d="M102 30c4-5 9-8 16-8" stroke="#D8C4A8" strokeWidth="1.3" fill="none" />
        </>
      ) : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: atlasColors.paper,
    position: 'relative',
    overflow: 'hidden',
  },
  paperNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
    opacity: 0.7,
  },
  backgroundTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 222, 210, 0.22)',
  },
  panelBase: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },
  panelHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '58%',
    height: '40%',
    backgroundColor: 'rgba(240, 231, 219, 0.18)',
    borderTopLeftRadius: 22,
    borderBottomRightRadius: 30,
  },
  panelInnerFrame: {
    position: 'absolute',
    left: 7,
    top: 7,
    right: 7,
    bottom: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 197, 166, 0.8)',
  },
  ticketHole: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: atlasColors.paper,
    borderWidth: 1,
    borderColor: '#D7C8AD',
  },
  medallion: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.6,
    ...outerShadow,
  },
  medallionInner: {
    position: 'absolute',
    left: 4,
    top: 4,
    right: 4,
    bottom: 4,
    borderWidth: 1,
  },
  assetBadgeBase: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  assetBadgeFramed: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.4,
    borderColor: '#D7C8AD',
    backgroundColor: '#F8F2E7',
    overflow: 'hidden',
    borderRadius: 999,
    ...outerShadow,
  },
  assetBadgeImage: Platform.select({
    web: {
      mixBlendMode: 'multiply',
      opacity: 0.98,
      filter: 'contrast(1.02) saturate(0.94)',
    } as ViewStyle,
    default: {
      opacity: 0.98,
    },
  }),
  medallionLabel: {
    position: 'absolute',
    bottom: -13,
    fontSize: 10,
    color: atlasColors.subInk,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4C6AE',
  },
  dividerGlyph: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: atlasColors.bronze,
    transform: [{ rotate: '45deg' }],
  },
  dividerText: {
    color: atlasColors.subInk,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  tagBase: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    ...outerShadow,
  },
  tagPressed: {
    opacity: 0.86,
  },
  tagText: {
    color: atlasColors.ink,
    fontSize: 14,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  tagTextSelected: {
    color: atlasColors.bronzeDeep,
    fontWeight: '700',
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6C0A0',
    backgroundColor: '#F7EBD8',
  },
  pillText: {
    color: atlasColors.bronze,
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E7DCC8',
    borderWidth: 1,
    borderColor: '#D8CAB0',
  },
  progressFill: {
    position: 'absolute',
    left: 2,
    top: 2,
    bottom: 2,
  },
  progressHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
  },
  woodButton: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: atlasColors.woodDeep,
    backgroundColor: atlasColors.wood,
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        boxShadow:
          '0 2px 0 rgba(255,255,255,0.08) inset, 0 -5px 12px rgba(0,0,0,0.12) inset, 0 8px 20px rgba(105, 64, 32, 0.18)',
      },
      default: {
        shadowColor: '#6A4224',
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 7 },
        elevation: 6,
      },
    }),
  },
  woodButtonPressed: {
    opacity: 0.9,
  },
  woodInnerBorder: {
    position: 'absolute',
    left: 6,
    top: 6,
    right: 6,
    bottom: 6,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(246, 224, 190, 0.42)',
  },
  woodCornerLeft: {
    position: 'absolute',
    left: 14,
    top: 11,
    width: 12,
    height: 12,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(246, 224, 190, 0.44)',
  },
  woodCornerRight: {
    position: 'absolute',
    right: 14,
    bottom: 11,
    width: 12,
    height: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(246, 224, 190, 0.44)',
  },
  woodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  woodLabel: {
    color: '#F9F0E0',
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
  },
  mapShell: {
    padding: 0,
  },
  mapBareShell: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  photoMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  collectionCard: {
    gap: 10,
  },
  collectionArtWrap: {
    height: 188,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: atlasColors.paper,
  },
  collectionFooter: {
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 4,
  },
  collectionProgress: {
    color: atlasColors.ink,
    fontSize: 18,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  collectionStatus: {
    color: atlasColors.subInk,
    fontSize: 12,
    textAlign: 'center',
  },
});

const panelVariantStyles = StyleSheet.create({
  paper: {
    backgroundColor: atlasColors.paperAlt,
    borderColor: '#E4D7BF',
  },
  raised: {
    backgroundColor: '#ECE3D8',
    borderColor: '#E2D4BC',
    ...outerShadow,
  },
  sunken: {
    backgroundColor: '#E4D7C7',
    borderColor: '#D8C9AE',
  },
  ticket: {
    backgroundColor: '#ECE2D6',
    borderColor: '#DDCDB1',
    ...outerShadow,
  },
});

const tagStyles = StyleSheet.create({
  default: {
    backgroundColor: '#ECE3D8',
    borderColor: '#E3D4BA',
  },
  selected: {
    backgroundColor: '#E6D9C5',
    borderColor: '#B88C53',
  },
});
