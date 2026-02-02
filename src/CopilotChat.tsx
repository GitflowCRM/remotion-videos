import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
} from 'remotion';

// Typing dots animation
const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <div style={{ display: 'flex', gap: 5, padding: '10px 0' }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((frame + i * 6) / 6) * 4;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#64748b',
              transform: `translateY(${bounce}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

// Chat message with typing effect
const ChatMessage: React.FC<{
  text: string;
  isUser: boolean;
  delay: number;
  typingDuration?: number;
}> = ({ text, isUser, delay, typingDuration = 60 }) => {
  const frame = useCurrentFrame();
  
  const slideIn = interpolate(frame - delay, [0, 18], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // For AI messages, show typing then reveal
  const showTyping = !isUser && frame >= delay && frame < delay + 40;
  const textProgress = !isUser
    ? interpolate(frame - delay - 40, [0, typingDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  
  const charsToShow = Math.floor(text.length * textProgress);

  if (frame < delay) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 20,
        opacity,
        transform: `translateX(${isUser ? slideIn : -slideIn}px)`,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 22 }}>✨</span>
        </div>
      )}
      
      <div
        style={{
          maxWidth: '75%',
          padding: '16px 20px',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          backgroundColor: isUser ? '#6366f1' : '#1e293b',
          color: 'white',
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        {showTyping ? <TypingDots /> : text.slice(0, charsToShow)}
      </div>
      
      {isUser && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 14,
            flexShrink: 0,
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          M
        </div>
      )}
    </div>
  );
};

// Suggestion chip
const SuggestionChip: React.FC<{ text: string; delay: number; onClick?: boolean; clickFrame?: number }> = ({
  text,
  delay,
  onClick,
  clickFrame = 0,
}) => {
  const frame = useCurrentFrame();
  
  const scale = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
  });
  
  const isClicked = onClick && frame >= clickFrame;
  const clickScale = isClicked
    ? interpolate(frame - clickFrame, [0, 8, 16], [1, 0.92, 1], { extrapolateRight: 'clamp' })
    : 1;

  if (frame < delay) return null;

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '12px 20px',
        backgroundColor: isClicked ? '#6366f1' : '#1e293b',
        border: `1px solid ${isClicked ? '#6366f1' : '#334155'}`,
        borderRadius: 24,
        color: 'white',
        fontSize: 14,
        marginRight: 10,
        marginBottom: 10,
        transform: `scale(${scale * clickScale})`,
        cursor: 'pointer',
      }}
    >
      {text}
    </div>
  );
};

// Quick action card
const QuickAction: React.FC<{ icon: string; title: string; desc: string; delay: number }> = ({
  icon,
  title,
  desc,
  delay,
}) => {
  const frame = useCurrentFrame();
  
  const slideUp = interpolate(frame - delay, [0, 20], [40, 0], {
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
      style={{
        backgroundColor: '#1e293b',
        borderRadius: 14,
        padding: 20,
        flex: 1,
        opacity,
        transform: `translateY(${slideUp}px)`,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#64748b', fontSize: 13 }}>{desc}</div>
    </div>
  );
};

// Main Copilot component - Extended to ~16 seconds (480 frames)
export const CopilotChat: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Timeline for 16 seconds:
  // 0-40: Panel slides in
  // 40-100: Welcome message and quick actions
  // 100-160: Suggestions appear
  // 160-200: User clicks and message sent
  // 200-350: AI typing and response
  // 350-480: Action buttons appear, hold
  
  const panelSlide = interpolate(frame, [0, 35], [500, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const headerOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background app (blurred/dimmed) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0f172a',
          opacity: 0.4,
        }}
      >
        {/* Fake dashboard content */}
        <div style={{ padding: 48, opacity: 0.4 }}>
          <div style={{ width: 240, height: 36, backgroundColor: '#1e293b', borderRadius: 10, marginBottom: 28 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: 120, backgroundColor: '#1e293b', borderRadius: 14 }} />
            ))}
          </div>
          <div style={{ marginTop: 28, height: 200, backgroundColor: '#1e293b', borderRadius: 14 }} />
        </div>
      </div>
      
      {/* Copilot panel */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 500,
          backgroundColor: '#0f172a',
          borderLeft: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateX(${panelSlide}px)`,
          boxShadow: '-15px 0 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: headerOpacity,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 24 }}>✨</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>SmallERP Copilot</div>
              <div style={{ color: '#6366f1', fontSize: 13 }}>AI-powered assistant</div>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: 24, cursor: 'pointer' }}>×</div>
        </div>
        
        {/* Chat area */}
        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {/* Welcome message */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 32,
              opacity: interpolate(frame - 40, [0, 25], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
            <div style={{ color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
              Hi! I'm your SmallERP Copilot
            </div>
            <div style={{ color: '#64748b', fontSize: 15 }}>
              Ask me anything about your business
            </div>
          </div>
          
          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 32 }}>
            <QuickAction icon="📊" title="Analytics" desc="View insights" delay={60} />
            <QuickAction icon="📄" title="Create" desc="New invoice" delay={80} />
            <QuickAction icon="🔍" title="Search" desc="Find anything" delay={100} />
          </div>
          
          {/* Suggestions */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                color: '#64748b',
                fontSize: 13,
                marginBottom: 14,
                opacity: interpolate(frame - 120, [0, 15], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              Try asking:
            </div>
            <SuggestionChip text="Show me unpaid invoices" delay={130} onClick clickFrame={170} />
            <SuggestionChip text="Revenue this month" delay={145} />
            <SuggestionChip text="Low stock items" delay={160} />
          </div>
          
          {/* Conversation */}
          <ChatMessage
            text="Show me unpaid invoices"
            isUser={true}
            delay={180}
          />
          
          <ChatMessage
            text="I found 3 unpaid invoices totaling AED 24,750. The oldest is 15 days overdue from Acme Corp (AED 12,500). Would you like me to send payment reminders?"
            isUser={false}
            delay={220}
            typingDuration={90}
          />
          
          {/* Response actions */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 12,
              marginLeft: 58,
              opacity: interpolate(frame - 370, [0, 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <button
              style={{
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                transform: frame > 400 ? `scale(${1 + Math.sin((frame - 400) / 8) * 0.03})` : 'scale(1)',
              }}
            >
              Send Reminders
            </button>
            <button
              style={{
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #334155',
                borderRadius: 10,
                color: 'white',
                fontSize: 14,
              }}
            >
              View Details
            </button>
          </div>
        </div>
        
        {/* Input */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid #1e293b',
            opacity: headerOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              borderRadius: 14,
              padding: '14px 18px',
            }}
          >
            <input
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: 15,
                outline: 'none',
              }}
              placeholder="Ask anything..."
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
              }}
            >
              →
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
