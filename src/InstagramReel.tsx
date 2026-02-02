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
} from 'remotion';

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

// Hook section with person avatar and attention-grabbing text
const HookSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Pulsing effect for avatar
  const pulse = 1 + Math.sin(frame / 10) * 0.03;
  
  // Text animations
  const line1Opacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line1Y = interpolate(frame, [10, 25], [30, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  
  const line2Opacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
  const line2Y = interpolate(frame, [35, 50], [30, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  
  const line3Opacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line3Scale = spring({ frame: frame - 60, fps, config: { damping: 8, stiffness: 100 } });

  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      {/* Animated avatar/person placeholder */}
      <div style={{
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${theme.primary}, #8b5cf6)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 60px ${theme.primary}50`,
      }}>
        <span style={{ fontSize: 80 }}>👨‍💼</span>
      </div>
      
      {/* Hook text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          color: theme.danger,
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 20,
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
        }}>
          Still using Excel for your business?
        </div>
        
        <div style={{
          color: theme.muted,
          fontSize: 26,
          marginBottom: 30,
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
        }}>
          Here's what you're missing...
        </div>
        
        <div style={{
          color: theme.primary,
          fontSize: 42,
          fontWeight: 800,
          opacity: line3Opacity,
          transform: `scale(${line3Scale})`,
        }}>
          SmallERP ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Quick feature showcase (vertical phone mockup)
const FeatureShowcase: React.FC<{
  title: string;
  icon: string;
  points: string[];
  color: string;
}> = ({ title, icon, points, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 30,
        opacity: titleOpacity,
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}>
          {icon}
        </div>
        <div style={{ color: theme.text, fontSize: 32, fontWeight: 700 }}>{title}</div>
      </div>
      
      {/* Phone mockup */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '90%',
          maxWidth: 400,
          backgroundColor: theme.card,
          borderRadius: 40,
          padding: 20,
          border: `4px solid ${theme.border}`,
        }}>
          {/* Phone screen */}
          <div style={{
            backgroundColor: theme.bg,
            borderRadius: 30,
            padding: 30,
            minHeight: 500,
          }}>
            {/* Feature points */}
            {points.map((point, i) => {
              const delay = 20 + i * 20;
              const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const x = interpolate(frame - delay, [0, 15], [50, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
              
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 24,
                    opacity,
                    transform: `translateX(${x}px)`,
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 20,
                  }}>
                    ✓
                  </div>
                  <span style={{ color: theme.text, fontSize: 22, flex: 1 }}>{point}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Stats showcase with animated numbers
const StatsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  
  const stats = [
    { value: 500, suffix: '+', label: 'UAE Businesses', color: theme.primary },
    { value: 10, suffix: 'x', label: 'Faster Invoicing', color: theme.success },
    { value: 99, suffix: '%', label: 'VAT Compliant', color: theme.warning },
  ];
  
  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{
        color: theme.text,
        fontSize: 36,
        fontWeight: 700,
        marginBottom: 60,
        textAlign: 'center',
      }}>
        Trusted by UAE SMEs
      </div>
      
      {stats.map((stat, i) => {
        const delay = 20 + i * 30;
        const progress = interpolate(frame - delay, [0, 40], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        
        return (
          <div
            key={i}
            style={{
              marginBottom: 50,
              textAlign: 'center',
              opacity,
            }}
          >
            <div style={{
              fontSize: 72,
              fontWeight: 800,
              color: stat.color,
            }}>
              {Math.floor(stat.value * progress)}{stat.suffix}
            </div>
            <div style={{ color: theme.muted, fontSize: 24, marginTop: 8 }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// CTA section
const CTASection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame: frame - 20, fps, config: { damping: 8, stiffness: 80 } });
  const pulse = frame > 60 ? 1 + Math.sin((frame - 60) / 8) * 0.05 : 1;

  return (
    <AbsoluteFill style={{
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      {/* Logo */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        transform: `scale(${scale})`,
        boxShadow: `0 0 80px ${theme.primary}60`,
      }}>
        <span style={{ color: 'white', fontSize: 40, fontWeight: 800 }}>SE</span>
      </div>
      
      <div style={{
        color: theme.text,
        fontSize: 42,
        fontWeight: 700,
        marginBottom: 20,
        textAlign: 'center',
        opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Start Free Today
      </div>
      
      <div style={{
        color: theme.muted,
        fontSize: 24,
        marginBottom: 50,
        textAlign: 'center',
        opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        No credit card required
      </div>
      
      {/* CTA Button */}
      <div style={{
        backgroundColor: theme.primary,
        padding: '24px 60px',
        borderRadius: 20,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 ${pulse * 40}px ${theme.primary}80`,
        opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <span style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>
          smallerp.ae →
        </span>
      </div>
      
      {/* Social proof */}
      <div style={{
        marginTop: 60,
        color: theme.dim,
        fontSize: 18,
        opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        ⭐⭐⭐⭐⭐ Rated 4.9/5
      </div>
    </AbsoluteFill>
  );
};

// Main Instagram Reel component - 30 seconds total (900 frames at 30fps)
export const InstagramReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Hook - 0-4s (0-120 frames) */}
      <Sequence from={0} durationInFrames={120}>
        <HookSection />
      </Sequence>
      
      {/* Dashboard feature - 4-8s */}
      <Sequence from={120} durationInFrames={120}>
        <FeatureShowcase
          title="Dashboard"
          icon="📊"
          points={[
            "Real-time revenue",
            "All KPIs in one view",
            "Beautiful charts",
            "Mobile friendly",
          ]}
          color={theme.primary}
        />
      </Sequence>
      
      {/* Invoicing feature - 8-12s */}
      <Sequence from={240} durationInFrames={120}>
        <FeatureShowcase
          title="Invoicing"
          icon="📄"
          points={[
            "Create in seconds",
            "VAT auto-calculated",
            "Send instantly",
            "Track payments",
          ]}
          color={theme.success}
        />
      </Sequence>
      
      {/* AI Copilot feature - 12-16s */}
      <Sequence from={360} durationInFrames={120}>
        <FeatureShowcase
          title="AI Copilot"
          icon="✨"
          points={[
            "Ask anything",
            "Instant insights",
            "One-click actions",
            "Always available",
          ]}
          color="#8b5cf6"
        />
      </Sequence>
      
      {/* Stats - 16-22s */}
      <Sequence from={480} durationInFrames={180}>
        <StatsShowcase />
      </Sequence>
      
      {/* CTA - 22-30s */}
      <Sequence from={660} durationInFrames={240}>
        <CTASection />
      </Sequence>
    </AbsoluteFill>
  );
};
