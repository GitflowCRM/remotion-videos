import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Img } from 'remotion';

// PropertyFinder-style colors
const COLORS = {
  primary: '#00a651',
  primaryDark: '#008c45',
  text: '#2d2d2d',
  textLight: '#6b7280',
  background: '#f8f9fa',
  white: '#ffffff',
  dark: '#0f172a',
  gradient: 'linear-gradient(135deg, #00a651 0%, #008c45 100%)',
  whatsapp: '#25D366',
};

const fontFamily = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif';

// Property data for grid
const PROPERTIES = [
  { title: '2BR Marina Apt', price: 'AED 120K', period: '/yr', location: 'Dubai Marina', beds: 2, baths: 2, sqft: '1,250', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', tag: 'VERIFIED' },
  { title: 'Luxury Penthouse', price: 'AED 3.5M', period: '', location: 'Palm Jumeirah', beds: 4, baths: 5, sqft: '4,800', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', tag: 'PREMIUM' },
  { title: 'Beachfront Villa', price: 'AED 8.9M', period: '', location: 'JBR', beds: 5, baths: 6, sqft: '6,200', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop', tag: 'NEW' },
  { title: 'Studio Downtown', price: 'AED 55K', period: '/yr', location: 'Downtown', beds: 0, baths: 1, sqft: '450', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', tag: 'HOT' },
  { title: '3BR Family Home', price: 'AED 180K', period: '/yr', location: 'Arabian Ranches', beds: 3, baths: 3, sqft: '2,100', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', tag: 'VERIFIED' },
  { title: 'Waterfront Apt', price: 'AED 1.8M', period: '', location: 'Creek Harbour', beds: 2, baths: 2, sqft: '1,400', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', tag: 'NEW' },
];

// Typing indicator
const TypingIndicator = ({ startFrame, duration }: { startFrame: number; duration: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 100 } });
  
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12, opacity: progress }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.gradient, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>M</span>
      </div>
      <div style={{ background: '#f1f5f9', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 5 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', opacity: interpolate(Math.sin((frame - startFrame) * 0.3 + i * 1.2), [-1, 1], [0.3, 1]), transform: `translateY(${Math.sin((frame - startFrame) * 0.3 + i * 1.2) * -2}px)` }} />
        ))}
      </div>
    </div>
  );
};

// Typing animation
const TypeWriter = ({ text, startFrame }: { text: string; startFrame: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerSecond = 35;
  const framesSinceStart = Math.max(0, frame - startFrame);
  const charsToShow = Math.floor((framesSinceStart / fps) * charsPerSecond);
  const displayText = text.slice(0, charsToShow);
  const showCursor = framesSinceStart > 0 && charsToShow < text.length;
  return <span>{displayText}{showCursor && <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>}</span>;
};

// Chat bubble
const ChatBubble = ({ message, isUser, delay, typing = false }: { message: string; isUser: boolean; delay: number; typing?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  if (frame < delay) return null;
  
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12, opacity: progress, transform: `translateY(${(1 - progress) * 10}px)` }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.gradient, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>M</span>
        </div>
      )}
      <div style={{ background: isUser ? COLORS.primary : '#f1f5f9', color: isUser ? 'white' : COLORS.text, padding: '10px 16px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', maxWidth: '85%', fontSize: 14, lineHeight: 1.5, fontFamily }}>
        {typing ? <TypeWriter text={message} startFrame={delay + 5} /> : message}
      </div>
    </div>
  );
};

// Property Card
const PropertyCard = ({ property, small = false }: { property: typeof PROPERTIES[0]; small?: boolean }) => (
  <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    <div style={{ height: small ? 100 : 120, position: 'relative' }}>
      <Img src={property.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 8, left: 8, background: property.tag === 'VERIFIED' ? COLORS.primary : property.tag === 'PREMIUM' ? '#f59e0b' : property.tag === 'HOT' ? '#ef4444' : '#3b82f6', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
        {property.tag}
      </div>
    </div>
    <div style={{ padding: small ? 10 : 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ color: COLORS.primary, fontWeight: 700, fontSize: small ? 14 : 16 }}>{property.price}</span>
        <span style={{ color: '#999', fontSize: small ? 10 : 11 }}>{property.period}</span>
      </div>
      <div style={{ color: '#1a1a1a', fontWeight: 600, fontSize: small ? 11 : 13, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</div>
      <div style={{ color: '#666', fontSize: small ? 10 : 11, marginTop: 3 }}>📍 {property.location}</div>
      <div style={{ display: 'flex', gap: small ? 8 : 12, marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0', color: '#666', fontSize: small ? 9 : 11 }}>
        <span>🛏️ {property.beds || 'Studio'}</span>
        <span>🚿 {property.baths}</span>
        <span>📐 {property.sqft}</span>
      </div>
    </div>
  </div>
);

// Full Property Site with Grid
const PropertySite = ({ showChat = false, chatContent }: { showChat?: boolean; chatContent?: React.ReactNode }) => {
  return (
    <AbsoluteFill style={{ background: '#f5f5f5', fontFamily }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>M</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Marina Properties</div>
              <div style={{ fontSize: 9, color: '#666', marginTop: -1 }}>Dubai Real Estate</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 25 }}>
            {['Buy', 'Rent', 'New Projects', 'Commercial'].map((item, i) => (
              <span key={item} style={{ color: i === 1 ? COLORS.primary : '#444', fontSize: 13, fontWeight: 500 }}>{item}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span style={{ color: '#666', fontSize: 12 }}>🇦🇪 EN</span>
          <div style={{ background: COLORS.primary, color: 'white', padding: '8px 18px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>List Property</div>
        </div>
      </div>
      
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 40px 35px' }}>
        <h1 style={{ color: 'white', fontSize: 32, fontWeight: 700, margin: 0 }}>Find Your Dream Home in Dubai</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '8px 0 25px' }}>5,247 premium properties available</p>
        
        {/* Search Bar */}
        <div style={{ background: 'white', borderRadius: 10, padding: 5, maxWidth: 800, display: 'flex', gap: 4 }}>
          <div style={{ flex: 1.5, background: '#f8f9fa', borderRadius: 6, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>🔍</span>
            <span style={{ color: '#999', fontSize: 13 }}>City, community or building</span>
          </div>
          <div style={{ flex: 0.6, background: '#f8f9fa', borderRadius: 6, padding: '12px 14px', fontSize: 13 }}>Apartment ▼</div>
          <div style={{ flex: 0.6, background: '#f8f9fa', borderRadius: 6, padding: '12px 14px', fontSize: 13 }}>Any Price ▼</div>
          <div style={{ flex: 0.4, background: '#f8f9fa', borderRadius: 6, padding: '12px 14px', fontSize: 13 }}>Beds ▼</div>
          <div style={{ background: COLORS.primary, color: 'white', borderRadius: 6, padding: '12px 30px', fontSize: 14, fontWeight: 600 }}>Search</div>
        </div>
      </div>
      
      {/* Property Grid - 2 rows x 3 columns */}
      <div style={{ padding: '25px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Featured Properties</div>
          <div style={{ fontSize: 13, color: COLORS.primary, fontWeight: 500 }}>View all 247 listings →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PROPERTIES.map((property, i) => (
            <PropertyCard key={i} property={property} />
          ))}
        </div>
      </div>
      
      {/* Chat Widget - TALLER */}
      {showChat && (
        <div style={{ position: 'absolute', bottom: 20, right: 30, width: 420, minHeight: 520, background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          {chatContent}
        </div>
      )}
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
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ textAlign: 'center', transform: `scale(${titleProgress})` }}>
        <div style={{ fontSize: 50, marginBottom: 15 }}>🏢</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: 'white', marginBottom: 12 }}>Dubai Real Estate Agents</div>
        <div style={{ fontSize: 38, fontWeight: 700, background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: subtitleProgress }}>Capture Leads 24/7</div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: 25, opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }) }}>Even when your office is closed 🌙</div>
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
    <PropertySite showChat={frame > 30} chatContent={
      <div style={{ transform: `scale(${chatProgress})`, transformOrigin: 'bottom right' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>M</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Marina Properties</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 }}><span style={{ color: '#f87171' }}>● Offline</span> · Replies in 8 hrs</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>✕</div>
        </div>
        
        <div style={{ padding: 24, minHeight: 380 }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>😴</div>
            <div style={{ color: '#991b1b', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>We're currently offline</div>
            <div style={{ color: '#b91c1c', fontSize: 14, lineHeight: 1.6 }}>Office hours: Sun-Thu, 9 AM - 6 PM<br />Leave a message for tomorrow</div>
          </div>
          
          {frame > 80 && (
            <div style={{ marginTop: 20, background: '#1e293b', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: spring({ frame: frame - 80, fps }) }}>
              <span style={{ fontSize: 22 }}>🌙</span>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>2:47 AM</span>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>in Dubai</span>
            </div>
          )}
        </div>
        
        <div style={{ padding: '14px 16px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <div style={{ background: '#e5e7eb', borderRadius: 20, padding: '12px 16px', color: '#9ca3af', fontSize: 13, textAlign: 'center' }}>Chat unavailable outside office hours</div>
        </div>
      </div>
    } />
  );
};

// Scene 3: Problem
const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { icon: '🌙', text: '68% of inquiries come after office hours', delay: 0 },
    { icon: '💸', text: 'Each lost lead = AED 15-50K commission', delay: 25 },
    { icon: '😤', text: 'Visitors leave to competitors', delay: 50 },
  ];
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ width: '100%', maxWidth: 650, padding: 40 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#ef4444', marginBottom: 35, textAlign: 'center' }}>⚠️ The Problem</div>
        {items.map((item, i) => {
          const progress = spring({ frame: frame - item.delay, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, opacity: progress, transform: `translateX(${(1 - progress) * -40}px)` }}>
              <div style={{ fontSize: 36 }}>{item.icon}</div>
              <div style={{ fontSize: 22, color: 'white' }}>{item.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Solution - Browser Setup UI
const SolutionSetupScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxProgress = spring({ frame, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ transform: `scale(${boxProgress})`, width: 900 }}>
        {/* Browser Window */}
        <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          {/* Browser Header */}
          <div style={{ background: '#0f172a', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{ flex: 1, background: '#1e293b', borderRadius: 6, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#64748b' }}>🔒</span>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>smallerp.ae/dashboard/ai-agents</span>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div style={{ padding: 30, background: '#0f172a' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 25 }}>Create AI Sales Agent</div>
            
            {/* Step 1 */}
            <div style={{ marginBottom: 25 }}>
              <div style={{ color: COLORS.primary, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>STEP 1: Enter your website</div>
              <div style={{ background: '#1e293b', borderRadius: 10, border: '2px solid ' + COLORS.primary, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <span style={{ color: 'white', fontSize: 18, fontFamily: 'monospace' }}>
                  <TypeWriter text="https://marinaproperties.ae" startFrame={20} />
                </span>
              </div>
            </div>
            
            {/* Step 2 */}
            {frame > 80 && (
              <div style={{ marginBottom: 25, opacity: spring({ frame: frame - 80, fps }) }}>
                <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>STEP 2: Select industry</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['🏢 Real Estate', '🛒 E-commerce', '🏥 Healthcare', '📚 Education'].map((item, i) => (
                    <div key={i} style={{ background: i === 0 ? COLORS.primary : '#1e293b', color: 'white', padding: '12px 20px', borderRadius: 8, fontSize: 14, border: i === 0 ? 'none' : '1px solid #334155' }}>{item}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Create Button */}
            {frame > 120 && (
              <div style={{ marginTop: 30, opacity: spring({ frame: frame - 120, fps }), transform: `scale(${spring({ frame: frame - 120, fps })})` }}>
                <div style={{ background: COLORS.gradient, borderRadius: 10, padding: '18px 40px', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 30px rgba(0,166,81,0.3)' }}>
                  <span style={{ fontSize: 22 }}>🚀</span>
                  <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Create AI Agent</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Scanning
const ScanningScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { icon: '🏢', label: '247 Property Listings', delay: 0 },
    { icon: '💰', label: 'Pricing & Payment Plans', delay: 15 },
    { icon: '📍', label: 'Location Details', delay: 30 },
    { icon: '👤', label: 'Agent Information', delay: 45 },
    { icon: '📅', label: 'Viewing Availability', delay: 60 },
  ];
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 550, padding: 40 }}>
        <div style={{ fontSize: 24, color: 'white', marginBottom: 30 }}>🔍 Training AI on marinaproperties.ae...</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => {
            const progress = spring({ frame: frame - item.delay, fps, config: { damping: 12 } });
            const isDone = frame > item.delay + 20;
            return (
              <div key={i} style={{ background: isDone ? 'rgba(0, 166, 81, 0.15)' : 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, opacity: progress, transform: `translateX(${(1 - progress) * -25}px)`, border: isDone ? `1px solid ${COLORS.primary}` : '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 22 }}>{item.icon}</div>
                <div style={{ flex: 1, textAlign: 'left', color: 'white', fontSize: 15 }}>{item.label}</div>
                {isDone && <div style={{ fontSize: 16, color: COLORS.primary }}>✓</div>}
              </div>
            );
          })}
        </div>
        
        {frame > 95 && (
          <div style={{ marginTop: 22, fontSize: 18, color: COLORS.primary, fontWeight: 600, opacity: spring({ frame: frame - 95, fps }) }}>✅ AI Agent Ready!</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Live Chat
const LiveChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const pages = [
    { startFrame: 0, endFrame: 250, messages: [
      { text: "I'm looking for a 2BR in Marina, budget 120K/year", isUser: true, delay: 25 },
      { text: "Hi! 🏠 I found 12 Marina apartments in your budget. Waterfront or city view?", isUser: false, delay: 80, typing: true, typingDots: 25 },
      { text: "Waterfront with parking please", isUser: true, delay: 160 },
      { text: "Perfect! 5 options available. Shall I book a viewing?", isUser: false, delay: 210, typing: true, typingDots: 20 },
    ]},
    { startFrame: 250, endFrame: 450, messages: [
      { text: "Yes, after 5pm works", isUser: true, delay: 15 },
      { text: "Great! I'll book 6pm. What's your name?", isUser: false, delay: 55, typing: true, typingDots: 18 },
      { text: "Sarah Johnson", isUser: true, delay: 100 },
      { text: "Nice to meet you Sarah! Your WhatsApp number?", isUser: false, delay: 140, typing: true, typingDots: 18 },
      { text: "+971 55 123 4567", isUser: true, delay: 190 },
    ]},
    { startFrame: 450, endFrame: 650, messages: [
      { text: "Thanks Sarah! ✅ Viewing booked for tomorrow 6pm. I'll send property details to your WhatsApp now!", isUser: false, delay: 25, typing: true, typingDots: 25 },
    ]},
  ];
  
  const getPageOpacity = (page: typeof pages[0], index: number) => {
    const fadeFrames = 12;
    if (frame < page.startFrame - fadeFrames) return 0;
    if (frame < page.startFrame) return interpolate(frame, [page.startFrame - fadeFrames, page.startFrame], [0, 1]);
    if (frame < page.endFrame - fadeFrames) return 1;
    if (frame < page.endFrame) { if (index < pages.length - 1) return interpolate(frame, [page.endFrame - fadeFrames, page.endFrame], [1, 0]); return 1; }
    if (index === pages.length - 1) return 1;
    return 0;
  };
  
  return (
    <PropertySite showChat chatContent={
      <>
        <div style={{ background: COLORS.gradient, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary }}>M</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                Marina Properties
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>AI</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, marginTop: 1 }}><span style={{ color: '#86efac' }}>● Online 24/7</span></div>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12 }}>🌙</span>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>2:47 AM</span>
          </div>
        </div>
        
        <div style={{ padding: 18, height: 380, overflow: 'hidden', position: 'relative' }}>
          {pages.map((page, pageIndex) => {
            const pageOpacity = getPageOpacity(page, pageIndex);
            if (pageOpacity === 0) return null;
            return (
              <div key={pageIndex} style={{ position: 'absolute', top: 16, left: 16, right: 16, opacity: pageOpacity }}>
                {page.messages.map((msg, i) => (
                  <div key={i}>
                    {!msg.isUser && msg.typingDots && <TypingIndicator startFrame={page.startFrame + msg.delay - msg.typingDots} duration={msg.typingDots - 4} />}
                    <ChatBubble message={msg.text} isUser={msg.isUser} delay={page.startFrame + msg.delay} typing={msg.typing} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        
        <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, background: '#fafafa' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 20, padding: '10px 16px', color: '#999', fontSize: 13, border: '1px solid #e5e7eb' }}>Type a message...</div>
          <div style={{ width: 38, height: 38, background: COLORS.gradient, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>➤</div>
        </div>
      </>
    } />
  );
};

// Scene 7: WhatsApp Notification
const WhatsAppNotificationScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneProgress = spring({ frame, fps, config: { damping: 12 } });
  const notifProgress = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 80 } });
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.7)', marginBottom: 25 }}>Meanwhile, you wake up to...</div>
        
        {/* iPhone Frame */}
        <div style={{ background: '#1a1a1a', borderRadius: 45, padding: 10, width: 320, margin: '0 auto', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: `scale(${phoneProgress})` }}>
          {/* Screen */}
          <div style={{ background: 'linear-gradient(180deg, #075E54 0%, #128C7E 100%)', borderRadius: 38, overflow: 'hidden' }}>
            {/* Status Bar */}
            <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>9:41</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: 12 }}>📶</span>
                <span style={{ color: 'white', fontSize: 12 }}>🔋</span>
              </div>
            </div>
            
            {/* WhatsApp Header */}
            <div style={{ background: '#075E54', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'white', fontSize: 18 }}>←</span>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>M</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Marina Properties AI</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>online</div>
              </div>
            </div>
            
            {/* Chat Background */}
            <div style={{ background: '#ECE5DD', minHeight: 340, padding: 16 }}>
              {/* AI Message */}
              {frame > 30 && (
                <div style={{ opacity: notifProgress, transform: `translateY(${(1 - notifProgress) * 20}px)` }}>
                  <div style={{ background: 'white', padding: 14, borderRadius: '12px 12px 12px 0', maxWidth: 260, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: '#303030' }}>
                      🎉 <strong>New Lead Captured!</strong><br /><br />
                      <strong>Sarah Johnson</strong><br />
                      📱 +971 55 123 4567<br />
                      🏠 2BR Marina Waterfront<br />
                      📅 Viewing: Tomorrow 6pm<br /><br />
                      <span style={{ color: '#128C7E' }}>Lead captured at 2:47 AM 🌙</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#8696a0', textAlign: 'right', marginTop: 6 }}>2:48 AM ✓✓</div>
                  </div>
                </div>
              )}
              
              {/* Property Image Message */}
              {frame > 70 && (
                <div style={{ marginTop: 10, opacity: spring({ frame: frame - 70, fps }), transform: `translateY(${(1 - spring({ frame: frame - 70, fps })) * 15}px)` }}>
                  <div style={{ background: 'white', padding: 6, borderRadius: 12, maxWidth: 220, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <Img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=180&fit=crop" style={{ width: '100%', borderRadius: 8 }} />
                    <div style={{ padding: '8px 6px', fontSize: 11, color: '#303030' }}>
                      📍 2BR Marina Waterfront<br />
                      💰 AED 120,000/year
                    </div>
                    <div style={{ fontSize: 10, color: '#8696a0', textAlign: 'right', paddingRight: 6 }}>2:48 AM ✓✓</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Home Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <div style={{ width: 120, height: 4, background: '#333', borderRadius: 2 }} />
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
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <div style={{ textAlign: 'center', transform: `scale(${mainProgress})` }}>
        <div style={{ fontSize: 45, marginBottom: 18 }}>🏢</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 10 }}>Stop Losing Leads</div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', marginBottom: 30 }}>Let AI work while you sleep</div>
        
        <div style={{ background: COLORS.gradient, padding: '16px 40px', borderRadius: 12, display: 'inline-block', transform: `scale(${pulseScale})`, boxShadow: '0 10px 40px rgba(0, 166, 81, 0.3)' }}>
          <div style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>Try Free for 14 Days</div>
        </div>
        
        <div style={{ marginTop: 22, fontSize: 16, color: 'rgba(255,255,255,0.5)', opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }) }}>smallerp.ae/real-estate</div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const RealEstateDubai = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark, fontFamily }}>
      <Sequence from={0} durationInFrames={90}><HookScene /></Sequence>
      <Sequence from={90} durationInFrames={140}><OfflineChatScene /></Sequence>
      <Sequence from={230} durationInFrames={100}><ProblemScene /></Sequence>
      <Sequence from={330} durationInFrames={160}><SolutionSetupScene /></Sequence>
      <Sequence from={490} durationInFrames={130}><ScanningScene /></Sequence>
      <Sequence from={620} durationInFrames={650}><LiveChatScene /></Sequence>
      <Sequence from={1270} durationInFrames={140}><WhatsAppNotificationScene /></Sequence>
      <Sequence from={1410} durationInFrames={190}><CTAScene /></Sequence>
    </AbsoluteFill>
  );
};
