import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, Sequence } from 'remotion';
import { RealEstateDubai } from './RealEstateDubai';

const COLORS = {
  primary: '#00a651',
  dark: '#0f172a',
  gradient: 'linear-gradient(135deg, #00a651 0%, #008c45 100%)',
};

const fontFamily = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif';

// Wrapper that shows original video in a laptop/browser mockup
export const RealEstateDubaiIGv2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Scene markers for text overlays
  const getSceneText = () => {
    if (frame < 240) return { title: '😤 The Problem', subtitle: 'Your chat sleeps at night' };
    if (frame < 480) return { title: '⚙️ Easy Setup', subtitle: '5 minutes to configure' };
    if (frame < 880) return { title: '🤖 AI Takes Over', subtitle: '24/7 instant responses' };
    if (frame < 1200) return { title: '📲 WhatsApp Alerts', subtitle: 'Leads sent instantly' };
    return { title: '🚀 Get Started', subtitle: 'leadflow.ae' };
  };
  
  const sceneText = getSceneText();
  
  return (
    <AbsoluteFill style={{ background: COLORS.dark, fontFamily }}>
      {/* Top section with text */}
      <div style={{ 
        height: 280, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '60px 40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: COLORS.primary, 
          fontSize: 22, 
          fontWeight: 700, 
          marginBottom: 12,
          opacity: spring({ frame: frame % 240, fps, config: { damping: 20 } })
        }}>
          {sceneText.title}
        </div>
        <div style={{ 
          color: 'white', 
          fontSize: 36, 
          fontWeight: 800, 
          lineHeight: 1.3,
          opacity: spring({ frame: (frame % 240) - 10, fps, config: { damping: 20 } })
        }}>
          {sceneText.subtitle}
        </div>
      </div>
      
      {/* Browser/Laptop mockup containing the original video */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        padding: '0 24px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 1000,
          background: '#1e293b', 
          borderRadius: 20, 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Browser chrome */}
          <div style={{ 
            background: '#334155', 
            padding: '12px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8 
          }}>
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            {/* URL bar */}
            <div style={{ 
              flex: 1, 
              background: '#1e293b', 
              borderRadius: 6, 
              padding: '6px 12px',
              marginLeft: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: '#22c55e', fontSize: 12 }}>🔒</span>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>propertyfinder.ae</span>
            </div>
          </div>
          
          {/* Video content area - scaled to fit */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            background: '#0f172a'
          }}>
            {/* The original video composition */}
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}>
              <RealEstateDubai />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with branding */}
      <div style={{ 
        height: 280, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px 40px 80px'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: 16,
          opacity: spring({ frame: frame - 30, fps })
        }}>
          <div style={{ 
            width: 50, 
            height: 50, 
            borderRadius: 12, 
            background: COLORS.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: 26 }}>🤖</span>
          </div>
          <span style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>LeadFlow AI</span>
        </div>
        
        {/* CTA */}
        <div style={{ 
          background: COLORS.gradient, 
          padding: '14px 32px', 
          borderRadius: 12,
          opacity: spring({ frame: frame - 60, fps })
        }}>
          <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Try Free → leadflow.ae</span>
        </div>
        
        {/* Features */}
        <div style={{ 
          display: 'flex', 
          gap: 24, 
          marginTop: 20,
          opacity: spring({ frame: frame - 90, fps })
        }}>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>✓ No credit card</span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>✓ 5 min setup</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
