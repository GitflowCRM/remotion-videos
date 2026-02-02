import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from 'remotion';

// Animated counter component - slower for longer duration
const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  duration?: number;
}> = ({ value, prefix = '', suffix = '', decimals = 0, delay = 0, duration = 60 }) => {
  const frame = useCurrentFrame();
  
  const adjustedFrame = Math.max(0, frame - delay);
  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const displayValue = (value * progress).toFixed(decimals);
  
  return (
    <span>
      {prefix}{Number(displayValue).toLocaleString()}{suffix}
    </span>
  );
};

// SmallERP Theme Colors
const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',      // Indigo - main brand color
  primaryMuted: '#6366f120',
  success: '#10b981',      // Green - for positive/paid
  successMuted: '#10b98120',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDim: '#64748b',
};

// Stat card component with staggered reveal
const StatCard: React.FC<{
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: string;
  delay: number;
}> = ({ title, value, prefix, suffix, color, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const slideUp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: '20px 24px',
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity,
        transform: `translateY(${(1 - slideUp) * 40}px)`,
      }}
    >
      <div>
        <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>{title}</div>
        <div style={{ color, fontSize: 32, fontWeight: 700 }}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} delay={delay + 15} duration={50} />
        </div>
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

// Mini bar chart with slower animation
const MiniBarChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const bars = [65, 45, 80, 55, 90, 70, 85];
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
      {bars.map((height, i) => {
        const barDelay = delay + i * 6;
        const progress = interpolate(frame - barDelay, [0, 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        
        return (
          <div
            key={i}
            style={{
              width: 16,
              height: height * progress * 0.8,
              backgroundColor: i === bars.length - 1 ? '#6366f1' : '#334155',
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
};

// Revenue chart with animated line - slower drawing
const RevenueChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const points = [20, 35, 25, 45, 40, 60, 55, 75, 70, 90, 85, 95];
  const width = 500;
  const height = 140;
  
  // Slower line drawing - 90 frames instead of 60
  const progress = interpolate(frame - delay, [0, 90], [0, 1], {
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
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <clipPath id="reveal">
          <rect x="0" y="0" width={width * progress} height={height + 20} />
        </clipPath>
      </defs>
      <g clipPath="url(#reveal)">
        <path d={fillPath} fill="url(#chartGradient)" />
        <path d={pathPoints} fill="none" stroke="#6366f1" strokeWidth="3" />
      </g>
      {/* Animated dot at end of line */}
      {progress > 0.1 && (
        <circle
          cx={(progress * (points.length - 1) / (points.length - 1)) * width}
          cy={height - (points[Math.min(Math.floor(progress * (points.length - 1)), points.length - 1)] / 100) * height}
          r="6"
          fill="#6366f1"
          style={{
            opacity: interpolate(progress, [0, 0.1, 1], [0, 1, 1]),
          }}
        />
      )}
    </svg>
  );
};

// Transaction row with slower reveal
const TransactionRow: React.FC<{
  name: string;
  type: string;
  amount: string;
  status: string;
  delay: number;
}> = ({ name, type, amount, status, delay }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const slideX = interpolate(frame - delay, [0, 20], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const statusColors: Record<string, string> = {
    Paid: '#10b981',     // Green for success
    Pending: '#f59e0b',  // Amber for warning
    Overdue: '#ef4444',  // Red for danger
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #334155',
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {type === 'Invoice' ? '📄' : '💰'}
        </div>
        <div>
          <div style={{ color: 'white', fontSize: 15, fontWeight: 500 }}>{name}</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>{type}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>{amount}</div>
        <div
          style={{
            color: statusColors[status] || '#64748b',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component - Extended to ~16 seconds (480 frames)
export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Timeline for 16 seconds:
  // 0-30: Header fades in
  // 30-120: Stats cards appear with stagger (30 frames apart)
  // 120-250: Charts section
  // 250-400: Transactions appear
  // 400-480: Hold / subtle animations
  
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const transactions = [
    { name: 'Acme Corporation', type: 'Invoice', amount: 'AED 12,500', status: 'Paid' },
    { name: 'Tech Solutions LLC', type: 'Invoice', amount: 'AED 8,750', status: 'Pending' },
    { name: 'Global Trade Co', type: 'Payment', amount: 'AED 15,000', status: 'Paid' },
    { name: 'Desert Innovations', type: 'Invoice', amount: 'AED 5,200', status: 'Overdue' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
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
          backgroundColor: '#1e293b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 24,
          gap: 24,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#6366f1',
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
              backgroundColor: i === 0 ? '#334155' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
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
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 700, margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, margin: '10px 0 0 0' }}>
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Stats row - staggered with more delay between each */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <StatCard
            title="Total Revenue"
            value={125750}
            prefix="AED "
            color="#6366f1"
            icon="💰"
            delay={30}
          />
          <StatCard
            title="Invoices"
            value={48}
            color="#3b82f6"
            icon="📄"
            delay={60}
          />
          <StatCard
            title="Customers"
            value={156}
            color="#8b5cf6"
            icon="👥"
            delay={90}
          />
          <StatCard
            title="Products"
            value={324}
            color="#f59e0b"
            icon="📦"
            delay={120}
          />
        </div>

        {/* Charts row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {/* Revenue chart */}
          <div
            style={{
              flex: 2,
              backgroundColor: '#1e293b',
              borderRadius: 12,
              padding: 28,
              opacity: interpolate(frame - 150, [0, 25], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: 14 }}>Monthly Revenue</div>
                <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>
                  <AnimatedNumber value={89420} prefix="AED " delay={170} duration={60} />
                </div>
              </div>
              <div
                style={{
                  color: '#10b981',
                  fontSize: 15,
                  fontWeight: 600,
                  opacity: interpolate(frame - 200, [0, 20], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                +12.5% ↑
              </div>
            </div>
            <RevenueChart delay={180} />
          </div>

          {/* Weekly sales */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#1e293b',
              borderRadius: 12,
              padding: 28,
              opacity: interpolate(frame - 180, [0, 25], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 10 }}>
              Weekly Sales
            </div>
            <div style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
              <AnimatedNumber value={23} delay={200} duration={40} /> orders
            </div>
            <MiniBarChart delay={220} />
          </div>
        </div>

        {/* Recent transactions */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 28,
            opacity: interpolate(frame - 280, [0, 25], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div style={{ color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            Recent Transactions
          </div>
          {transactions.map((tx, i) => (
            <TransactionRow key={i} {...tx} delay={300 + i * 30} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
