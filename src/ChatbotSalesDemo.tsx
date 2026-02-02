import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from 'remotion';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  dark: '#0f172a',
  darker: '#020617',
  accent: '#22c55e',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
};

// Typing animation
const TypeWriter = ({ text, startFrame, style }: { text: string; startFrame: number; style?: React.CSSProperties }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerSecond = 35;
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
          🤖
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

// Scene 1: Hook
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
        <div style={{
          fontSize: 68,
          fontWeight: 800,
          background: COLORS.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 20,
        }}>
          Turn Your Website Into
        </div>
        <div style={{
          fontSize: 76,
          fontWeight: 800,
          color: 'white',
          opacity: subtitleProgress,
          transform: `translateY(${(1 - subtitleProgress) * 30}px)`,
        }}>
          A 24/7 Sales Agent
        </div>
        <div style={{
          fontSize: 26,
          color: '#94a3b8',
          marginTop: 35,
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          Capture leads while you sleep 💰
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
  const typingStart = 25;
  
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
        maxWidth: 750,
      }}>
        <div style={{
          fontSize: 30,
          color: 'white',
          marginBottom: 28,
          textAlign: 'center',
        }}>
          Step 1: Enter your website URL
        </div>
        
        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: 24,
          border: '2px solid #334155',
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 12,
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{ fontSize: 22, color: '#64748b' }}>🌐</div>
            <TypeWriter 
              text="https://techpro.ae" 
              startFrame={typingStart}
              style={{ fontSize: 22, color: 'white', fontFamily: 'monospace' }}
            />
          </div>
          
          {frame > 80 && (
            <div style={{
              marginTop: 18,
              background: COLORS.gradient,
              borderRadius: 12,
              padding: '14px 28px',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 600,
              color: 'white',
              opacity: spring({ frame: frame - 80, fps, config: { damping: 12 } }),
              transform: `scale(${spring({ frame: frame - 80, fps, config: { damping: 12 } })})`,
            }}>
              ✨ Create Sales Agent
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
    { icon: '🏢', label: 'Company Information', delay: 0 },
    { icon: '💼', label: 'Products & Services', delay: 15 },
    { icon: '💰', label: 'Pricing Details', delay: 30 },
    { icon: '❓', label: 'FAQ & Support', delay: 45 },
    { icon: '📞', label: 'Contact Methods', delay: 60 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 650 }}>
        <div style={{
          fontSize: 30,
          color: 'white',
          marginBottom: 35,
        }}>
          🔍 Training your sales agent...
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((item, i) => {
            const progress = spring({ 
              frame: frame - item.delay, 
              fps, 
              config: { damping: 12 } 
            });
            const isDone = frame > item.delay + 35;
            
            return (
              <div key={i} style={{
                background: isDone ? 'rgba(34, 197, 94, 0.1)' : '#1e293b',
                borderRadius: 12,
                padding: '14px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: progress,
                transform: `translateX(${(1 - progress) * -40}px)`,
                border: isDone ? '1px solid #22c55e' : '1px solid #334155',
              }}>
                <div style={{ fontSize: 26 }}>{item.icon}</div>
                <div style={{ flex: 1, textAlign: 'left', color: 'white', fontSize: 18 }}>
                  {item.label}
                </div>
                {isDone && (
                  <div style={{ 
                    fontSize: 22, 
                    color: '#22c55e',
                    opacity: spring({ frame: frame - item.delay - 35, fps }),
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {frame > 100 && (
          <div style={{
            marginTop: 30,
            fontSize: 20,
            color: '#22c55e',
            opacity: spring({ frame: frame - 100, fps }),
          }}>
            ✅ Sales agent ready!
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Sales Chat Demo with Page Fades
const SalesChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Define message pages (groups that fit on screen)
  const pages = [
    // Page 1: Opening conversation
    {
      startFrame: 0,
      endFrame: 270,
      messages: [
        { text: "Hi there! 👋 Welcome to TechPro Solutions. I'm here to help you find the perfect IT solution for your business.", isUser: false, delay: 15, typing: true },
        { text: "Hi! I'm looking for cloud hosting for my e-commerce store", isUser: true, delay: 100 },
        { text: "Great choice! Our cloud hosting is perfect for e-commerce. We offer 99.9% uptime, automatic backups, and 24/7 support. Plans start at AED 299/month. Would you like me to send you our pricing guide?", isUser: false, delay: 140, typing: true },
        { text: "Yes please!", isUser: true, delay: 250 },
      ]
    },
    // Page 2: Lead capture
    {
      startFrame: 270,
      endFrame: 520,
      messages: [
        { text: "Perfect! Just need a few details to personalize the guide for you. What's your name?", isUser: false, delay: 0, typing: true },
        { text: "Ahmed Hassan", isUser: true, delay: 70 },
        { text: "Nice to meet you, Ahmed! And your email so I can send the pricing guide?", isUser: false, delay: 100, typing: true },
        { text: "ahmed@mystore.ae", isUser: true, delay: 160 },
      ]
    },
    // Page 3: Final details + confirmation
    {
      startFrame: 520,
      endFrame: 750,
      messages: [
        { text: "Great! One last thing - what's the best number to reach you if our team has questions?", isUser: false, delay: 0, typing: true },
        { text: "+971 50 123 4567", isUser: true, delay: 60 },
        { text: "Thanks Ahmed! ✅ I've sent the pricing guide to your email. Our sales team will also reach out within 24 hours with a personalized quote. Is there anything else I can help with?", isUser: false, delay: 100, typing: true },
      ]
    },
  ];
  
  // Determine which page to show and calculate opacity
  const getPageOpacity = (page: typeof pages[0], index: number) => {
    const fadeFrames = 15; // Duration of fade transition
    
    if (frame < page.startFrame - fadeFrames) return 0;
    if (frame < page.startFrame) {
      // Fading in
      return interpolate(frame, [page.startFrame - fadeFrames, page.startFrame], [0, 1]);
    }
    if (frame < page.endFrame - fadeFrames) return 1;
    if (frame < page.endFrame) {
      // Fading out (only if not the last page)
      if (index < pages.length - 1) {
        return interpolate(frame, [page.endFrame - fadeFrames, page.endFrame], [1, 0]);
      }
      return 1;
    }
    if (index === pages.length - 1) return 1; // Keep last page visible
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
        {/* Chat header */}
        <div style={{
          background: COLORS.gradient,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
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
            💼
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>
              TechPro Sales Assistant
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              ● Online now
            </div>
          </div>
        </div>
        
        {/* Chat messages with page fades */}
        <div style={{ padding: 20, height: 420, overflow: 'hidden', position: 'relative' }}>
          {pages.map((page, pageIndex) => {
            const pageOpacity = getPageOpacity(page, pageIndex);
            if (pageOpacity === 0) return null;
            
            // Calculate local frame within this page
            const localFrame = frame - page.startFrame;
            
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
                  <ChatBubble 
                    key={i}
                    message={msg.text}
                    isUser={msg.isUser}
                    delay={page.startFrame + msg.delay}
                    typing={msg.typing}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Lead Captured Notification
const LeadCapturedScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const notifProgress = spring({ frame, fps, config: { damping: 12 } });
  const checkProgress = spring({ frame: frame - 20, fps, config: { damping: 8 } });
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      <div style={{
        textAlign: 'center',
        transform: `scale(${notifProgress})`,
      }}>
        {/* Success icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 60,
          transform: `scale(${checkProgress})`,
          boxShadow: '0 0 60px rgba(34, 197, 94, 0.4)',
        }}>
          ✓
        </div>
        
        <div style={{
          fontSize: 48,
          fontWeight: 700,
          color: 'white',
          marginBottom: 16,
        }}>
          New Lead Captured! 🎉
        </div>
        
        <div style={{
          fontSize: 24,
          color: '#94a3b8',
          marginBottom: 40,
        }}>
          Automatically saved to your CRM
        </div>
        
        {/* Lead card preview */}
        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: 24,
          maxWidth: 400,
          margin: '0 auto',
          textAlign: 'left',
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: COLORS.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: 'white',
            }}>
              AH
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 20 }}>Ahmed Hassan</div>
              <div style={{ color: '#22c55e', fontSize: 14 }}>🔥 Hot Lead</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#64748b' }}>📧</span>
              <span style={{ color: 'white' }}>ahmed@mystore.ae</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#64748b' }}>📱</span>
              <span style={{ color: 'white' }}>+971 50 123 4567</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#64748b' }}>💬</span>
              <span style={{ color: 'white' }}>Interested in: Cloud Hosting</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Admin Panel
const AdminPanelScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const panelProgress = spring({ frame, fps, config: { damping: 12 } });
  
  const leads = [
    { name: 'Ahmed Hassan', email: 'ahmed@mystore.ae', interest: 'Cloud Hosting', status: 'Hot', time: 'Just now' },
    { name: 'Sara Al Maktoum', email: 'sara@company.ae', interest: 'Web Development', status: 'Warm', time: '2 hours ago' },
    { name: 'Mohammed Ali', email: 'mali@business.ae', interest: 'IT Support', status: 'New', time: '5 hours ago' },
  ];
  
  return (
    <AbsoluteFill style={{
      background: COLORS.darker,
      padding: 40,
    }}>
      <div style={{
        transform: `translateY(${(1 - panelProgress) * 50}px)`,
        opacity: panelProgress,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>
              📊 Leads Dashboard
            </div>
            <div style={{ fontSize: 16, color: '#64748b', marginTop: 4 }}>
              SmallERP CRM • Real-time sync
            </div>
          </div>
          <div style={{
            background: COLORS.gradient,
            padding: '12px 24px',
            borderRadius: 12,
            color: 'white',
            fontWeight: 600,
            fontSize: 18,
          }}>
            +47 leads this week
          </div>
        </div>
        
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
          {[
            { label: 'Total Leads', value: '284', icon: '👥', color: '#6366f1' },
            { label: 'Hot Leads', value: '42', icon: '🔥', color: '#ef4444' },
            { label: 'Converted', value: '89', icon: '✅', color: '#22c55e' },
            { label: 'Revenue', value: 'AED 142K', icon: '💰', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1,
              background: '#1e293b',
              borderRadius: 16,
              padding: 20,
              opacity: interpolate(frame, [15 + i * 8, 30 + i * 8], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame, [15 + i * 8, 30 + i * 8], [20, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Leads table */}
        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
            gap: 16,
            padding: '16px 24px',
            background: '#0f172a',
            color: '#64748b',
            fontSize: 14,
            fontWeight: 600,
          }}>
            <span>Contact</span>
            <span>Email</span>
            <span>Interest</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          
          {/* Table rows */}
          {leads.map((lead, i) => {
            const rowProgress = interpolate(frame, [40 + i * 15, 55 + i * 15], [0, 1], { extrapolateRight: 'clamp' });
            const isNew = i === 0;
            
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
                gap: 16,
                padding: '20px 24px',
                borderTop: '1px solid #334155',
                opacity: rowProgress,
                background: isNew ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: COLORS.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                  }}>
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span style={{ color: 'white', fontWeight: isNew ? 600 : 400 }}>{lead.name}</span>
                  {isNew && <span style={{ fontSize: 12, color: '#22c55e' }}>NEW</span>}
                </div>
                <span style={{ color: '#94a3b8' }}>{lead.email}</span>
                <span style={{ color: '#94a3b8' }}>{lead.interest}</span>
                <span style={{
                  color: lead.status === 'Hot' ? '#ef4444' : lead.status === 'Warm' ? '#f59e0b' : '#6366f1',
                  fontWeight: 600,
                }}>
                  {lead.status === 'Hot' ? '🔥' : lead.status === 'Warm' ? '🌡️' : '🆕'} {lead.status}
                </span>
                <span style={{ color: isNew ? '#22c55e' : '#64748b' }}>{lead.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
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
      <div style={{ textAlign: 'center', transform: `scale(${scaleIn})` }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: 'white', marginBottom: 20 }}>
          Stop Losing Leads 🚀
        </div>
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.9)', marginBottom: 45 }}>
          Your AI sales agent works 24/7. You close deals.
        </div>
        
        <div style={{
          display: 'inline-block',
          background: 'white',
          color: COLORS.primary,
          padding: '18px 44px',
          borderRadius: 14,
          fontSize: 22,
          fontWeight: 700,
          transform: `scale(${buttonPulse})`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}>
          Start Free - 250 Conversations →
        </div>
        
        <div style={{ marginTop: 35, color: 'rgba(255,255,255,0.8)', fontSize: 17 }}>
          smallerp.ae/chatbot
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const ChatbotSalesDemo = () => {
  const { fps } = useVideoConfig();
  
  const scenes = [
    { component: HookScene, duration: 3.5 },
    { component: EnterURLScene, duration: 4 },
    { component: ScanningScene, duration: 4.5 },
    { component: SalesChatScene, duration: 25 },
    { component: LeadCapturedScene, duration: 4 },
    { component: AdminPanelScene, duration: 6 },
    { component: CTAScene, duration: 4 },
  ];
  
  let currentFrame = 0;
  
  return (
    <AbsoluteFill style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {scenes.map((scene, i) => {
        const start = currentFrame;
        const durationFrames = Math.round(scene.duration * fps);
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

export default ChatbotSalesDemo;
