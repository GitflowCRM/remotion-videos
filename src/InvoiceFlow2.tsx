import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  useVideoConfig,
  spring,
} from 'remotion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  StatusBadge,
  Input,
  Select,
  Avatar,
  Sidebar,
  SidebarLogo,
  SidebarNav,
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

// Animated entry wrapper
const AnimatedEntry: React.FC<{
  children: React.ReactNode;
  delay: number;
  direction?: 'up' | 'right' | 'left';
}> = ({ children, delay, direction = 'up' }) => {
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

  const transforms = {
    up: `translateY(${(1 - progress) * 30}px)`,
    right: `translateX(${(1 - progress) * 30}px)`,
    left: `translateX(${(progress - 1) * 30}px)`,
  };

  return (
    <div style={{ opacity, transform: transforms[direction] }}>
      {children}
    </div>
  );
};

// Typing animation
const TypedText: React.FC<{
  text: string;
  startFrame: number;
  speed?: number;
}> = ({ text, startFrame, speed = 3 }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor((frame - startFrame) / speed);
  if (frame < startFrame) return null;
  return <>{text.slice(0, Math.min(charsToShow, text.length))}</>;
};

// Cursor blink
const Cursor: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height: '1em',
        backgroundColor: theme.primary,
        marginLeft: 2,
        opacity: blink ? 1 : 0,
      }}
    />
  );
};

// Click ripple effect
const ClickEffect: React.FC<{ x: number; y: number; startFrame: number }> = ({ x, y, startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0 || elapsed > 30) return null;
  
  const scale = interpolate(elapsed, [0, 30], [0.5, 2.5]);
  const opacity = interpolate(elapsed, [0, 30], [0.7, 0]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: `3px solid ${theme.primary}`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Line item component
const LineItem: React.FC<{
  item: string;
  qty: number;
  price: number;
  delay: number;
}> = ({ item, qty, price, delay }) => {
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

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 16,
        padding: '16px 0',
        borderBottom: `1px solid ${theme.border}`,
        opacity,
        transform: `translateX(${(1 - progress) * 40}px)`,
      }}
    >
      <div style={{ color: theme.text, fontSize: 15 }}>{item}</div>
      <div style={{ color: theme.muted, fontSize: 15, textAlign: 'center' }}>{qty}</div>
      <div style={{ color: theme.muted, fontSize: 15, textAlign: 'right' }}>AED {price.toLocaleString()}</div>
      <div style={{ color: theme.text, fontSize: 15, textAlign: 'right', fontWeight: 600 }}>
        AED {(qty * price).toLocaleString()}
      </div>
    </div>
  );
};

// Summary component
const InvoiceSummary: React.FC<{ subtotal: number; vat: number; delay: number }> = ({
  subtotal,
  vat,
  delay,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const countProgress = interpolate(frame - delay - 15, [0, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const total = subtotal + vat;

  return (
    <Card style={{ marginTop: 24, opacity }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: theme.muted, fontSize: 15 }}>Subtotal</span>
          <span style={{ color: theme.text, fontSize: 15 }}>
            AED {Math.floor(subtotal * countProgress).toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: theme.muted, fontSize: 15 }}>VAT (5%)</span>
          <span style={{ color: theme.text, fontSize: 15 }}>
            AED {Math.floor(vat * countProgress).toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <span style={{ color: theme.text, fontSize: 20, fontWeight: 600 }}>Total</span>
          <span style={{ color: theme.primary, fontSize: 28, fontWeight: 700 }}>
            AED {Math.floor(total * countProgress).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Invoice Flow component
export const InvoiceFlow2: React.FC = () => {
  const frame = useCurrentFrame();
  
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  
  const buttonPulse = frame > 480 ? 1 + Math.sin((frame - 480) / 6) * 0.04 : 1;
  const buttonGlow = frame > 480 ? 0.4 + Math.sin((frame - 480) / 6) * 0.4 : 0;

  const navItems = [
    { icon: '📊', label: 'Dashboard', active: false },
    { icon: '💳', label: 'Transactions', active: false },
    { icon: '📄', label: 'Sales Invoices', active: true },
    { icon: '📦', label: 'Inventory', active: false },
    { icon: '👥', label: 'Customers', active: false },
  ];

  // Customer dropdown state
  const dropdownOpen = frame >= 60 && frame < 130;
  const customerSelected = frame >= 120;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Sidebar using component */}
      <Sidebar style={{ opacity: headerOpacity }}>
        <SidebarLogo />
        <SidebarNav items={navItems} />
      </Sidebar>
      
      {/* Main content */}
      <div style={{ marginLeft: 240, padding: 36 }}>
        {/* Header */}
        <div style={{ marginBottom: 28, opacity: headerOpacity }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ color: theme.dim, cursor: 'pointer', fontSize: 15 }}>← Back to Invoices</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
              New Invoice
            </h1>
            <StatusBadge status="draft" />
          </div>
          <p style={{ color: theme.dim, fontSize: 15, margin: '10px 0 0 0' }}>
            Create a new invoice for a client
          </p>
        </div>

        <div style={{ display: 'flex', gap: 36 }}>
          {/* Left: Line Items */}
          <div style={{ flex: 2 }}>
            <AnimatedEntry delay={20}>
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Header row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      gap: 16,
                      padding: '10px 0',
                      borderBottom: `2px solid ${theme.border}`,
                      color: theme.dim,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: 600,
                    }}
                  >
                    <div>Item</div>
                    <div style={{ textAlign: 'center' }}>Qty</div>
                    <div style={{ textAlign: 'right' }}>Price</div>
                    <div style={{ textAlign: 'right' }}>Total</div>
                  </div>
                  
                  <LineItem item="Web Development Services" qty={1} price={5000} delay={200} />
                  <LineItem item="UI/UX Design Package" qty={1} price={2500} delay={260} />
                  <LineItem item="Monthly Hosting (12 months)" qty={12} price={50} delay={320} />
                  
                  {/* Add item button */}
                  <AnimatedEntry delay={360}>
                    <Button
                      variant="ghost"
                      style={{
                        width: '100%',
                        marginTop: 20,
                        border: `2px dashed ${theme.border}`,
                        color: theme.dim,
                      }}
                    >
                      + Add Line Item
                    </Button>
                  </AnimatedEntry>
                </CardContent>
              </Card>
            </AnimatedEntry>
          </div>

          {/* Right: Details */}
          <div style={{ flex: 1 }}>
            <AnimatedEntry delay={30}>
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Customer dropdown */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: theme.muted, display: 'block', marginBottom: 6 }}>
                      Customer *
                    </label>
                    <div
                      style={{
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: 40,
                          padding: '0 14px',
                          backgroundColor: theme.bg,
                          border: dropdownOpen ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                          borderRadius: 8,
                          color: customerSelected ? theme.text : theme.dim,
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {customerSelected && <Avatar name="Acme Corporation" size="sm" />}
                          <span>{customerSelected ? 'Acme Corporation' : 'Select customer...'}</span>
                        </div>
                        <span style={{ color: theme.muted, transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                      </div>
                      
                      {/* Dropdown menu */}
                      {dropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: theme.card,
                            border: `1px solid ${theme.border}`,
                            borderRadius: 8,
                            marginTop: 4,
                            overflow: 'hidden',
                            zIndex: 10,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                          }}
                        >
                          {['Acme Corporation', 'Tech Solutions LLC', 'Global Trade Co'].map((customer, i) => (
                            <div
                              key={i}
                              style={{
                                padding: '12px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                backgroundColor: i === 0 && frame >= 115 ? theme.primary : 'transparent',
                                color: theme.text,
                              }}
                            >
                              <Avatar name={customer} size="sm" />
                              <span>{customer}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <AnimatedEntry delay={140}>
                    <Input
                      label="Invoice Number"
                      value={frame >= 150 ? 'INV-2024-0048' : ''}
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </AnimatedEntry>

                  <div style={{ height: 20 }} />

                  <AnimatedEntry delay={170}>
                    <Input
                      label="Due Date"
                      value={frame >= 180 ? 'February 15, 2024' : ''}
                      placeholder="Select date..."
                      readOnly
                    />
                  </AnimatedEntry>
                </CardContent>
              </Card>
            </AnimatedEntry>
            
            {/* Summary */}
            <InvoiceSummary subtotal={8100} vat={405} delay={380} />
            
            {/* Create button */}
            <AnimatedEntry delay={460}>
              <Button
                style={{
                  width: '100%',
                  marginTop: 24,
                  height: 48,
                  fontSize: 16,
                  transform: `scale(${buttonPulse})`,
                  boxShadow: `0 0 ${buttonGlow * 40}px rgba(99, 102, 241, ${buttonGlow})`,
                }}
              >
                Create Invoice →
              </Button>
            </AnimatedEntry>
          </div>
        </div>
      </div>
      
      {/* Click effects */}
      <ClickEffect x={1480} y={280} startFrame={60} />
      <ClickEffect x={1480} y={340} startFrame={118} />
    </AbsoluteFill>
  );
};
