import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Audio, staticFile } from 'remotion';

// Brand colors
const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6', 
  dark: '#0f172a',
  darker: '#020617',
  light: '#f8fafc',
  accent: '#22c55e',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
};

// Animated typing effect
const TypeWriter = ({ text, startFrame, style }: { text: string; startFrame: number; style?: React.CSSProperties }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerSecond = 30;
  const framesSinceStart = Math.max(0, frame - startFrame);
  const charsToShow = Math.floor((framesSinceStart / fps) * charsPerSecond);
  const displayText = text.slice(0, charsToShow);
  const showCursor = framesSinceStart > 0 && charsToShow < text.length;
  
  return (
    <span style={style}>
      {displayText}
      {showCursor && <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>}
    </span>
  );
};

// Chat message bubble
const ChatBubble = ({ 
  message, 
  isUser, 
  delay,
  typing = false 
}: { 
  message: string; 
  isUser: boolean; 
  delay: number;
  typing?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  if (frame < delay) return null;
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px)`,
    }}>
      {!isUser && (
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: COLORS.gradient,
          marginRight: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>
          🤖
        </div>
      )}
      <div style={{
        background: isUser ? COLORS.primary : '#1e293b',
        color: 'white',
        padding: '14px 20px',
        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        maxWidth: '70%',
        fontSize: 18,
        lineHeight: 1.5,
      }}>
        {typing ? (
          <TypeWriter text={message} startFrame={delay + 10} />
        ) : message}
      </div>
    </div>
  );
};

// Scene 1: Hook
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleProgress = spring({ frame, fps, config: { damping: 12 } });
  const subtitleProgress = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{
        textAlign: 'center',
        transform: `scale(${titleProgress})`,
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 800,
          background: COLORS.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 24,
        }}>
          Turn Any Website Into
        </div>
        <div style={{
          fontSize: 80,
          fontWeight: 800,
          color: 'white',
          opacity: subtitleProgress,
          transform: `translateY(${(1 - subtitleProgress) * 30}px)`,
        }}>
          An AI Support Agent
        </div>
        <div style={{
          fontSize: 28,
          color: '#94a3b8',
          marginTop: 40,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          In under 2 minutes. No coding required.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Enter URL
const EnterURLScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const boxProgress = spring({ frame, fps, config: { damping: 12 } });
  const typingStart = 30;
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{
        transform: `scale(${boxProgress})`,
        width: '80%',
        maxWidth: 800,
      }}>
        <div style={{
          fontSize: 32,
          color: 'white',
          marginBottom: 30,
          textAlign: 'center',
        }}>
          Step 1: Enter your website URL
        </div>
        
        {/* URL Input */}
        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: 24,
          border: '2px solid #334155',
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ fontSize: 24, color: '#64748b' }}>🌐</div>
            <TypeWriter 
              text="https://mycompany.ae" 
              startFrame={typingStart}
              style={{ fontSize: 24, color: 'white', fontFamily: 'monospace' }}
            />
          </div>
          
          {/* Scan button appears */}
          {frame > 90 && (
            <div style={{
              marginTop: 20,
              background: COLORS.gradient,
              borderRadius: 12,
              padding: '16px 32px',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 600,
              color: 'white',
              opacity: spring({ frame: frame - 90, fps, config: { damping: 12 } }),
              transform: `scale(${spring({ frame: frame - 90, fps, config: { damping: 12 } })})`,
            }}>
              ✨ Scan Website
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Scanning Animation
const ScanningScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const items = [
    { icon: '📄', label: 'Homepage content', delay: 0 },
    { icon: '🛍️', label: 'Products & Services', delay: 20 },
    { icon: '❓', label: 'FAQ Detection', delay: 40 },
    { icon: '📞', label: 'Contact Information', delay: 60 },
    { icon: '💰', label: 'Pricing Details', delay: 80 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 700 }}>
        <div style={{
          fontSize: 32,
          color: 'white',
          marginBottom: 40,
        }}>
          🔍 AI is scanning your website...
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item, i) => {
            const progress = spring({ 
              frame: frame - item.delay, 
              fps, 
              config: { damping: 12 } 
            });
            const isDone = frame > item.delay + 40;
            
            return (
              <div key={i} style={{
                background: isDone ? 'rgba(34, 197, 94, 0.1)' : '#1e293b',
                borderRadius: 12,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: progress,
                transform: `translateX(${(1 - progress) * -50}px)`,
                border: isDone ? '1px solid #22c55e' : '1px solid #334155',
              }}>
                <div style={{ fontSize: 28 }}>{item.icon}</div>
                <div style={{ flex: 1, textAlign: 'left', color: 'white', fontSize: 20 }}>
                  {item.label}
                </div>
                {isDone && (
                  <div style={{ 
                    fontSize: 24, 
                    color: '#22c55e',
                    opacity: spring({ frame: frame - item.delay - 40, fps }),
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Live Chat Demo
const LiveChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const messages = [
    { text: "Hi! How can I help you today?", isUser: false, delay: 20, typing: true },
    { text: "What are your business hours?", isUser: true, delay: 80 },
    { text: "We're open Sunday to Thursday, 9 AM to 6 PM UAE time. On Fridays and Saturdays we're closed, but I'm available 24/7 to answer your questions! 😊", isUser: false, delay: 120, typing: true },
    { text: "Do you offer delivery?", isUser: true, delay: 220 },
    { text: "Yes! We offer free delivery across Dubai for orders over AED 200. For other emirates, delivery is AED 25. Would you like to place an order?", isUser: false, delay: 260, typing: true },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 600,
        background: '#0f172a',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Chat header */}
        <div style={{
          background: COLORS.gradient,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}>
            🤖
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 20 }}>
              MyCompany Support
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              ● Online - Typically replies instantly
            </div>
          </div>
        </div>
        
        {/* Chat messages */}
        <div style={{ padding: 24, minHeight: 400 }}>
          {messages.map((msg, i) => (
            <ChatBubble 
              key={i}
              message={msg.text}
              isUser={msg.isUser}
              delay={msg.delay}
              typing={msg.typing}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Video Call Feature
const VideoCallScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const pulse = Math.sin(frame * 0.1) * 0.02 + 1;
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{
        textAlign: 'center',
        transform: `scale(${scaleIn})`,
      }}>
        <div style={{
          fontSize: 36,
          color: 'white',
          marginBottom: 40,
        }}>
          Need more help? <span style={{ color: COLORS.primary }}>Video call</span> with AI
        </div>
        
        {/* Video call mockup */}
        <div style={{
          width: 500,
          height: 350,
          background: '#1e293b',
          borderRadius: 24,
          overflow: 'hidden',
          margin: '0 auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          transform: `scale(${pulse})`,
        }}>
          {/* AI Avatar */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: COLORS.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
            boxShadow: '0 0 60px rgba(99, 102, 241, 0.5)',
          }}>
            🤖
          </div>
          
          {/* Speaking animation */}
          <div style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 4,
          }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 6,
                height: interpolate(
                  Math.sin(frame * 0.3 + i * 0.8),
                  [-1, 1],
                  [10, 30]
                ),
                background: COLORS.primary,
                borderRadius: 3,
              }} />
            ))}
          </div>
          
          {/* Call controls */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 20,
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>🎤</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>📞</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>📹</div>
          </div>
        </div>
        
        <div style={{
          marginTop: 30,
          fontSize: 20,
          color: '#94a3b8',
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          Face-to-face AI support, whenever you need it
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: CTA
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scaleIn = spring({ frame, fps, config: { damping: 12 } });
  const buttonPulse = Math.sin(frame * 0.15) * 0.03 + 1;
  
  return (
    <AbsoluteFill style={{
      background: COLORS.gradient,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{
        textAlign: 'center',
        transform: `scale(${scaleIn})`,
      }}>
        <div style={{
          fontSize: 64,
          fontWeight: 800,
          color: 'white',
          marginBottom: 24,
        }}>
          Ready to get started?
        </div>
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: 50,
        }}>
          250 conversations free. No credit card required.
        </div>
        
        <div style={{
          display: 'inline-block',
          background: 'white',
          color: COLORS.primary,
          padding: '20px 48px',
          borderRadius: 16,
          fontSize: 24,
          fontWeight: 700,
          transform: `scale(${buttonPulse})`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}>
          Build Your Chatbot Free →
        </div>
        
        <div style={{
          marginTop: 40,
          color: 'rgba(255,255,255,0.8)',
          fontSize: 18,
        }}>
          smallerp.ae/chatbot
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const ChatbotBuilderDemo = () => {
  const { fps } = useVideoConfig();
  
  // Scene durations in seconds
  const scenes = [
    { component: HookScene, duration: 4 },
    { component: EnterURLScene, duration: 5 },
    { component: ScanningScene, duration: 5 },
    { component: LiveChatScene, duration: 14 },
    { component: VideoCallScene, duration: 5 },
    { component: CTAScene, duration: 4 },
  ];
  
  let currentFrame = 0;
  
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {scenes.map((scene, i) => {
        const start = currentFrame;
        const durationFrames = scene.duration * fps;
        currentFrame += durationFrames;
        
        return (
          <Sequence key={i} from={start} durationInFrames={durationFrames}>
            <scene.component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export default ChatbotBuilderDemo;
