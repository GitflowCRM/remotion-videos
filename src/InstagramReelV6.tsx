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
  CardContent,
  Avatar,
  Badge,
} from './components';

const fontFamily = "'Poppins', system-ui, -apple-system, sans-serif";

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

// Subtitle component with animation
const Subtitle: React.FC<{ text: string; startFrame: number; endFrame: number }> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  
  if (frame < startFrame || frame > endFrame) return null;
  
  const fadeIn = interpolate(frame - startFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame - (endFrame - 8), [0, 8], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(frame - startFrame, [0, 8], [0.95, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute',
      bottom: 180,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 40px',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '14px 24px',
        borderRadius: 12,
        opacity,
        transform: `scale(${scale})`,
      }}>
        <span style={{
          color: 'white',
          fontSize: 28,
          fontWeight: 600,
          fontFamily,
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}>
          {text}
        </span>
      </div>
    </div>
  );
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

// iPhone Frame
const IPhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const float = Math.sin(frame / 40) * 8;
  const scale = spring({ frame, fps, config: { damping: 20, stiffness: 60 } });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#050510',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
    }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}
      </style>
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 30%, ${theme.primary}25 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, #8b5cf625 0%, transparent 50%)
        `,
      }} />
      
      <div style={{
        position: 'relative',
        transform: `translateY(${float}px) scale(${0.85 + scale * 0.15})`,
      }}>
        <div style={{
          width: 380,
          height: 780,
          borderRadius: 55,
          background: 'linear-gradient(145deg, #e8e8e8 0%, #b8b8b8 50%, #9a9a9a 100%)',
          padding: 4,
          boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 52,
            backgroundColor: '#1a1a1a',
            padding: 12,
            position: 'relative',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 42,
              overflow: 'hidden',
              backgroundColor: theme.bg,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 120,
                height: 34,
                backgroundColor: '#000',
                borderRadius: 20,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#1a1a2e',
                  border: '2px solid #2a2a3e',
                }} />
              </div>
              
              <div style={{ width: '100%', height: '100%', paddingTop: 50 }}>
                {children}
              </div>
              
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 140,
                height: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 3,
              }} />
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', left: -3, top: 140, width: 4, height: 35, backgroundColor: '#b8b8b8', borderRadius: '3px 0 0 3px' }} />
        <div style={{ position: 'absolute', left: -3, top: 190, width: 4, height: 60, backgroundColor: '#b8b8b8', borderRadius: '3px 0 0 3px' }} />
        <div style={{ position: 'absolute', left: -3, top: 260, width: 4, height: 60, backgroundColor: '#b8b8b8', borderRadius: '3px 0 0 3px' }} />
        <div style={{ position: 'absolute', right: -3, top: 200, width: 4, height: 80, backgroundColor: '#b8b8b8', borderRadius: '0 3px 3px 0' }} />
      </div>
    </AbsoluteFill>
  );
};

// Screen components (same as V5 but condensed)
const HookScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame: frame - 20, fps: 30, config: { damping: 8, stiffness: 100 } });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: theme.bg, fontFamily }}>
      <div style={{ color: theme.text, fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 12, opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }), fontFamily }}>
        Running a business<br />in the UAE?
      </div>
      <div style={{ color: theme.muted, fontSize: 15, textAlign: 'center', marginBottom: 30, opacity: interpolate(frame - 30, [0, 15], [0, 1], { extrapolateRight: 'clamp' }), fontFamily }}>
        Your all-in-one solution
      </div>
      <div style={{ width: 80, height: 80, borderRadius: 22, backgroundColor: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${logoScale})`, boxShadow: `0 0 50px ${theme.primary}50` }}>
        <span style={{ color: 'white', fontSize: 28, fontWeight: 700, fontFamily }}>SE</span>
      </div>
      <div style={{ color: theme.text, fontSize: 20, fontWeight: 600, marginTop: 16, opacity: interpolate(frame - 60, [0, 15], [0, 1], { extrapolateRight: 'clamp' }), fontFamily }}>
        SmallERP
      </div>
    </div>
  );
};

const DashboardScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ height: '100%', padding: 16, backgroundColor: theme.bg, overflow: 'hidden', fontFamily }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: theme.primary, fontSize: 10, fontWeight: 600, marginBottom: 2 }}>📊 DASHBOARD</div>
          <div style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>Your Business</div>
        </div>
      </AnimatedEntry>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[
          { icon: '💰', value: 125750, label: 'Revenue', delay: 15 },
          { icon: '📄', value: 48, label: 'Invoices', delay: 25 },
          { icon: '👥', value: 156, label: 'Customers', delay: 35 },
          { icon: '📦', value: 324, label: 'Products', delay: 45 },
        ].map((kpi, i) => (
          <AnimatedEntry key={i} delay={kpi.delay}>
            <Card><CardContent style={{ padding: 10 }}>
              <span style={{ fontSize: 16 }}>{kpi.icon}</span>
              <div style={{ color: theme.text, fontSize: 16, fontWeight: 600, marginTop: 2, fontFamily }}>
                {kpi.label === 'Revenue' ? 'AED ' : ''}<AnimatedNumber value={kpi.value} delay={kpi.delay + 15} />
              </div>
              <div style={{ color: theme.dim, fontSize: 10, fontFamily }}>{kpi.label}</div>
            </CardContent></Card>
          </AnimatedEntry>
        ))}
      </div>
      <AnimatedEntry delay={60}>
        <Card><CardContent style={{ padding: 10 }}>
          <div style={{ color: theme.muted, fontSize: 10, marginBottom: 6, fontFamily }}>Revenue Trend</div>
          <MiniChart delay={70} />
        </CardContent></Card>
      </AnimatedEntry>
    </div>
  );
};

const MiniChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const points = [30, 45, 35, 55, 50, 70, 65, 85];
  const w = 280, h = 70;
  const progress = interpolate(frame - delay, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${h - (p / 100) * h}`).join(' ');
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id="mg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" /><stop offset="100%" stopColor={theme.primary} stopOpacity="0" /></linearGradient>
        <clipPath id="mc6"><rect x="0" y="0" width={w * progress} height={h} /></clipPath>
      </defs>
      <g clipPath="url(#mc6)">
        <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#mg6)" />
        <path d={path} fill="none" stroke={theme.primary} strokeWidth="2" />
      </g>
    </svg>
  );
};

const InvoiceScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [{ name: 'Web Development', amount: 5000 }, { name: 'UI/UX Design', amount: 2500 }, { name: 'Hosting (12 mo)', amount: 600 }];
  return (
    <div style={{ height: '100%', padding: 16, backgroundColor: theme.bg, fontFamily }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: theme.success, fontSize: 10, fontWeight: 600, marginBottom: 2 }}>📄 INVOICES</div>
          <div style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>Create in Seconds</div>
        </div>
      </AnimatedEntry>
      <AnimatedEntry delay={15}>
        <Card><CardContent style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${theme.border}` }}>
            <Avatar name="Acme Corp" size="sm" />
            <div>
              <div style={{ color: theme.text, fontSize: 13, fontWeight: 600, fontFamily }}>Acme Corporation</div>
              <div style={{ color: theme.dim, fontSize: 10, fontFamily }}>INV-2024-0048</div>
            </div>
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${theme.border}`, opacity: interpolate(frame - (40 + i * 15), [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              <span style={{ color: theme.muted, fontSize: 12, fontFamily }}>{item.name}</span>
              <span style={{ color: theme.text, fontSize: 12, fontWeight: 600, fontFamily }}>AED {item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, opacity: interpolate(frame - 100, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <span style={{ color: theme.text, fontSize: 14, fontWeight: 600, fontFamily }}>Total</span>
            <span style={{ color: theme.primary, fontSize: 20, fontWeight: 700, fontFamily }}>AED <AnimatedNumber value={8505} delay={105} /></span>
          </div>
        </CardContent></Card>
      </AnimatedEntry>
      <AnimatedEntry delay={120}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Badge variant="success" style={{ padding: '6px 12px', fontSize: 11, fontFamily }}>✓ VAT Auto-Calculated</Badge>
        </div>
      </AnimatedEntry>
    </div>
  );
};

const CopilotScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const aiTyping = frame >= 50 && frame < 75;
  return (
    <div style={{ height: '100%', padding: 16, backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', fontFamily }}>
      <AnimatedEntry delay={0}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#8b5cf6', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>✨ AI COPILOT</div>
          <div style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>Just Ask</div>
        </div>
      </AnimatedEntry>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, opacity: interpolate(frame - 20, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ backgroundColor: theme.primary, padding: '8px 12px', borderRadius: '14px 14px 4px 14px', maxWidth: '85%' }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 500, fontFamily }}>Show unpaid invoices</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, opacity: frame >= 50 ? 1 : 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.primary}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12 }}>✨</span>
          </div>
          <div style={{ backgroundColor: theme.card, padding: '8px 12px', borderRadius: '14px 14px 14px 4px', flex: 1 }}>
            {aiTyping ? (
              <div style={{ display: 'flex', gap: 3 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.dim, transform: `translateY(${Math.sin((frame + i * 5) / 5) * 3}px)` }} />)}</div>
            ) : (
              <div style={{ opacity: interpolate(frame - 75, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                <span style={{ color: theme.text, fontSize: 12, fontFamily }}>Found <strong>3</strong> = <strong style={{ color: theme.primary }}>AED 24,750</strong></span>
              </div>
            )}
          </div>
        </div>
        {frame >= 90 && (
          <div style={{ marginLeft: 34, marginTop: 8 }}>
            {[{ name: 'Acme Corp', amount: 12500 }, { name: 'Tech Solutions', amount: 7250 }, { name: 'Global Trade', amount: 5000 }].map((inv, i) => (
              <Card key={i} style={{ marginBottom: 4, opacity: interpolate(frame - (90 + i * 12), [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                <CardContent style={{ padding: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar name={inv.name} size="xs" />
                      <span style={{ color: theme.text, fontSize: 11, fontWeight: 500, fontFamily }}>{inv.name}</span>
                    </div>
                    <span style={{ color: theme.text, fontSize: 11, fontWeight: 600, fontFamily }}>AED {inv.amount.toLocaleString()}</span>
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

const CTAScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 80 } });
  const pulse = frame > 70 ? 1 + Math.sin((frame - 70) / 8) * 0.04 : 1;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: theme.bg, fontFamily }}>
      <div style={{ width: 70, height: 70, borderRadius: 20, backgroundColor: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, transform: `scale(${logoScale})`, boxShadow: `0 0 40px ${theme.primary}50` }}>
        <span style={{ color: 'white', fontSize: 24, fontWeight: 700, fontFamily }}>SE</span>
      </div>
      <div style={{ color: theme.text, fontSize: 22, fontWeight: 600, marginBottom: 8, opacity: interpolate(frame - 25, [0, 15], [0, 1], { extrapolateRight: 'clamp' }), fontFamily }}>Start Free Today</div>
      <div style={{ color: theme.muted, fontSize: 13, marginBottom: 24, opacity: interpolate(frame - 40, [0, 15], [0, 1], { extrapolateRight: 'clamp' }), fontFamily }}>No credit card required</div>
      <div style={{ backgroundColor: theme.primary, padding: '12px 28px', borderRadius: 12, transform: `scale(${pulse})`, boxShadow: `0 0 ${pulse * 25}px ${theme.primary}70`, opacity: interpolate(frame - 55, [0, 15], [0, 1], { extrapolateRight: 'clamp' }) }}>
        <span style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily }}>smallerp.ae →</span>
      </div>
    </div>
  );
};

// Subtitles - timed to voiceover (at 30fps)
// VO: "Running a business in the UAE? Here's your all-in-one solution. SmallERP gives you real-time visibility — revenue, invoices, customers, inventory — one dashboard. Create VAT-compliant invoices in seconds. And with AI Copilot, just ask: show me unpaid invoices. Instant answers, one-click actions. Start free at smallerp.ae."
const subtitles = [
  { text: "Running a business in the UAE?", start: 15, end: 90 },
  { text: "Here's your all-in-one solution", start: 96, end: 165 },
  { text: "SmallERP gives you real-time visibility", start: 171, end: 255 },
  { text: "Revenue, invoices, customers, inventory", start: 261, end: 360 },
  { text: "One dashboard", start: 366, end: 420 },
  { text: "Create VAT-compliant invoices in seconds", start: 426, end: 525 },
  { text: "And with AI Copilot, just ask:", start: 531, end: 600 },
  { text: "\"Show me unpaid invoices\"", start: 606, end: 675 },
  { text: "Instant answers, one-click actions", start: 681, end: 765 },
  { text: "Start free at smallerp.ae", start: 771, end: 840 },
];

// Main component with subtitles
export const InstagramReelV6: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sequence from={0} durationInFrames={120}>
        <IPhoneFrame><HookScreen /></IPhoneFrame>
      </Sequence>
      <Sequence from={120} durationInFrames={180}>
        <IPhoneFrame><DashboardScreen /></IPhoneFrame>
      </Sequence>
      <Sequence from={300} durationInFrames={180}>
        <IPhoneFrame><InvoiceScreen /></IPhoneFrame>
      </Sequence>
      <Sequence from={480} durationInFrames={240}>
        <IPhoneFrame><CopilotScreen /></IPhoneFrame>
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <IPhoneFrame><CTAScreen /></IPhoneFrame>
      </Sequence>
      
      {/* Subtitles overlay */}
      {subtitles.map((sub, i) => (
        <Subtitle key={i} text={sub.text} startFrame={sub.start} endFrame={sub.end} />
      ))}
    </AbsoluteFill>
  );
};
