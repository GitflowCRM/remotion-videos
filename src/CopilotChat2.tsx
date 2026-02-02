import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  useVideoConfig,
} from 'remotion';
import {
  Card,
  CardContent,
  Button,
  Avatar,
  Badge,
  Input,
} from './components';

// SmallERP theme
const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  success: '#10b981',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

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
              backgroundColor: theme.dim,
              transform: `translateY(${bounce}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

// Chat message with avatar
const ChatMessage: React.FC<{
  text: string;
  isUser: boolean;
  delay: number;
  typingDuration?: number;
}> = ({ text, isUser, delay, typingDuration = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
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
        transform: `translateX(${isUser ? (1 - progress) * 30 : (progress - 1) * 30}px)`,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.primary}, #4f46e5)`,
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
          backgroundColor: isUser ? theme.primary : theme.card,
          color: theme.text,
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        {showTyping ? <TypingDots /> : text.slice(0, charsToShow)}
      </div>
      
      {isUser && (
        <div style={{ marginLeft: 14 }}>
          <Avatar name="Muneer" size="md" />
        </div>
      )}
    </div>
  );
};

// Suggestion chip
const SuggestionChip: React.FC<{
  text: string;
  delay: number;
  onClick?: boolean;
  clickFrame?: number;
}> = ({ text, delay, onClick, clickFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  
  const isClicked = onClick && frame >= clickFrame;
  const clickScale = isClicked
    ? interpolate(frame - clickFrame, [0, 8, 16], [1, 0.92, 1], { extrapolateRight: 'clamp' })
    : 1;

  if (frame < delay) return null;

  return (
    <Badge
      variant={isClicked ? 'default' : 'outline'}
      style={{
        padding: '12px 20px',
        borderRadius: 24,
        fontSize: 14,
        marginRight: 10,
        marginBottom: 10,
        transform: `scale(${scale * clickScale})`,
        cursor: 'pointer',
      }}
    >
      {text}
    </Badge>
  );
};

// Quick action card using Card component
const QuickAction: React.FC<{
  icon: string;
  title: string;
  desc: string;
  delay: number;
}> = ({ icon, title, desc, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Card
      style={{
        flex: 1,
        opacity,
        transform: `translateY(${(1 - progress) * 40}px)`,
      }}
    >
      <CardContent style={{ padding: 16 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
        <div style={{ color: theme.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ color: theme.dim, fontSize: 12 }}>{desc}</div>
      </CardContent>
    </Card>
  );
};

// Invoice preview card
const InvoicePreviewCard: React.FC<{
  customer: string;
  amount: number;
  daysOverdue: number;
  delay: number;
}> = ({ customer, amount, daysOverdue, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < delay) return null;

  return (
    <Card
      style={{
        opacity,
        transform: `translateX(${(1 - progress) * 20}px)`,
        marginBottom: 8,
      }}
    >
      <CardContent style={{ padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={customer} size="sm" />
            <div>
              <div style={{ color: theme.text, fontSize: 14, fontWeight: 500 }}>{customer}</div>
              <div style={{ color: theme.dim, fontSize: 12 }}>{daysOverdue} days overdue</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>
              AED {amount.toLocaleString()}
            </div>
            <Badge variant="destructive" style={{ fontSize: 10 }}>Overdue</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Copilot component
export const CopilotChat2: React.FC = () => {
  const frame = useCurrentFrame();
  
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
        backgroundColor: theme.bg,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background app (blurred/dimmed) */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.bg, opacity: 0.4 }}>
        <div style={{ padding: 48, opacity: 0.4 }}>
          <div style={{ width: 240, height: 36, backgroundColor: theme.card, borderRadius: 10, marginBottom: 28 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: 120, backgroundColor: theme.card, borderRadius: 14 }} />
            ))}
          </div>
          <div style={{ marginTop: 28, height: 200, backgroundColor: theme.card, borderRadius: 14 }} />
        </div>
      </div>
      
      {/* Copilot panel */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 520,
          backgroundColor: theme.bg,
          borderLeft: `1px solid ${theme.card}`,
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
            borderBottom: `1px solid ${theme.card}`,
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
                background: `linear-gradient(135deg, ${theme.primary}, #4f46e5)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 24 }}>✨</span>
            </div>
            <div>
              <div style={{ color: theme.text, fontWeight: 600, fontSize: 18 }}>SmallERP Copilot</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.success }} />
                <span style={{ color: theme.success, fontSize: 13 }}>Online</span>
              </div>
            </div>
          </div>
          <div style={{ color: theme.dim, fontSize: 24, cursor: 'pointer' }}>×</div>
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
            <div style={{ color: theme.text, fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
              Hi Muneer! I'm your SmallERP Copilot
            </div>
            <div style={{ color: theme.dim, fontSize: 15 }}>
              Ask me anything about your business
            </div>
          </div>
          
          {/* Quick actions using Card components */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <QuickAction icon="📊" title="Analytics" desc="View insights" delay={60} />
            <QuickAction icon="📄" title="Create" desc="New invoice" delay={80} />
            <QuickAction icon="🔍" title="Search" desc="Find anything" delay={100} />
          </div>
          
          {/* Suggestions */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                color: theme.dim,
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
            text="I found 3 unpaid invoices totaling AED 24,750. Here they are:"
            isUser={false}
            delay={220}
            typingDuration={60}
          />
          
          {/* Invoice preview cards */}
          <div style={{ marginLeft: 58, marginTop: 12 }}>
            <InvoicePreviewCard customer="Acme Corporation" amount={12500} daysOverdue={15} delay={320} />
            <InvoicePreviewCard customer="Tech Solutions" amount={7250} daysOverdue={8} delay={340} />
            <InvoicePreviewCard customer="Global Trade Co" amount={5000} daysOverdue={3} delay={360} />
          </div>
          
          {/* Response actions */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 16,
              marginLeft: 58,
              opacity: interpolate(frame - 400, [0, 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <Button
              style={{
                transform: frame > 430 ? `scale(${1 + Math.sin((frame - 430) / 8) * 0.03})` : 'scale(1)',
              }}
            >
              📧 Send Reminders
            </Button>
            <Button variant="outline">
              View All
            </Button>
          </div>
        </div>
        
        {/* Input area */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: `1px solid ${theme.card}`,
            opacity: headerOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.card,
              borderRadius: 14,
              padding: '8px 8px 8px 18px',
            }}
          >
            <span style={{ flex: 1, color: theme.dim, fontSize: 15 }}>
              Ask anything...
            </span>
            <Button size="icon" style={{ borderRadius: 10 }}>
              →
            </Button>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
