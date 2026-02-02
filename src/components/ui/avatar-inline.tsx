import React from 'react';

// SmallERP theme
const theme = {
  primary: '#6366f1',
  secondary: '#1e293b',
  text: '#f8fafc',
  muted: '#94a3b8',
};

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  style?: React.CSSProperties;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(str: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, name, size = 'md', style }: AvatarProps) {
  const dimension = sizeMap[size];
  const fontSize = dimension * 0.4;
  const bgColor = name ? stringToColor(name) : theme.secondary;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          objectFit: 'cover',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text,
        fontSize,
        fontWeight: 600,
        ...style,
      }}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { src?: string; name: string }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const dimension = sizeMap[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((avatar, i) => (
        <div
          key={i}
          style={{
            marginLeft: i > 0 ? -dimension * 0.25 : 0,
            border: '2px solid #0f172a',
            borderRadius: '50%',
          }}
        >
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          style={{
            marginLeft: -dimension * 0.25,
            width: dimension,
            height: dimension,
            borderRadius: '50%',
            backgroundColor: theme.secondary,
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.muted,
            fontSize: dimension * 0.35,
            fontWeight: 500,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
