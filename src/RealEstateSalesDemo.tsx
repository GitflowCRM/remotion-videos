import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from 'remotion';

const COLORS = {
  primary: '#0ea5e9', // Sky blue - real estate vibe
  secondary: '#06b6d4',
  gold: '#f59e0b',
  dark: '#0f172a',
  darker: '#020617',
  accent: '#22c55e',
  gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
};

// Typing dots indicator
const TypingIndicator = ({ startFrame, duration }: { startFrame: number; duration: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (frame < startFrame || frame > startFrame + duration) return null;
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 14,
      opacity: progress,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: COLORS.gradient,
        marginRight: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}>
        🏠
      </div>
      <div style={{
        background: '#1e293b',
        padding: '14px 20px',
        borderRadius: '18px 18px 18px 4px',
        display: 'flex',
        gap: 6,
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#64748b',
              opacity: interpolate(
                Math.sin((frame - startFrame) * 0.3 + i * 1.2),
                [-1, 1],
                [0.3, 1]
              ),
              transform: `translateY(${Math.sin((frame - startFrame) * 0.3 + i * 1.2) * -3}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Typing animation
const TypeWriter = ({ text, startFrame, style }: { text: string; startFrame: number; style?: React.CSSProperties }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerSecond = 40;
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

// Chat bubble component
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
      marginBottom: 14,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px)`,
    }}>
      {!isUser && (
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: COLORS.gradient,
          marginRight: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          🏠
        </div>
      )}
      <div style={{
        background: isUser ? COLORS.primary : '#1e293b',
        color: 'white',
        padding: '12px 18px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        maxWidth: '75%',
        fontSize: 16,
        lineHeight: 1.5,
      }}>
        {typing ? (
          <TypeWriter text={message} startFrame={delay + 8} />
        ) : message}
      </div>
    </div>
  );
};

// Scene 1: Hook - Real Estate Focus
const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleProgress = spring({ frame, fps, config: { damping: 12 } });
  const subtitleProgress = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ textAlign: 'center', transform: `scale(${titleProgress})` }}>
        <div style={{ fontSize: 50, marginBottom: 15 }}>🏢</div>
        <div style={{
          fontSize: 58,
          fontWeight: 800,
          background: COLORS.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 20,
        }}>
          Dubai Real Estate Agents
        </div>
        <div style={{
          fontSize: 52,
          fontWeight: 800,
          color: 'white',
          opacity: subtitleProgress,
          transform: `translateY(${(1 - subtitleProgress) * 30}px)`,
        }}>
          Never Miss a Lead Again
        </div>
        <div style={{
          fontSize: 24,
          color: '#94a3b8',
          marginTop: 35,
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          AI chatbot that works 24/7 — even at 2am 🌙
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Problem - After Hours
const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const items = [
    { icon: '🌙', text: '68% of property inquiries come after office hours', delay: 0 },
    { icon: '😴', text: "You're sleeping... leads go to competitors", delay: 30 },
    { icon: '💸', text: 'Each lost lead = AED 15-50K commission gone', delay: 60 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ width: '100%', maxWidth: 700 }}>
        <div style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#ef4444',
          marginBottom: 40,
          textAlign: 'center',
        }}>
          The Problem ⚠️
        </div>
        
        {items.map((item, i) => {
          const progress = spring({ frame: frame - item.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 25,
              opacity: progress,
              transform: `translateX(${(1 - progress) * -50}px)`,
            }}>
              <div style={{ fontSize: 40 }}>{item.icon}</div>
              <div style={{ fontSize: 24, color: 'white' }}>{item.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: After Hours Demo - 2:47 AM
const AfterHoursChat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const pages = [
    {
      startFrame: 0,
      endFrame: 300,
      messages: [
        { text: "Hi! I'm looking for a 2BR apartment in Dubai Marina, budget around 120K/year", isUser: true, delay: 20 },
        { text: "Hello! 🏠 Great choice - Marina is very popular! I have 12 properties matching your criteria. Would you like waterfront or city view?", isUser: false, delay: 80, typing: true, typingDots: 30 },
        { text: "Waterfront please, and I need parking", isUser: true, delay: 180 },
        { text: "Perfect! I found 5 waterfront units with parking. Can I schedule a viewing for you tomorrow?", isUser: false, delay: 240, typing: true, typingDots: 25 },
      ]
    },
    {
      startFrame: 300,
      endFrame: 520,
      messages: [
        { text: "Yes! Anytime after 5pm works", isUser: true, delay: 20 },
        { text: "Great! I'll book you for 6pm tomorrow. Just need a few details - your name?", isUser: false, delay: 70, typing: true, typingDots: 25 },
        { text: "Sarah Johnson", isUser: true, delay: 140 },
        { text: "Nice to meet you Sarah! Your phone number for the agent?", isUser: false, delay: 180, typing: true, typingDots: 20 },
      ]
    },
    {
      startFrame: 520,
      endFrame: 750,
      messages: [
        { text: "+971 55 123 4567", isUser: true, delay: 20 },
        { text: "Perfect! ✅ Viewing confirmed for tomorrow 6pm. Our agent Ahmed will call you by 10am to confirm. Property details sent to your WhatsApp!", isUser: false, delay: 70, typing: true, typingDots: 30 },
      ]
    },
  ];
  
  const getPageOpacity = (page: typeof pages[0], index: number) => {
    const fadeFrames = 15;
    if (frame < page.startFrame - fadeFrames) return 0;
    if (frame < page.startFrame) {
      return interpolate(frame, [page.startFrame - fadeFrames, page.startFrame], [0, 1]);
    }
    if (frame < page.endFrame - fadeFrames) return 1;
    if (frame < page.endFrame) {
      if (index < pages.length - 1) {
        return interpolate(frame, [page.endFrame - fadeFrames, page.endFrame], [1, 0]);
      }
      return 1;
    }
    if (index === pages.length - 1) return 1;
    return 0;
  };
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 550,
        background: '#0f172a',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Chat header with time */}
        <div style={{
          background: COLORS.gradient,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}>
              🏢
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>
                Marina Properties
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                ● Online 24/7
              </div>
            </div>
          </div>
          {/* Time indicator */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🌙</span>
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>2:47 AM</span>
          </div>
        </div>
        
        {/* Chat messages */}
        <div style={{ padding: 20, height: 420, overflow: 'hidden', position: 'relative' }}>
          {pages.map((page, pageIndex) => {
            const pageOpacity = getPageOpacity(page, pageIndex);
            if (pageOpacity === 0) return null;
            
            return (
              <div 
                key={pageIndex}
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  opacity: pageOpacity,
                }}
              >
                {page.messages.map((msg, i) => (
                  <div key={i}>
                    {!msg.isUser && msg.typingDots && (
                      <TypingIndicator 
                        startFrame={page.startFrame + msg.delay - msg.typingDots}
                        duration={msg.typingDots - 5}
                      />
                    )}
                    <ChatBubble 
                      message={msg.text}
                      isUser={msg.isUser}
                      delay={page.startFrame + msg.delay}
                      typing={msg.typing}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Lead Notification
const LeadNotificationScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const notifProgress = spring({ frame, fps, config: { damping: 12 } });
  const phoneProgress = spring({ frame: frame - 30, fps, config: { damping: 10 } });
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 28,
          color: '#94a3b8',
          marginBottom: 30,
          opacity: notifProgress,
        }}>
          Meanwhile, you wake up to...
        </div>
        
        {/* Phone mockup */}
        <div style={{
          background: '#1e293b',
          borderRadius: 30,
          padding: 15,
          width: 320,
          margin: '0 auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          transform: `scale(${phoneProgress})`,
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 20,
            padding: 20,
          }}>
            {/* Notification */}
            <div style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 16,
              padding: 18,
              marginBottom: 15,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>🔔</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>New Lead!</div>
              </div>
              <div style={{ color: 'white', fontSize: 15, lineHeight: 1.5 }}>
                <strong>Sarah Johnson</strong><br />
                2BR Marina Waterfront<br />
                Viewing: Tomorrow 6pm<br />
                📱 +971 55 123 4567
              </div>
            </div>
            
            {/* Time */}
            <div style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: 14,
            }}>
              Captured at 2:47 AM while you slept 😴
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Benefits
const BenefitsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const benefits = [
    { icon: '🌙', text: '24/7 Lead Capture', delay: 0 },
    { icon: '⚡', text: 'Instant Response (<3 sec)', delay: 20 },
    { icon: '📅', text: 'Auto-Schedule Viewings', delay: 40 },
    { icon: '📱', text: 'WhatsApp Integration', delay: 60 },
    { icon: '🎯', text: 'Qualified Leads Only', delay: 80 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{
          fontSize: 36,
          fontWeight: 700,
          color: 'white',
          marginBottom: 40,
          textAlign: 'center',
        }}>
          Built for Dubai Real Estate 🏢
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15, justifyContent: 'center' }}>
          {benefits.map((benefit, i) => {
            const progress = spring({ frame: frame - benefit.delay, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{
                background: '#1e293b',
                borderRadius: 16,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: progress,
                transform: `scale(${progress})`,
                border: '1px solid #334155',
              }}>
                <span style={{ fontSize: 26 }}>{benefit.icon}</span>
                <span style={{ color: 'white', fontSize: 17, fontWeight: 500 }}>{benefit.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: CTA
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const mainProgress = spring({ frame, fps, config: { damping: 12 } });
  const buttonProgress = spring({ frame: frame - 20, fps, config: { damping: 10 } });
  const pulseScale = 1 + Math.sin(frame * 0.15) * 0.03;
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ textAlign: 'center', transform: `scale(${mainProgress})` }}>
        <div style={{ fontSize: 50, marginBottom: 20 }}>🏢</div>
        <div style={{
          fontSize: 44,
          fontWeight: 800,
          color: 'white',
          marginBottom: 15,
        }}>
          Stop Losing Leads
        </div>
        <div style={{
          fontSize: 28,
          color: '#94a3b8',
          marginBottom: 40,
        }}>
          Let AI work while you sleep
        </div>
        
        <div style={{
          background: COLORS.gradient,
          padding: '20px 50px',
          borderRadius: 16,
          display: 'inline-block',
          transform: `scale(${buttonProgress * pulseScale})`,
          boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
        }}>
          <div style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
            Try Free for 14 Days
          </div>
        </div>
        
        <div style={{
          marginTop: 30,
          fontSize: 18,
          color: '#64748b',
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          smallerp.ae/real-estate
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const RealEstateSalesDemo = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.darker }}>
      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>
      
      <Sequence from={90} durationInFrames={120}>
        <ProblemScene />
      </Sequence>
      
      <Sequence from={210} durationInFrames={750}>
        <AfterHoursChat />
      </Sequence>
      
      <Sequence from={960} durationInFrames={120}>
        <LeadNotificationScene />
      </Sequence>
      
      <Sequence from={1080} durationInFrames={120}>
        <BenefitsScene />
      </Sequence>
      
      <Sequence from={1200} durationInFrames={150}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
