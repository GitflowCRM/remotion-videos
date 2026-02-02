import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  Sequence,
} from 'remotion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Avatar,
  Badge,
} from './components';
import { KpiCard } from './components/kpi-card-inline';
import { DollarSign, FileText, Users, Package } from 'lucide-react';

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

// Animated entry
const AnimatedEntry: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>{children}</div>;
};

// Animated number
const AnimatedNumber: React.FC<{ value: number; prefix?: string; delay: number }> = ({ value, prefix = '', delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <>{prefix}{Math.floor(value * progress).toLocaleString()}</>;
};

// Hook section
const HookSection: React.FC = () => {
  const frame = useCurrentFrame();
  
  const line1Opacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line2Opacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame: frame - 70, fps: 30, config: { damping: 8, stiffness: 100 } });

  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
    }}>
      <div style={{
        color: theme.text,
        fontSize: 42,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 30,
        opacity: line1Opacity,
      }}>
        Running a business in the UAE?
      </div>
      
      <div style={{
        color: theme.muted,
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 60,
        opacity: line2Opacity,
      }}>
        Here's your all-in-one solution
      </div>
      
      <div style={{
        width: 140,
        height: 140,
        borderRadius: 35,
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${logoScale})`,
        boxShadow: `0 0 80px ${theme.primary}60`,
      }}>
        <span style={{ color: 'white', fontSize: 50, fontWeight: 800 }}>SE</span>
      </div>
      
      <div style={{
        color: theme.text,
        fontSize: 36,
        fontWeight: 700,
        marginTop: 30,
        opacity: interpolate(frame - 85, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        SmallERP
      </div>
    </AbsoluteFill>
  );
};

// Dashboard section - Vertical layout
const DashboardSection: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      padding: 30,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: theme.primary, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📊 DASHBOARD</div>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
            Your Business at a Glance
          </h1>
        </div>
      </AnimatedEntry>

      {/* KPI Cards - 2x2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <AnimatedEntry delay={20}>
          <Card>
            <CardContent style={{ padding: 16 }}>
              <DollarSign style={{ width: 24, height: 24, color: theme.primary, marginBottom: 8 }} />
              <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>
                <AnimatedNumber value={125750} prefix="AED " delay={35} />
              </div>
              <div style={{ color: theme.muted, fontSize: 13 }}>Total Revenue</div>
            </CardContent>
          </Card>
        </AnimatedEntry>
        
        <AnimatedEntry delay={35}>
          <Card>
            <CardContent style={{ padding: 16 }}>
              <FileText style={{ width: 24, height: 24, color: '#3b82f6', marginBottom: 8 }} />
              <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>
                <AnimatedNumber value={48} delay={50} />
              </div>
              <div style={{ color: theme.muted, fontSize: 13 }}>Invoices</div>
            </CardContent>
          </Card>
        </AnimatedEntry>
        
        <AnimatedEntry delay={50}>
          <Card>
            <CardContent style={{ padding: 16 }}>
              <Users style={{ width: 24, height: 24, color: '#8b5cf6', marginBottom: 8 }} />
              <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>
                <AnimatedNumber value={156} delay={65} />
              </div>
              <div style={{ color: theme.muted, fontSize: 13 }}>Customers</div>
            </CardContent>
          </Card>
        </AnimatedEntry>
        
        <AnimatedEntry delay={65}>
          <Card>
            <CardContent style={{ padding: 16 }}>
              <Package style={{ width: 24, height: 24, color: theme.warning, marginBottom: 8 }} />
              <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>
                <AnimatedNumber value={324} delay={80} />
              </div>
              <div style={{ color: theme.muted, fontSize: 13 }}>Products</div>
            </CardContent>
          </Card>
        </AnimatedEntry>
      </div>

      {/* Revenue Chart */}
      <AnimatedEntry delay={90}>
        <Card>
          <CardHeader style={{ padding: '16px 16px 8px' }}>
            <CardTitle style={{ fontSize: 16 }}>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 16 }}>
            <RevenueChartVertical delay={100} />
          </CardContent>
        </Card>
      </AnimatedEntry>
    </AbsoluteFill>
  );
};

// Revenue chart for vertical
const RevenueChartVertical: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const points = [20, 35, 25, 45, 40, 60, 55, 75, 70, 90, 85, 95];
  const width = 450;
  const height = 150;
  
  const progress = interpolate(frame - delay, [0, 60], [0, 1], {
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
        <linearGradient id="chartGradV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </linearGradient>
        <clipPath id="revealV">
          <rect x="0" y="0" width={width * progress} height={height + 20} />
        </clipPath>
      </defs>
      <g clipPath="url(#revealV)">
        <path d={fillPath} fill="url(#chartGradV)" />
        <path d={pathPoints} fill="none" stroke={theme.primary} strokeWidth="3" />
      </g>
    </svg>
  );
};

// Invoice section - Vertical
const InvoiceSection: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      padding: 30,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: theme.success, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📄 INVOICES</div>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
            Create in Seconds
          </h1>
        </div>
      </AnimatedEntry>

      {/* Invoice preview */}
      <AnimatedEntry delay={20}>
        <Card>
          <CardContent style={{ padding: 20 }}>
            {/* Customer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${theme.border}` }}>
              <Avatar name="Acme Corporation" size="md" />
              <div>
                <div style={{ color: theme.text, fontSize: 16, fontWeight: 600 }}>Acme Corporation</div>
                <div style={{ color: theme.dim, fontSize: 13 }}>INV-2024-0048</div>
              </div>
            </div>
            
            {/* Line items */}
            {[
              { item: 'Web Development', amount: 5000 },
              { item: 'UI/UX Design', amount: 2500 },
              { item: 'Hosting (12 mo)', amount: 600 },
            ].map((line, i) => {
              const itemDelay = 50 + i * 20;
              const opacity = interpolate(frame - itemDelay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}`, opacity }}>
                  <span style={{ color: theme.text, fontSize: 15 }}>{line.item}</span>
                  <span style={{ color: theme.text, fontSize: 15, fontWeight: 600 }}>AED {line.amount.toLocaleString()}</span>
                </div>
              );
            })}
            
            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 0 0',
              marginTop: 12,
              opacity: interpolate(frame - 120, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <span style={{ color: theme.text, fontSize: 20, fontWeight: 600 }}>Total</span>
              <span style={{ color: theme.primary, fontSize: 28, fontWeight: 700 }}>
                AED <AnimatedNumber value={8505} delay={130} />
              </span>
            </div>
          </CardContent>
        </Card>
      </AnimatedEntry>

      {/* VAT badge */}
      <AnimatedEntry delay={150}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Badge variant="success" style={{ padding: '12px 24px', fontSize: 16 }}>
            ✓ VAT Auto-Calculated
          </Badge>
        </div>
      </AnimatedEntry>
    </AbsoluteFill>
  );
};

// Copilot section - Vertical
const CopilotSection: React.FC = () => {
  const frame = useCurrentFrame();
  
  const userMsgOpacity = interpolate(frame - 30, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const aiTyping = frame >= 60 && frame < 90;
  const aiMsgOpacity = interpolate(frame - 90, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      padding: 30,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: '#8b5cf6', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>✨ AI COPILOT</div>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
            Just Ask Anything
          </h1>
        </div>
      </AnimatedEntry>

      {/* Chat */}
      <div style={{ flex: 1 }}>
        {/* User message */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, opacity: userMsgOpacity }}>
          <div style={{
            backgroundColor: theme.primary,
            padding: '16px 20px',
            borderRadius: '20px 20px 4px 20px',
            maxWidth: '80%',
          }}>
            <span style={{ color: 'white', fontSize: 18 }}>Show me unpaid invoices</span>
          </div>
        </div>
        
        {/* AI response */}
        <div style={{ display: 'flex', gap: 12, opacity: frame >= 60 ? 1 : 0 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.primary}, #8b5cf6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 20 }}>✨</span>
          </div>
          
          <div style={{
            backgroundColor: theme.card,
            padding: '16px 20px',
            borderRadius: '20px 20px 20px 4px',
            flex: 1,
          }}>
            {aiTyping ? (
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: theme.dim,
                    transform: `translateY(${Math.sin((frame + i * 6) / 6) * 4}px)`,
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ opacity: aiMsgOpacity }}>
                <span style={{ color: theme.text, fontSize: 16 }}>
                  Found <strong>3 unpaid invoices</strong> totaling <strong style={{ color: theme.primary }}>AED 24,750</strong>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Invoice cards */}
        {frame >= 110 && (
          <div style={{ marginLeft: 56, marginTop: 16 }}>
            {[
              { name: 'Acme Corp', amount: 12500, days: 15 },
              { name: 'Tech Solutions', amount: 7250, days: 8 },
              { name: 'Global Trade', amount: 5000, days: 3 },
            ].map((inv, i) => {
              const cardDelay = 110 + i * 15;
              const opacity = interpolate(frame - cardDelay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <Card key={i} style={{ marginBottom: 8, opacity }}>
                  <CardContent style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={inv.name} size="sm" />
                        <div>
                          <div style={{ color: theme.text, fontSize: 14, fontWeight: 500 }}>{inv.name}</div>
                          <div style={{ color: theme.dim, fontSize: 12 }}>{inv.days} days overdue</div>
                        </div>
                      </div>
                      <div style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>AED {inv.amount.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// CTA section
const CTASection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 80 } });
  const pulse = frame > 80 ? 1 + Math.sin((frame - 80) / 8) * 0.05 : 1;

  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
    }}>
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        transform: `scale(${logoScale})`,
        boxShadow: `0 0 80px ${theme.primary}60`,
      }}>
        <span style={{ color: 'white', fontSize: 40, fontWeight: 800 }}>SE</span>
      </div>
      
      <div style={{
        color: theme.text,
        fontSize: 36,
        fontWeight: 700,
        marginBottom: 16,
        textAlign: 'center',
        opacity: interpolate(frame - 30, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Start Free Today
      </div>
      
      <div style={{
        color: theme.muted,
        fontSize: 20,
        marginBottom: 40,
        textAlign: 'center',
        opacity: interpolate(frame - 45, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        No credit card required
      </div>
      
      <div style={{
        backgroundColor: theme.primary,
        padding: '20px 50px',
        borderRadius: 16,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 ${pulse * 40}px ${theme.primary}80`,
        opacity: interpolate(frame - 60, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
          smallerp.ae →
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Main Instagram Reel V2 - 30 seconds (900 frames)
export const InstagramReelV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hook - 0-4s */}
      <Sequence from={0} durationInFrames={120}>
        <HookSection />
      </Sequence>
      
      {/* Dashboard - 4-10s */}
      <Sequence from={120} durationInFrames={180}>
        <DashboardSection />
      </Sequence>
      
      {/* Invoice - 10-16s */}
      <Sequence from={300} durationInFrames={180}>
        <InvoiceSection />
      </Sequence>
      
      {/* Copilot - 16-24s */}
      <Sequence from={480} durationInFrames={240}>
        <CopilotSection />
      </Sequence>
      
      {/* CTA - 24-30s */}
      <Sequence from={720} durationInFrames={180}>
        <CTASection />
      </Sequence>
    </AbsoluteFill>
  );
};
