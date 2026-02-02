import React from 'react';
import { Card, CardContent } from './ui/card-inline';
import type { LucideIcon } from 'lucide-react';

// SmallERP theme (from actual app)
const theme = {
  primary: '#6366f1',
  primaryMuted: 'rgba(99, 102, 241, 0.1)',
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  neutral: '#64748b',
  neutralBg: 'rgba(100, 116, 139, 0.1)',
  text: '#f8fafc',
  muted: '#94a3b8',
};

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

export function KpiCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  color = theme.primary,
}: KPICardProps) {
  const changeColors = {
    positive: { bg: theme.successBg, text: theme.success },
    negative: { bg: theme.dangerBg, text: theme.danger },
    neutral: { bg: theme.neutralBg, text: theme.neutral },
  };

  const changeStyle = changeColors[changeType];

  return (
    <Card style={{ overflow: 'hidden' }}>
      <CardContent style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Icon container */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon style={{ width: 20, height: 20, color }} />
          </div>
          
          {/* Change badge */}
          {change && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 9999,
                backgroundColor: changeStyle.bg,
                color: changeStyle.text,
              }}
            >
              {change}
            </span>
          )}
        </div>
        
        {/* Value and title */}
        <div style={{ marginTop: 16 }}>
          <p style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: theme.text,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            {value}
          </p>
          <p style={{ 
            fontSize: 13, 
            color: theme.muted,
            margin: '4px 0 0 0',
          }}>
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
