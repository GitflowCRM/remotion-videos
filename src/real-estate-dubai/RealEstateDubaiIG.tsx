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

// Property data
const PROPERTIES = [
  { title: '2BR Marina Apt', price: 'AED 120K', period: '/yr', location: 'Dubai Marina', beds: 2, baths: 2, sqft: '1,250', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', tag: 'VERIFIED' },
  { title: 'Luxury Penthouse', price: 'AED 3.5M', period: '', location: 'Palm Jumeirah', beds: 4, baths: 5, sqft: '4,800', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', tag: 'PREMIUM' },
  { title: 'Beachfront Villa', price: 'AED 8.9M', period: '', location: 'JBR', beds: 5, baths: 6, sqft: '6,200', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop', tag: 'NEW' },
  { title: 'Studio Downtown', price: 'AED 55K', period: '/yr', location: 'Downtown', beds: 0, baths: 1, sqft: '450', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', tag: 'HOT' },
];

// Typing indicator
const TypingIndicator = ({ startFrame, duration }: { startFrame: number; duration: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 100 } });
  
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12, opacity: progress }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.gradient, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>M</span>
      </div>
      <div style={{ background: '#f1f5f9', padding: '14px 18px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8', opacity: interpolate(Math.sin((frame - startFrame) * 0.3 + i * 1.2), [-1, 1], [0.3, 1]), transform: `translateY(${Math.sin((frame - startFrame) * 0.3 + i * 1.2) * -2}px)` }} />
        ))}
      </div>
    </div>
  );
};

// Typing animation
const TypeWriter = ({ text, startFrame }: { text: string; startFrame: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsToShow = Math.min(Math.floor((frame - startFrame) * 1.5), text.length);
  const opacity = spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 20 } });
  if (frame < startFrame) return null;
  return <span style={{ opacity }}>{text.slice(0, charsToShow)}</span>;
};

// Chat message component
const ChatMessage = ({ isUser, children, startFrame, avatar }: { isUser: boolean; children: React.ReactNode; startFrame: number; avatar?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame) return null;
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 15, stiffness: 120 } });
  
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 14, opacity: progress, transform: `translateY(${(1 - progress) * 20}px)` }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatar ? 'transparent' : COLORS.gradient, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {avatar ? <Img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>M</span>}
        </div>
      )}
      <div style={{ maxWidth: '80%', padding: '14px 18px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isUser ? COLORS.gradient : '#f1f5f9', color: isUser ? 'white' : COLORS.text, fontSize: 17, lineHeight: 1.5, fontFamily, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {children}
      </div>
    </div>
  );
};

// Property card for vertical layout
const PropertyCardVertical = ({ property, delay }: { property: typeof PROPERTIES[0]; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
  if (frame < delay) return null;
  
  const tagColors: Record<string, string> = { NEW: '#00a651', HOT: '#ef4444', VERIFIED: '#3b82f6', PREMIUM: '#f59e0b' };
  
  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', opacity: progress, transform: `scale(${0.9 + progress * 0.1})`, width: '100%' }}>
      <div style={{ position: 'relative', height: 180 }}>
        <Img src={property.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: tagColors[property.tag] || COLORS.primary, color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily }}>{property.tag}</div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ color: COLORS.primary, fontWeight: 800, fontSize: 22, fontFamily }}>{property.price}<span style={{ fontSize: 14, color: COLORS.textLight, fontWeight: 400 }}>{property.period}</span></div>
        <div style={{ fontWeight: 600, fontSize: 17, color: COLORS.text, marginTop: 4, fontFamily }}>{property.title}</div>
        <div style={{ color: COLORS.textLight, fontSize: 14, marginTop: 4, fontFamily, display: 'flex', alignItems: 'center', gap: 4 }}>📍 {property.location}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, color: COLORS.textLight, fontSize: 13, fontFamily }}>
          <span>🛏️ {property.beds}</span>
          <span>🚿 {property.baths}</span>
          <span>📐 {property.sqft}</span>
        </div>
      </div>
    </div>
  );
};

// Scene: Problem - Offline Chat (Vertical)
const SceneOfflineChatVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: '#0f172a', fontFamily }}>
      {/* Header */}
      <div style={{ padding: '60px 40px 30px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', fontSize: 18, fontWeight: 600, marginBottom: 12, opacity: spring({ frame, fps }) }}>😤 THE PROBLEM</div>
        <div style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.3, opacity: spring({ frame: frame - 10, fps }) }}>Your Chat Widget<br/>Sleeps at Night</div>
      </div>
      
      {/* Phone mockup with chat */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {/* Chat header */}
          <div style={{ background: COLORS.gradient, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>M</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Marina Properties</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                Offline · Replies in 8 hrs
              </div>
            </div>
          </div>
          
          {/* Offline message */}
          <div style={{ padding: 30, minHeight: 400 }}>
            <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: 20, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>😴</div>
              <div style={{ color: '#991b1b', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>We're currently offline</div>
              <div style={{ color: '#b91c1c', fontSize: 16, lineHeight: 1.6 }}>Office hours: Sun-Thu<br/>9 AM - 6 PM</div>
            </div>
            
            {frame > 60 && (
              <div style={{ marginTop: 24, background: '#1e293b', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: spring({ frame: frame - 60, fps }) }}>
                <span style={{ fontSize: 26 }}>🌙</span>
                <span style={{ color: 'white', fontSize: 22, fontWeight: 600 }}>2:47 AM</span>
                <span style={{ color: '#94a3b8', fontSize: 16 }}>in Dubai</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom text */}
      <div style={{ padding: '30px 40px 80px', textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: 18, opacity: spring({ frame: frame - 80, fps }) }}>
          Leads don't wait for office hours ⏰
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene: Solution - AI Chat (Vertical)
const SceneAIChatVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: '#0f172a', fontFamily }}>
      {/* Header */}
      <div style={{ padding: '60px 40px 20px', textAlign: 'center' }}>
        <div style={{ color: COLORS.primary, fontSize: 18, fontWeight: 600, marginBottom: 12, opacity: spring({ frame, fps }) }}>✨ THE SOLUTION</div>
        <div style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.3, opacity: spring({ frame: frame - 10, fps }) }}>AI That Never Sleeps</div>
      </div>
      
      {/* Phone mockup with live chat */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px 40px' }}>
        <div style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {/* Chat header */}
          <div style={{ background: COLORS.gradient, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>M</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Marina Properties</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                Online · AI Assistant
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div style={{ padding: 20, height: 480, overflow: 'hidden' }}>
            <ChatMessage isUser={true} startFrame={20}>
              Hi, looking for 2BR in Marina under 130K
            </ChatMessage>
            
            <TypingIndicator startFrame={50} duration={40} />
            
            <ChatMessage isUser={false} startFrame={90}>
              <TypeWriter text="Perfect! I found 3 options matching your criteria 🏠" startFrame={90} />
            </ChatMessage>
            
            {/* Property card in chat */}
            {frame > 130 && (
              <div style={{ margin: '16px 0', opacity: spring({ frame: frame - 130, fps }) }}>
                <div style={{ background: '#f8fafc', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <Img src={PROPERTIES[0].img} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 18 }}>{PROPERTIES[0].price}<span style={{ color: COLORS.textLight, fontSize: 13 }}>/yr</span></div>
                    <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>{PROPERTIES[0].title}</div>
                    <div style={{ color: COLORS.textLight, fontSize: 13 }}>📍 {PROPERTIES[0].location}</div>
                  </div>
                </div>
              </div>
            )}
            
            <ChatMessage isUser={true} startFrame={180}>
              Can I schedule a viewing?
            </ChatMessage>
            
            <TypingIndicator startFrame={210} duration={30} />
            
            <ChatMessage isUser={false} startFrame={240}>
              <TypeWriter text="Absolutely! I'll get your details 📝" startFrame={240} />
            </ChatMessage>
          </div>
        </div>
      </div>
      
      {/* Bottom badge */}
      <div style={{ padding: '20px 40px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,166,81,0.2)', padding: '12px 24px', borderRadius: 30, opacity: spring({ frame: frame - 100, fps }) }}>
          <span style={{ color: '#4ade80', fontSize: 16 }}>●</span>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>24/7 Instant Response</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene: WhatsApp Notification (Vertical)
const SceneWhatsAppVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #075e54 0%, #128c7e 100%)', fontFamily }}>
      {/* Header */}
      <div style={{ padding: '60px 40px 30px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: 600, marginBottom: 12, opacity: spring({ frame, fps }) }}>📲 INSTANT LEADS</div>
        <div style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.3, opacity: spring({ frame: frame - 10, fps }) }}>Leads Straight to<br/>Your WhatsApp</div>
      </div>
      
      {/* iPhone mockup */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ width: '100%', maxWidth: 380, background: '#000', borderRadius: 50, padding: 12, boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
          {/* iPhone notch */}
          <div style={{ background: '#000', height: 36, borderRadius: '40px 40px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 6 }}>
            <div style={{ width: 100, height: 28, background: '#000', borderRadius: 20 }} />
          </div>
          
          {/* WhatsApp chat screen */}
          <div style={{ background: '#ece5dd', borderRadius: '0 0 38px 38px', overflow: 'hidden' }}>
            {/* WhatsApp header */}
            <div style={{ background: '#075e54', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ color: 'white', fontSize: 18 }}>←</div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>🤖</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>LeadFlow AI</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>online</div>
              </div>
            </div>
            
            {/* Chat area */}
            <div style={{ padding: 16, minHeight: 500, background: 'url(https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png)', backgroundSize: 'contain' }}>
              {/* Incoming message with property */}
              {frame > 40 && (
                <div style={{ maxWidth: '85%', opacity: spring({ frame: frame - 40, fps }), transform: `translateY(${(1 - spring({ frame: frame - 40, fps })) * 30}px)` }}>
                  <div style={{ background: 'white', borderRadius: '0 12px 12px 12px', padding: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <div style={{ color: '#25D366', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>🤖 New Lead Captured!</div>
                    
                    {/* Property image */}
                    <Img src={PROPERTIES[0].img} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                    
                    <div style={{ fontSize: 15, color: '#303030', lineHeight: 1.5 }}>
                      <strong>Property Interest:</strong><br/>
                      {PROPERTIES[0].title} - {PROPERTIES[0].price}/yr<br/><br/>
                      <strong>Lead Details:</strong><br/>
                      👤 Ahmed Al-Rashid<br/>
                      📱 +971 50 XXX XXXX<br/>
                      ✉️ ahmed@email.com<br/><br/>
                      💬 "Can I schedule a viewing for this weekend?"
                    </div>
                    
                    <div style={{ textAlign: 'right', fontSize: 11, color: '#667781', marginTop: 6, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                      2:47 AM
                      <span style={{ color: '#53bdeb' }}>✓✓</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick reply buttons */}
              {frame > 120 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, opacity: spring({ frame: frame - 120, fps }) }}>
                  <div style={{ background: 'white', padding: '12px 16px', borderRadius: 20, textAlign: 'center', color: '#075e54', fontWeight: 600, fontSize: 14, border: '1px solid #25D366' }}>📞 Call Lead</div>
                  <div style={{ background: 'white', padding: '12px 16px', borderRadius: 20, textAlign: 'center', color: '#075e54', fontWeight: 600, fontSize: 14, border: '1px solid #25D366' }}>📅 Schedule Viewing</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom text */}
      <div style={{ padding: '30px 40px 80px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: 600, opacity: spring({ frame: frame - 80, fps }) }}>
          Never miss a lead again 🎯
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene: Property Showcase (Vertical)
const ScenePropertiesVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: COLORS.background, fontFamily }}>
      {/* Header */}
      <div style={{ padding: '60px 30px 20px' }}>
        <div style={{ color: COLORS.primary, fontSize: 16, fontWeight: 600, marginBottom: 8, opacity: spring({ frame, fps }) }}>🏠 YOUR LISTINGS</div>
        <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 800, lineHeight: 1.3, opacity: spring({ frame: frame - 10, fps }) }}>AI Learns Your<br/>Entire Inventory</div>
      </div>
      
      {/* Property cards - vertical scroll style */}
      <div style={{ flex: 1, padding: '10px 30px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        {PROPERTIES.map((property, i) => (
          <PropertyCardVertical key={i} property={property} delay={30 + i * 25} />
        ))}
      </div>
      
      {/* Bottom stats */}
      <div style={{ padding: '20px 30px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, opacity: spring({ frame: frame - 140, fps }) }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: COLORS.primary, fontSize: 28, fontWeight: 800 }}>247</div>
            <div style={{ color: COLORS.textLight, fontSize: 13 }}>Listings</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: COLORS.primary, fontSize: 28, fontWeight: 800 }}>24/7</div>
            <div style={{ color: COLORS.textLight, fontSize: 13 }}>Available</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: COLORS.primary, fontSize: 28, fontWeight: 800 }}>&lt;3s</div>
            <div style={{ color: COLORS.textLight, fontSize: 13 }}>Response</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene: CTA (Vertical)
const SceneCTAVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: COLORS.dark, fontFamily, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      {/* Logo/Brand */}
      <div style={{ width: 100, height: 100, borderRadius: 24, background: COLORS.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, boxShadow: '0 20px 60px rgba(0,166,81,0.4)', opacity: spring({ frame, fps }), transform: `scale(${spring({ frame, fps })})` }}>
        <span style={{ fontSize: 50 }}>🤖</span>
      </div>
      
      <div style={{ color: 'white', fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 20, opacity: spring({ frame: frame - 20, fps }) }}>
        Turn Visitors<br/>Into Leads
      </div>
      
      <div style={{ color: '#94a3b8', fontSize: 18, textAlign: 'center', marginBottom: 50, lineHeight: 1.6, opacity: spring({ frame: frame - 40, fps }) }}>
        24/7 AI chat that qualifies leads<br/>and sends them to your WhatsApp
      </div>
      
      {/* CTA Button */}
      <div style={{ background: COLORS.gradient, padding: '20px 50px', borderRadius: 16, opacity: spring({ frame: frame - 60, fps }), transform: `scale(${0.9 + spring({ frame: frame - 60, fps }) * 0.1})`, boxShadow: '0 10px 40px rgba(0,166,81,0.4)' }}>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>Get Started Free →</span>
      </div>
      
      {/* Features */}
      <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', gap: 16, opacity: spring({ frame: frame - 80, fps }) }}>
        {['No credit card required', 'Setup in 5 minutes', 'Works on any website'].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: COLORS.primary, fontSize: 18 }}>✓</span>
            <span style={{ color: '#94a3b8', fontSize: 16 }}>{text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Main composition - Instagram Vertical (1080x1920)
export const RealEstateDubaiIG: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.dark }}>
      <Sequence from={0} durationInFrames={160}>
        <SceneOfflineChatVertical />
      </Sequence>
      
      <Sequence from={160} durationInFrames={280}>
        <SceneAIChatVertical />
      </Sequence>
      
      <Sequence from={440} durationInFrames={200}>
        <SceneWhatsAppVertical />
      </Sequence>
      
      <Sequence from={640} durationInFrames={180}>
        <ScenePropertiesVertical />
      </Sequence>
      
      <Sequence from={820} durationInFrames={180}>
        <SceneCTAVertical />
      </Sequence>
    </AbsoluteFill>
  );
};
