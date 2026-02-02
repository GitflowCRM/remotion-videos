import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, staticFile } from 'remotion';

// PropertyFinder-style colors
const COLORS = {
  primary: '#00a651',      // PropertyFinder green
  primaryDark: '#008c45',
  secondary: '#1a1a2e',
  text: '#2d2d2d',
  textLight: '#6b7280',
  background: '#f8f9fa',
  white: '#ffffff',
  dark: '#0f172a',
  red: '#ef4444',
  gradient: 'linear-gradient(135deg, #00a651 0%, #008c45 100%)',
};

// Inter-like font stack
const fontFamily = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif';

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
        marginRight: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>M</span>
      </div>
      <div style={{
        background: '#f1f5f9',
        padding: '14px 20px',
        borderRadius: '18px 18px 18px 4px',
        display: 'flex',
        gap: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#94a3b8',
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
const TypeWriter = ({ text, startFrame }: { text: string; startFrame: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerSecond = 40;
  const framesSinceStart = Math.max(0, frame - startFrame);
  const charsToShow = Math.floor((framesSinceStart / fps) * charsPerSecond);
  const displayText = text.slice(0, charsToShow);
  const showCursor = framesSinceStart > 0 && charsToShow < text.length;
  
  return (
    <span>
      {displayText}
      {showCursor && <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>}
    </span>
  );
};

// Chat bubble
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
      transform: `translateY(${(1 - progress) * 15}px)`,
    }}>
      {!isUser && (
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: COLORS.gradient,
          marginRight: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>M</span>
        </div>
      )}
      <div style={{
        background: isUser ? COLORS.primary : '#f1f5f9',
        color: isUser ? 'white' : COLORS.text,
        padding: '12px 18px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        maxWidth: '80%',
        fontSize: 15,
        lineHeight: 1.5,
        fontFamily,
        boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
      }}>
        {typing ? (
          <TypeWriter text={message} startFrame={delay + 8} />
        ) : message}
      </div>
    </div>
  );
};

// PropertyFinder-style site mockup
const PropertyFinderSite = ({ children, showChat = false, chatContent }: { 
  children?: React.ReactNode; 
  showChat?: boolean;
  chatContent?: React.ReactNode;
}) => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: '#f5f5f5', fontFamily }}>
      {/* Header - PropertyFinder style */}
      <div style={{
        background: COLORS.white,
        padding: '0 60px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 44,
              height: 44,
              background: COLORS.primary,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>M</span>
            </div>
            <div>
              <div style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: '#1a1a1a',
                letterSpacing: '-0.5px',
              }}>
                Marina Properties
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: -2 }}>
                Dubai's Premium Real Estate
              </div>
            </div>
          </div>
          
          {/* Nav */}
          <div style={{ display: 'flex', gap: 35 }}>
            {['Buy', 'Rent', 'New Projects', 'Commercial'].map((item, i) => (
              <span key={item} style={{ 
                color: i === 1 ? COLORS.primary : '#444',
                fontSize: 15,
                fontWeight: 500,
                borderBottom: i === 1 ? `2px solid ${COLORS.primary}` : 'none',
                paddingBottom: 4,
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#666', fontSize: 14 }}>🇦🇪 EN</span>
          <div style={{ color: '#444', fontSize: 14, fontWeight: 500 }}>
            ☎️ +971 4 XXX XXXX
          </div>
          <div style={{
            background: COLORS.primary,
            color: 'white',
            padding: '10px 24px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}>
            List Property
          </div>
        </div>
      </div>
      
      {/* Hero Section - Clean gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '70px 60px',
        position: 'relative',
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(0,166,81,0.1) 0%, transparent 50%)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            color: 'white',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 12,
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Find Your Dream Home in Dubai
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 18,
            margin: '12px 0 35px',
          }}>
            5,247 premium properties in Marina, JBR, Palm Jumeirah & Downtown
          </p>
          
          {/* Search Bar - PropertyFinder style */}
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 6,
            maxWidth: 900,
            display: 'flex',
            gap: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              flex: 1.5,
              background: '#f8f9fa',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <span style={{ color: '#999', fontSize: 15 }}>City, community or building</span>
            </div>
            <div style={{
              flex: 0.7,
              background: '#f8f9fa',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: '#333', fontSize: 15 }}>Apartment</span>
              <span style={{ color: '#999' }}>▼</span>
            </div>
            <div style={{
              flex: 0.7,
              background: '#f8f9fa',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: '#333', fontSize: 15 }}>Any Price</span>
              <span style={{ color: '#999' }}>▼</span>
            </div>
            <div style={{
              flex: 0.5,
              background: '#f8f9fa',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: '#333', fontSize: 15 }}>Beds</span>
              <span style={{ color: '#999' }}>▼</span>
            </div>
            <div style={{
              background: COLORS.primary,
              color: 'white',
              borderRadius: 8,
              padding: '16px 40px',
              fontSize: 16,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}>
              Search
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Cards - With Unsplash Images */}
      <div style={{
        padding: '35px 60px',
        display: 'flex',
        gap: 24,
      }}>
        {[
          { 
            title: '2BR Apartment with Marina View', 
            price: 'AED 120,000', 
            period: '/year', 
            location: 'Dubai Marina', 
            beds: 2, 
            baths: 2, 
            sqft: '1,250', 
            img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', 
            tag: 'VERIFIED' 
          },
          { 
            title: 'Luxury Penthouse', 
            price: 'AED 3,500,000', 
            period: '', 
            location: 'Palm Jumeirah', 
            beds: 4, 
            baths: 5, 
            sqft: '4,800', 
            img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', 
            tag: 'PREMIUM' 
          },
          { 
            title: 'Beachfront Villa', 
            price: 'AED 8,900,000', 
            period: '', 
            location: 'JBR', 
            beds: 5, 
            baths: 6, 
            sqft: '6,200', 
            img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', 
            tag: 'NEW' 
          },
        ].map((property, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: 12,
            overflow: 'hidden',
            flex: 1,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              height: 170,
              backgroundImage: `url(${property.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: property.tag === 'VERIFIED' ? COLORS.primary : property.tag === 'PREMIUM' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                {property.tag}
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ 
                  color: COLORS.primary, 
                  fontWeight: 700, 
                  fontSize: 20,
                }}>
                  {property.price}
                </span>
                <span style={{ color: '#999', fontSize: 13 }}>{property.period}</span>
              </div>
              <div style={{ color: '#1a1a1a', fontWeight: 600, fontSize: 15, marginTop: 6 }}>
                {property.title}
              </div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
                📍 {property.location}
              </div>
              <div style={{ 
                display: 'flex', 
                gap: 16, 
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid #f0f0f0',
                color: '#666',
                fontSize: 13,
              }}>
                <span>🛏️ {property.beds}</span>
                <span>🚿 {property.baths}</span>
                <span>📐 {property.sqft} sqft</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat Widget - TALLER */}
      {showChat && (
        <div style={{
          position: 'absolute',
          bottom: 30,
          right: 40,
          width: 460,
          maxHeight: 620,
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 15px 50px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}>
          {chatContent}
        </div>
      )}
      
      {children}
    </AbsoluteFill>
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
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{ textAlign: 'center', transform: `scale(${titleProgress})` }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🏢</div>
        <div style={{
          fontSize: 52,
          fontWeight: 700,
          color: 'white',
          marginBottom: 15,
        }}>
          Dubai Real Estate Agents
        </div>
        <div style={{
          fontSize: 42,
          fontWeight: 700,
          background: COLORS.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: subtitleProgress,
        }}>
          Capture Leads 24/7
        </div>
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.7)',
          marginTop: 30,
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          Even when your office is closed 🌙
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Site with Offline Chat
const OfflineChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const chatProgress = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  
  return (
    <PropertyFinderSite showChat={frame > 30} chatContent={
      <div style={{ transform: `scale(${chatProgress})`, transformOrigin: 'bottom right' }}>
        {/* Chat Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.primary }}>M</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 17 }}>
              Marina Properties
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
              <span style={{ color: '#f87171' }}>● Offline</span> · Usually replies in 8 hours
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>✕</div>
        </div>
        
        {/* Chat Body - Offline Message */}
        <div style={{ padding: 24, minHeight: 380 }}>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>😴</div>
            <div style={{ 
              color: '#991b1b', 
              fontWeight: 700, 
              fontSize: 18,
              marginBottom: 8,
            }}>
              We're currently offline
            </div>
            <div style={{ color: '#b91c1c', fontSize: 14, lineHeight: 1.6 }}>
              Office hours: Sun-Thu, 9 AM - 6 PM<br />
              Leave a message and we'll reply tomorrow
            </div>
          </div>
          
          {frame > 90 && (
            <div style={{
              marginTop: 20,
              background: '#1e293b',
              borderRadius: 12,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: spring({ frame: frame - 90, fps }),
            }}>
              <span style={{ fontSize: 20 }}>🌙</span>
              <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>2:47 AM</span>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>in Dubai</span>
            </div>
          )}
        </div>
        
        {/* Input - disabled look */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
        }}>
          <div style={{
            background: '#e5e7eb',
            borderRadius: 24,
            padding: '14px 20px',
            color: '#9ca3af',
            fontSize: 15,
            textAlign: 'center',
          }}>
            Chat unavailable outside office hours
          </div>
        </div>
      </div>
    } />
  );
};

// Scene 3: Problem Statement
const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const items = [
    { icon: '🌙', text: '68% of inquiries come after office hours', delay: 0 },
    { icon: '💸', text: 'Each lost lead = AED 15-50K commission', delay: 25 },
    { icon: '😤', text: 'Visitors leave to competitors', delay: 50 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{ width: '100%', maxWidth: 700, padding: 40 }}>
        <div style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#ef4444',
          marginBottom: 40,
          textAlign: 'center',
        }}>
          ⚠️ The Problem
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

// Scene 4: Solution - SmallERP Setup
const SolutionSetupScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const boxProgress = spring({ frame, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{
        transform: `scale(${boxProgress})`,
        width: '80%',
        maxWidth: 700,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 32,
          color: COLORS.primary,
          fontWeight: 700,
          marginBottom: 30,
        }}>
          ✨ The Solution: AI Sales Agent
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          padding: 30,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 20,
          }}>
            Connect your website in seconds:
          </div>
          
          <div style={{
            background: '#0f172a',
            borderRadius: 12,
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{ fontSize: 22, color: COLORS.textLight }}>🌐</div>
            <TypeWriter 
              text="https://marinaproperties.ae" 
              startFrame={30}
            />
          </div>
          
          {frame > 100 && (
            <div style={{
              marginTop: 20,
              background: COLORS.gradient,
              borderRadius: 12,
              padding: '16px 30px',
              display: 'inline-block',
              fontSize: 18,
              fontWeight: 600,
              color: 'white',
              opacity: spring({ frame: frame - 100, fps }),
              transform: `scale(${spring({ frame: frame - 100, fps })})`,
            }}>
              🚀 Create AI Agent
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Scanning Animation
const ScanningScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const items = [
    { icon: '🏢', label: '247 Property Listings', delay: 0 },
    { icon: '💰', label: 'Pricing & Payment Plans', delay: 18 },
    { icon: '📍', label: 'Location Details', delay: 36 },
    { icon: '👤', label: 'Agent Information', delay: 54 },
    { icon: '📅', label: 'Viewing Availability', delay: 72 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 600, padding: 40 }}>
        <div style={{
          fontSize: 26,
          color: 'white',
          marginBottom: 35,
        }}>
          🔍 Training AI on marinaproperties.ae...
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => {
            const progress = spring({ frame: frame - item.delay, fps, config: { damping: 12 } });
            const isDone = frame > item.delay + 25;
            
            return (
              <div key={i} style={{
                background: isDone ? 'rgba(0, 166, 81, 0.15)' : 'rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: progress,
                transform: `translateX(${(1 - progress) * -30}px)`,
                border: isDone ? `1px solid ${COLORS.primary}` : '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: 24 }}>{item.icon}</div>
                <div style={{ flex: 1, textAlign: 'left', color: 'white', fontSize: 17 }}>
                  {item.label}
                </div>
                {isDone && (
                  <div style={{ fontSize: 18, color: COLORS.primary }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
        
        {frame > 110 && (
          <div style={{
            marginTop: 25,
            fontSize: 20,
            color: COLORS.primary,
            fontWeight: 600,
            opacity: spring({ frame: frame - 110, fps }),
          }}>
            ✅ AI Agent Ready!
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Live Chat on Site (2:47 AM)
const LiveChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const pages = [
    {
      startFrame: 0,
      endFrame: 280,
      messages: [
        { text: "I'm looking for a 2BR in Marina, budget 120K/year", isUser: true, delay: 30 },
        { text: "Hi! 🏠 I found 12 Marina apartments in your budget. Waterfront or city view preference?", isUser: false, delay: 90, typing: true, typingDots: 30 },
        { text: "Waterfront with parking please", isUser: true, delay: 180 },
        { text: "Perfect! 5 options available. Can I book you a viewing tomorrow?", isUser: false, delay: 230, typing: true, typingDots: 25 },
      ]
    },
    {
      startFrame: 280,
      endFrame: 500,
      messages: [
        { text: "Yes, after 5pm works", isUser: true, delay: 20 },
        { text: "Great! I'll book 6pm. What's your name?", isUser: false, delay: 60, typing: true, typingDots: 20 },
        { text: "Sarah Johnson", isUser: true, delay: 115 },
        { text: "Nice to meet you Sarah! Your contact number?", isUser: false, delay: 155, typing: true, typingDots: 20 },
        { text: "+971 55 123 4567", isUser: true, delay: 210 },
      ]
    },
    {
      startFrame: 500,
      endFrame: 700,
      messages: [
        { text: "Thanks Sarah! ✅ Viewing booked for tomorrow 6pm. Agent Ahmed will call you by 10am to confirm. Property details sent to WhatsApp!", isUser: false, delay: 30, typing: true, typingDots: 30 },
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
    <PropertyFinderSite showChat chatContent={
      <>
        {/* Chat Header - Now Online 24/7 with AI badge */}
        <div style={{
          background: COLORS.gradient,
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>M</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                Marina Properties
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  AI
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 }}>
                <span style={{ color: '#86efac' }}>● Online 24/7</span> · Instant replies
              </div>
            </div>
          </div>
          {/* Time badge */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '8px 14px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🌙</span>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>2:47 AM</span>
          </div>
        </div>
        
        {/* Chat Messages - TALLER */}
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
        
        {/* Input - Active */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: 10,
          background: '#fafafa',
        }}>
          <div style={{
            flex: 1,
            background: 'white',
            borderRadius: 24,
            padding: '12px 18px',
            color: '#999',
            fontSize: 15,
            border: '1px solid #e5e7eb',
          }}>
            Type a message...
          </div>
          <div style={{
            width: 44,
            height: 44,
            background: COLORS.gradient,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
          }}>
            ➤
          </div>
        </div>
      </>
    } />
  );
};

// Scene 7: Lead Captured Notification
const LeadCapturedScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const phoneProgress = spring({ frame, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 25,
        }}>
          Meanwhile, you wake up to...
        </div>
        
        <div style={{
          background: '#1e293b',
          borderRadius: 30,
          padding: 15,
          width: 340,
          margin: '0 auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          transform: `scale(${phoneProgress})`,
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 20,
            padding: 20,
          }}>
            <div style={{
              background: COLORS.gradient,
              borderRadius: 14,
              padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>🔔</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>New Lead Captured!</span>
              </div>
              <div style={{ color: 'white', fontSize: 14, lineHeight: 1.6 }}>
                <strong>Sarah Johnson</strong><br />
                2BR Marina Waterfront<br />
                Viewing: Tomorrow 6pm<br />
                📱 +971 55 123 4567
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: 13,
              marginTop: 15,
            }}>
              Captured at 2:47 AM 🌙
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: CTA
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const mainProgress = spring({ frame, fps, config: { damping: 12 } });
  const pulseScale = 1 + Math.sin(frame * 0.15) * 0.02;
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily,
    }}>
      <div style={{ textAlign: 'center', transform: `scale(${mainProgress})` }}>
        <div style={{ fontSize: 50, marginBottom: 20 }}>🏢</div>
        <div style={{
          fontSize: 40,
          fontWeight: 700,
          color: 'white',
          marginBottom: 12,
        }}>
          Stop Losing Leads
        </div>
        <div style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 35,
        }}>
          Let AI work while you sleep
        </div>
        
        <div style={{
          background: COLORS.gradient,
          padding: '18px 45px',
          borderRadius: 14,
          display: 'inline-block',
          transform: `scale(${pulseScale})`,
          boxShadow: '0 10px 40px rgba(0, 166, 81, 0.3)',
        }}>
          <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>
            Try Free for 14 Days
          </div>
        </div>
        
        <div style={{
          marginTop: 25,
          fontSize: 17,
          color: 'rgba(255,255,255,0.5)',
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          smallerp.ae/real-estate
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const RealEstateDubai = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark, fontFamily }}>
      {/* 1. Hook */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>
      
      {/* 2. Site with Offline Chat */}
      <Sequence from={90} durationInFrames={150}>
        <OfflineChatScene />
      </Sequence>
      
      {/* 3. Problem */}
      <Sequence from={240} durationInFrames={100}>
        <ProblemScene />
      </Sequence>
      
      {/* 4. Solution Setup */}
      <Sequence from={340} durationInFrames={140}>
        <SolutionSetupScene />
      </Sequence>
      
      {/* 5. Scanning */}
      <Sequence from={480} durationInFrames={150}>
        <ScanningScene />
      </Sequence>
      
      {/* 6. Live Chat on Site */}
      <Sequence from={630} durationInFrames={700}>
        <LiveChatScene />
      </Sequence>
      
      {/* 7. Lead Captured */}
      <Sequence from={1330} durationInFrames={120}>
        <LeadCapturedScene />
      </Sequence>
      
      {/* 8. CTA */}
      <Sequence from={1450} durationInFrames={150}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
