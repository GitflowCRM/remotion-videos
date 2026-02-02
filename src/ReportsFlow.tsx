import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Sidebar,
  SidebarLogo,
  SidebarNav,
} from './components';

const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

const AnimatedEntry: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>{children}</div>;
};

// Animated counter
const AnimatedNumber: React.FC<{ value: number; prefix?: string; delay: number; color?: string }> = ({ value, prefix = '', delay, color = theme.text }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <span style={{ color }}>{prefix}{Math.floor(value * progress).toLocaleString()}</span>;
};

// P&L Summary
const PLSummary: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Card style={{ opacity }}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Profit & Loss</CardTitle>
          <span style={{ color: theme.dim, fontSize: 13 }}>January 2024</span>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.muted, fontSize: 15 }}>Revenue</span>
            <span style={{ color: theme.text, fontSize: 15, fontWeight: 600 }}>
              <AnimatedNumber value={125750} prefix="AED " delay={delay + 20} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.muted, fontSize: 15 }}>Cost of Goods</span>
            <span style={{ color: theme.danger, fontSize: 15 }}>
              -<AnimatedNumber value={42300} prefix="AED " delay={delay + 35} color={theme.danger} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.muted, fontSize: 15 }}>Gross Profit</span>
            <span style={{ color: theme.text, fontSize: 15, fontWeight: 600 }}>
              <AnimatedNumber value={83450} prefix="AED " delay={delay + 50} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.muted, fontSize: 15 }}>Operating Expenses</span>
            <span style={{ color: theme.danger, fontSize: 15 }}>
              -<AnimatedNumber value={24000} prefix="AED " delay={delay + 65} color={theme.danger} />
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 8, padding: '16px' }}>
          <span style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>Net Profit</span>
          <span style={{ color: theme.success, fontSize: 24, fontWeight: 700 }}>
            <AnimatedNumber value={59450} prefix="AED " delay={delay + 80} color={theme.success} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Cash flow chart
const CashFlowChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const inflow = [45, 52, 48, 61, 58, 72];
  const outflow = [38, 42, 45, 48, 44, 52];
  const maxVal = 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow (6 months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, backgroundColor: theme.success, borderRadius: 2 }} />
              <span style={{ color: theme.muted, fontSize: 12 }}>Inflow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, backgroundColor: theme.danger, borderRadius: 2 }} />
              <span style={{ color: theme.muted, fontSize: 12 }}>Outflow</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 140 }}>
          {months.map((month, i) => {
            const barDelay = delay + i * 15;
            const progress = interpolate(frame - barDelay, [0, 30], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                  <div style={{
                    width: 16,
                    height: (inflow[i] / maxVal) * 120 * progress,
                    backgroundColor: theme.success,
                    borderRadius: 4,
                  }} />
                  <div style={{
                    width: 16,
                    height: (outflow[i] / maxVal) * 120 * progress,
                    backgroundColor: theme.danger,
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ color: theme.dim, fontSize: 11 }}>{month}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Report card
const ReportCard: React.FC<{ title: string; icon: string; description: string; delay: number }> = ({ title, icon, description, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Card style={{ opacity, transform: `scale(${0.9 + progress * 0.1})`, cursor: 'pointer' }}>
      <CardContent style={{ padding: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
        <div style={{ color: theme.text, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ color: theme.dim, fontSize: 13 }}>{description}</div>
      </CardContent>
    </Card>
  );
};

export const ReportsFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  const navItems = [
    { icon: '📊', label: 'Dashboard', active: false },
    { icon: '📄', label: 'Invoices', active: false },
    { icon: '📦', label: 'Inventory', active: false },
    { icon: '👥', label: 'Customers', active: false },
    { icon: '📈', label: 'Reports', active: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar style={{ opacity: headerOpacity }}>
        <SidebarLogo />
        <SidebarNav items={navItems} />
      </Sidebar>
      
      <div style={{ marginLeft: 240, padding: 36 }}>
        <div style={{ marginBottom: 28, opacity: headerOpacity }}>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>Reports</h1>
          <p style={{ color: theme.dim, fontSize: 15, margin: '10px 0 0 0' }}>Real-time business insights</p>
        </div>

        {/* Report types */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <ReportCard title="Profit & Loss" icon="📊" description="Income vs expenses" delay={40} />
          <ReportCard title="Cash Flow" icon="💰" description="Money movement" delay={55} />
          <ReportCard title="Aging Report" icon="⏰" description="Outstanding payments" delay={70} />
          <ReportCard title="Tax Summary" icon="🧾" description="VAT breakdown" delay={85} />
        </div>

        {/* Main reports */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <PLSummary delay={110} />
          <CashFlowChart delay={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
