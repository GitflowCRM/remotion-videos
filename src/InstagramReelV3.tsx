import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  Sequence,
  Img,
  staticFile,
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
  return <div style={{ opacity, transform: `translateY(${(1 - progress) * 20}px)` }}>{children}</div>;
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

// Phone wrapper component
const PhoneWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Subtle floating animation
  const float = Math.sin(frame / 40) * 5;
  const scale = spring({ frame, fps, config: { damping: 20, stiffness: 60 } });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, ${theme.primary}20 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, #8b5cf620 0%, transparent 50%)
        `,
      }} />
      
      {/* Phone container */}
      <div style={{
        position: 'relative',
        width: 420,
        height: 850,
        transform: `translateY(${float}px) scale(${0.9 + scale * 0.1})`,
      }}>
        {/* Screen content - positioned inside the phone */}
        <div style={{
          position: 'absolute',
          top: 18,
          left: 18,
          right: 18,
          bottom: 18,
          borderRadius: 45,
          overflow: 'hidden',
          backgroundColor: theme.bg,
        }}>
          {children}
        </div>
        
        {/* Phone frame overlay */}
        <Img
          src={staticFile('phone-frame.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Hook screen (inside phone)
const HookScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame: frame - 20, fps: 30, config: { damping: 8, stiffness: 100 } });

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      backgroundColor: theme.bg,
    }}>
      <div style={{
        color: theme.text,
        fontSize: 26,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 16,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Running a business<br />in the UAE?
      </div>
      
      <div style={{
        color: theme.muted,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        opacity: interpolate(frame - 30, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Your all-in-one solution
      </div>
      
      <div style={{
        width: 90,
        height: 90,
        borderRadius: 24,
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${logoScale})`,
        boxShadow: `0 0 60px ${theme.primary}50`,
      }}>
        <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>SE</span>
      </div>
      
      <div style={{
        color: theme.text,
        fontSize: 22,
        fontWeight: 700,
        marginTop: 20,
        opacity: interpolate(frame - 60, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        SmallERP
      </div>
    </div>
  );
};

// Dashboard screen
const DashboardScreen: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <div style={{
      height: '100%',
      padding: 20,
      backgroundColor: theme.bg,
      overflow: 'hidden',
    }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: theme.primary, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>📊 DASHBOARD</div>
          <div style={{ color: theme.text, fontSize: 20, fontWeight: 700 }}>Your Business</div>
        </div>
      </AnimatedEntry>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '💰', value: 125750, label: 'Revenue', delay: 15 },
          { icon: '📄', value: 48, label: 'Invoices', delay: 25 },
          { icon: '👥', value: 156, label: 'Customers', delay: 35 },
          { icon: '📦', value: 324, label: 'Products', delay: 45 },
        ].map((kpi, i) => (
          <AnimatedEntry key={i} delay={kpi.delay}>
            <Card>
              <CardContent style={{ padding: 12 }}>
                <span style={{ fontSize: 18 }}>{kpi.icon}</span>
                <div style={{ color: theme.text, fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {kpi.label === 'Revenue' ? 'AED ' : ''}<AnimatedNumber value={kpi.value} delay={kpi.delay + 15} />
                </div>
                <div style={{ color: theme.dim, fontSize: 11 }}>{kpi.label}</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
        ))}
      </div>

      {/* Mini chart */}
      <AnimatedEntry delay={60}>
        <Card>
          <CardContent style={{ padding: 12 }}>
            <div style={{ color: theme.muted, fontSize: 11, marginBottom: 8 }}>Revenue Trend</div>
            <MiniChart delay={70} />
          </CardContent>
        </Card>
      </AnimatedEntry>
    </div>
  );
};

// Mini chart
const MiniChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const points = [30, 45, 35, 55, 50, 70, 65, 85];
  const w = 300, h = 80;
  
  const progress = interpolate(frame - delay, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / 100) * h;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </linearGradient>
        <clipPath id="miniClip">
          <rect x="0" y="0" width={w * progress} height={h} />
        </clipPath>
      </defs>
      <g clipPath="url(#miniClip)">
        <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#miniGrad)" />
        <path d={path} fill="none" stroke={theme.primary} strokeWidth="2.5" />
      </g>
    </svg>
  );
};

// Invoice screen
const InvoiceScreen: React.FC = () => {
  const frame = useCurrentFrame();
  
  const items = [
    { name: 'Web Development', amount: 5000 },
    { name: 'UI/UX Design', amount: 2500 },
    { name: 'Hosting (12 mo)', amount: 600 },
  ];
  
  return (
    <div style={{
      height: '100%',
      padding: 20,
      backgroundColor: theme.bg,
    }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: theme.success, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>📄 INVOICES</div>
          <div style={{ color: theme.text, fontSize: 20, fontWeight: 700 }}>Create in Seconds</div>
        </div>
      </AnimatedEntry>

      <AnimatedEntry delay={15}>
        <Card>
          <CardContent style={{ padding: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${theme.border}` }}>
              <Avatar name="Acme Corp" size="sm" />
              <div>
                <div style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>Acme Corporation</div>
                <div style={{ color: theme.dim, fontSize: 11 }}>INV-2024-0048</div>
              </div>
            </div>
            
            {/* Items */}
            {items.map((item, i) => {
              const itemDelay = 40 + i * 15;
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: `1px solid ${theme.border}`,
                  opacity: interpolate(frame - itemDelay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}>
                  <span style={{ color: theme.muted, fontSize: 13 }}>{item.name}</span>
                  <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>AED {item.amount.toLocaleString()}</span>
                </div>
              );
            })}
            
            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 16,
              marginTop: 8,
              opacity: interpolate(frame - 100, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <span style={{ color: theme.text, fontSize: 16, fontWeight: 600 }}>Total</span>
              <span style={{ color: theme.primary, fontSize: 22, fontWeight: 700 }}>
                AED <AnimatedNumber value={8505} delay={105} />
              </span>
            </div>
          </CardContent>
        </Card>
      </AnimatedEntry>
      
      <AnimatedEntry delay={120}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Badge variant="success" style={{ padding: '8px 16px' }}>✓ VAT Auto-Calculated</Badge>
        </div>
      </AnimatedEntry>
    </div>
  );
};

// Copilot screen
const CopilotScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const aiTyping = frame >= 50 && frame < 75;
  
  return (
    <div style={{
      height: '100%',
      padding: 20,
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#8b5cf6', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>✨ AI COPILOT</div>
          <div style={{ color: theme.text, fontSize: 20, fontWeight: 700 }}>Just Ask</div>
        </div>
      </AnimatedEntry>

      {/* Chat */}
      <div style={{ flex: 1 }}>
        {/* User message */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 12,
          opacity: interpolate(frame - 20, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            backgroundColor: theme.primary,
            padding: '10px 14px',
            borderRadius: '16px 16px 4px 16px',
            maxWidth: '85%',
          }}>
            <span style={{ color: 'white', fontSize: 14 }}>Show unpaid invoices</span>
          </div>
        </div>
        
        {/* AI response */}
        <div style={{
          display: 'flex',
          gap: 8,
          opacity: frame >= 50 ? 1 : 0,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.primary}, #8b5cf6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
          </div>
          
          <div style={{
            backgroundColor: theme.card,
            padding: '10px 14px',
            borderRadius: '16px 16px 16px 4px',
            flex: 1,
          }}>
            {aiTyping ? (
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: theme.dim,
                    transform: `translateY(${Math.sin((frame + i * 5) / 5) * 3}px)`,
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ opacity: interpolate(frame - 75, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                <span style={{ color: theme.text, fontSize: 13 }}>
                  Found <strong>3 unpaid</strong> = <strong style={{ color: theme.primary }}>AED 24,750</strong>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Invoice cards */}
        {frame >= 90 && (
          <div style={{ marginLeft: 40, marginTop: 10 }}>
            {[
              { name: 'Acme Corp', amount: 12500 },
              { name: 'Tech Solutions', amount: 7250 },
              { name: 'Global Trade', amount: 5000 },
            ].map((inv, i) => (
              <Card key={i} style={{
                marginBottom: 6,
                opacity: interpolate(frame - (90 + i * 12), [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}>
                <CardContent style={{ padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={inv.name} size="xs" />
                      <span style={{ color: theme.text, fontSize: 12 }}>{inv.name}</span>
                    </div>
                    <span style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>AED {inv.amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// CTA screen
const CTAScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 80 } });
  const pulse = frame > 70 ? 1 + Math.sin((frame - 70) / 8) * 0.04 : 1;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      backgroundColor: theme.bg,
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 22,
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        transform: `scale(${logoScale})`,
        boxShadow: `0 0 50px ${theme.primary}50`,
      }}>
        <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>SE</span>
      </div>
      
      <div style={{
        color: theme.text,
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 10,
        opacity: interpolate(frame - 25, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Start Free Today
      </div>
      
      <div style={{
        color: theme.muted,
        fontSize: 14,
        marginBottom: 30,
        opacity: interpolate(frame - 40, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        No credit card required
      </div>
      
      <div style={{
        backgroundColor: theme.primary,
        padding: '14px 36px',
        borderRadius: 14,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 ${pulse * 30}px ${theme.primary}70`,
        opacity: interpolate(frame - 55, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>smallerp.ae →</span>
      </div>
    </div>
  );
};

// Main component - 30 seconds
export const InstagramReelV3: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Hook in phone - 0-4s */}
      <Sequence from={0} durationInFrames={120}>
        <PhoneWrapper><HookScreen /></PhoneWrapper>
      </Sequence>
      
      {/* Dashboard in phone - 4-10s */}
      <Sequence from={120} durationInFrames={180}>
        <PhoneWrapper><DashboardScreen /></PhoneWrapper>
      </Sequence>
      
      {/* Invoice in phone - 10-16s */}
      <Sequence from={300} durationInFrames={180}>
        <PhoneWrapper><InvoiceScreen /></PhoneWrapper>
      </Sequence>
      
      {/* Copilot in phone - 16-24s */}
      <Sequence from={480} durationInFrames={240}>
        <PhoneWrapper><CopilotScreen /></PhoneWrapper>
      </Sequence>
      
      {/* CTA in phone - 24-30s */}
      <Sequence from={720} durationInFrames={180}>
        <PhoneWrapper><CTAScreen /></PhoneWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};
