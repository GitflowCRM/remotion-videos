import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import { KpiCard } from './components/kpi-card-inline';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card-inline';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Package,
  TrendingUp,
} from 'lucide-react';

// SmallERP exact theme colors
const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

// Animated wrapper
const AnimatedEntry: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>
      {children}
    </div>
  );
};

// Animated number counter
const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  delay: number;
}> = ({ value, prefix = '', delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <>{prefix}{Math.floor(value * progress).toLocaleString()}</>;
};

// Revenue chart
const RevenueChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const points = [20, 35, 25, 45, 40, 60, 55, 75, 70, 90, 85, 95];
  const width = 440;
  const height = 120;
  
  const progress = interpolate(frame - delay, [0, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const pathPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / 100) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  const fillPath = pathPoints + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </linearGradient>
        <clipPath id="reveal">
          <rect x="0" y="0" width={width * progress} height={height + 20} />
        </clipPath>
      </defs>
      <g clipPath="url(#reveal)">
        <path d={fillPath} fill="url(#chartGrad)" />
        <path d={pathPoints} fill="none" stroke={theme.primary} strokeWidth="3" />
      </g>
    </svg>
  );
};

// Bar chart
const BarChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const bars = [65, 45, 80, 55, 90, 70, 85];
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 70 }}>
      {bars.map((height, i) => {
        const barDelay = delay + i * 5;
        const progress = interpolate(frame - barDelay, [0, 25], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: height * progress * 0.7,
              backgroundColor: i === bars.length - 1 ? theme.primary : theme.border,
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
};

export const DashboardReal2: React.FC = () => {
  const frame = useCurrentFrame();
  
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { 
    extrapolateRight: 'clamp' 
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 40,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: theme.card,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 24,
          gap: 20,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: theme.primary,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          SE
        </div>
        {['📊', '💳', '📦', '👥', '📁'].map((icon, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: i === 0 ? theme.border : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 100 }}>
        {/* Header */}
        <div style={{ marginBottom: 32, opacity: headerOpacity }}>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: theme.dim, fontSize: 15, margin: '8px 0 0 0' }}>
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* KPI Cards - Using inline style components */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
          <AnimatedEntry delay={30}>
            <KpiCard
              title="Total Revenue"
              value={<AnimatedNumber value={125750} prefix="AED " delay={45} />}
              change="+12%"
              changeType="positive"
              icon={DollarSign}
              color={theme.primary}
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={45}>
            <KpiCard
              title="Invoices"
              value={<AnimatedNumber value={48} delay={60} />}
              change="+3"
              changeType="positive"
              icon={FileText}
              color="#3b82f6"
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={60}>
            <KpiCard
              title="Customers"
              value={<AnimatedNumber value={156} delay={75} />}
              change="+8"
              changeType="positive"
              icon={Users}
              color="#8b5cf6"
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={75}>
            <KpiCard
              title="Products"
              value={<AnimatedNumber value={324} delay={90} />}
              change="0"
              changeType="neutral"
              icon={Package}
              color={theme.warning}
            />
          </AnimatedEntry>
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <AnimatedEntry delay={100}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <p style={{ 
                      fontSize: 28, 
                      fontWeight: 700, 
                      color: theme.text, 
                      margin: '12px 0 0 0' 
                    }}>
                      <AnimatedNumber value={89420} prefix="AED " delay={120} />
                    </p>
                  </div>
                  <span style={{ 
                    color: theme.success, 
                    fontSize: 14, 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: interpolate(frame - 140, [0, 15], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}>
                    <TrendingUp style={{ width: 16, height: 16 }} />
                    +12.5%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <RevenueChart delay={130} />
              </CardContent>
            </Card>
          </AnimatedEntry>

          <AnimatedEntry delay={120}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales</CardTitle>
                <p style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  color: theme.text, 
                  margin: '12px 0 0 0' 
                }}>
                  <AnimatedNumber value={23} delay={140} /> orders
                </p>
              </CardHeader>
              <CardContent>
                <BarChart delay={150} />
              </CardContent>
            </Card>
          </AnimatedEntry>
        </div>
      </div>
    </AbsoluteFill>
  );
};
