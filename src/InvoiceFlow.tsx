import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
} from 'remotion';

// Typing animation for text
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
  const blink = Math.floor(frame / 15) % 2 === 0;
  
  if (!visible) return null;
  
  return (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height: '1em',
        backgroundColor: '#6366f1',
        marginLeft: 2,
        opacity: blink ? 1 : 0,
      }}
    />
  );
};

// Click ripple effect
const ClickEffect: React.FC<{ x: number; y: number; startFrame: number }> = ({
  x,
  y,
  startFrame,
}) => {
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
        border: '3px solid #6366f1',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Sidebar component
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        backgroundColor: '#1e293b',
        padding: '24px 0',
        opacity,
      }}
    >
      <div style={{ padding: '0 20px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#6366f1',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            SE
          </div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>SmallERP</span>
        </div>
      </div>
      
      {[
        { icon: '📊', label: 'Dashboard', active: false },
        { icon: '💳', label: 'Transactions', active: false },
        { icon: '📄', label: 'Sales Invoices', active: true },
        { icon: '📦', label: 'Inventory', active: false },
        { icon: '👥', label: 'Customers', active: false },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: item.active ? '#334155' : 'transparent',
            borderLeft: item.active ? '3px solid #6366f1' : '3px solid transparent',
            color: item.active ? 'white' : '#94a3b8',
            fontSize: 15,
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Form field component
const FormField: React.FC<{
  label: string;
  value: string;
  typing?: boolean;
  typingStart?: number;
  filled?: boolean;
  delay: number;
}> = ({ label, value, typing, typingStart = 0, filled, delay }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ marginBottom: 20, opacity }}>
      <label style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8, display: 'block' }}>
        {label}
      </label>
      <div
        style={{
          backgroundColor: '#0f172a',
          border: typing ? '2px solid #6366f1' : '1px solid #334155',
          borderRadius: 10,
          padding: '14px 16px',
          color: 'white',
          fontSize: 15,
          minHeight: 22,
        }}
      >
        {typing ? (
          <>
            <TypedText text={value} startFrame={typingStart} speed={3} />
            <Cursor visible={frame < typingStart + value.length * 3 + 20} />
          </>
        ) : filled ? (
          value
        ) : (
          <span style={{ color: '#64748b' }}>Enter {label.toLowerCase()}...</span>
        )}
      </div>
    </div>
  );
};

// Dropdown with animation
const Dropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  selectedIndex: number;
  delay: number;
  openFrame: number;
  selectFrame: number;
}> = ({ label, value, options, isOpen, selectedIndex, delay, openFrame, selectFrame }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const dropdownHeight = interpolate(
    frame - openFrame,
    [0, 15],
    [0, options.length * 50],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  
  const showDropdown = frame >= openFrame && frame < selectFrame + 10;
  const isSelected = frame >= selectFrame;

  return (
    <div style={{ marginBottom: 20, opacity, position: 'relative' }}>
      <label style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8, display: 'block' }}>
        {label} *
      </label>
      <div
        style={{
          backgroundColor: '#0f172a',
          border: showDropdown ? '2px solid #6366f1' : '1px solid #334155',
          borderRadius: 10,
          padding: '14px 16px',
          color: isSelected ? 'white' : '#64748b',
          fontSize: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{isSelected ? value : `Select ${label.toLowerCase()}...`}</span>
        <span style={{ color: '#64748b', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
      </div>
      
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 10,
            marginTop: 6,
            overflow: 'hidden',
            height: dropdownHeight,
            zIndex: 10,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          {options.map((opt, i) => {
            const isHighlighted = i === selectedIndex && frame >= selectFrame - 15;
            return (
              <div
                key={i}
                style={{
                  padding: '14px 16px',
                  color: 'white',
                  fontSize: 15,
                  backgroundColor: isHighlighted ? '#6366f1' : 'transparent',
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Line item row
const LineItem: React.FC<{
  item: string;
  qty: number;
  price: number;
  delay: number;
}> = ({ item, qty, price, delay }) => {
  const frame = useCurrentFrame();
  
  const slideIn = interpolate(frame - delay, [0, 25], [40, 0], {
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
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 16,
        padding: '16px 0',
        borderBottom: '1px solid #334155',
        opacity,
        transform: `translateX(${slideIn}px)`,
      }}
    >
      <div style={{ color: 'white', fontSize: 15 }}>{item}</div>
      <div style={{ color: '#94a3b8', fontSize: 15, textAlign: 'center' }}>{qty}</div>
      <div style={{ color: '#94a3b8', fontSize: 15, textAlign: 'right' }}>AED {price.toLocaleString()}</div>
      <div style={{ color: 'white', fontSize: 15, textAlign: 'right', fontWeight: 600 }}>
        AED {(qty * price).toLocaleString()}
      </div>
    </div>
  );
};

// Summary with animated total
const Summary: React.FC<{ subtotal: number; vat: number; delay: number }> = ({
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
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        opacity,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#94a3b8', fontSize: 15 }}>Subtotal</span>
        <span style={{ color: 'white', fontSize: 15 }}>
          AED {Math.floor(subtotal * countProgress).toLocaleString()}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ color: '#94a3b8', fontSize: 15 }}>VAT (5%)</span>
        <span style={{ color: 'white', fontSize: 15 }}>
          AED {Math.floor(vat * countProgress).toLocaleString()}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid #334155',
        }}
      >
        <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Total</span>
        <span style={{ color: '#6366f1', fontSize: 28, fontWeight: 700 }}>
          AED {Math.floor(total * countProgress).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Main Invoice Flow component - Extended to ~18 seconds (540 frames)
export const InvoiceFlow: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Timeline for 18 seconds:
  // 0-40: Page loads, form appears
  // 40-120: Customer dropdown opens and selects
  // 120-200: Form fields fill
  // 200-380: Line items appear one by one (slower)
  // 380-480: Summary animates
  // 480-540: Create button pulses

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  
  const buttonPulse = frame > 480 ? 1 + Math.sin((frame - 480) / 6) * 0.04 : 1;
  const buttonGlow = frame > 480 ? 0.4 + Math.sin((frame - 480) / 6) * 0.4 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Sidebar />
      
      {/* Main content */}
      <div style={{ marginLeft: 240, padding: 36 }}>
        {/* Header */}
        <div style={{ marginBottom: 28, opacity: headerOpacity }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ color: '#64748b', cursor: 'pointer', fontSize: 15 }}>← Back to Invoices</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 700, margin: 0 }}>
            New Invoice
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, margin: '10px 0 0 0' }}>
            Create a new invoice for a client
          </p>
        </div>

        <div style={{ display: 'flex', gap: 36 }}>
          {/* Left: Line Items */}
          <div style={{ flex: 2 }}>
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: 12,
                padding: 28,
                opacity: interpolate(frame - 20, [0, 20], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 600, margin: '0 0 24px 0' }}>
                Line Items
              </h2>
              
              {/* Header row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: 16,
                  padding: '10px 0',
                  borderBottom: '2px solid #334155',
                  color: '#64748b',
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <div>Item</div>
                <div style={{ textAlign: 'center' }}>Qty</div>
                <div style={{ textAlign: 'right' }}>Price</div>
                <div style={{ textAlign: 'right' }}>Total</div>
              </div>
              
              {/* Line items - more spread out timing */}
              <LineItem item="Web Development Services" qty={1} price={5000} delay={200} />
              <LineItem item="UI/UX Design Package" qty={1} price={2500} delay={260} />
              <LineItem item="Monthly Hosting (12 months)" qty={12} price={50} delay={320} />
              
              {/* Add item button */}
              <div
                style={{
                  padding: '20px 0',
                  opacity: interpolate(frame - 360, [0, 15], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px dashed #334155',
                    borderRadius: 10,
                    padding: '14px 24px',
                    color: '#64748b',
                    fontSize: 15,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  + Add Line Item
                </button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: 12,
                padding: 28,
                opacity: interpolate(frame - 30, [0, 20], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 600, margin: '0 0 24px 0' }}>
                Details
              </h2>
              
              <Dropdown
                label="Customer"
                value="Acme Corporation"
                options={['Acme Corporation', 'Tech Solutions LLC', 'Global Trade Co']}
                isOpen={frame >= 60 && frame < 130}
                selectedIndex={0}
                delay={40}
                openFrame={60}
                selectFrame={120}
              />
              
              <FormField
                label="Invoice Number"
                value="INV-2024-0048"
                filled={frame >= 150}
                delay={140}
              />
              
              <FormField
                label="Due Date"
                value="February 15, 2024"
                filled={frame >= 180}
                delay={170}
              />
            </div>
            
            {/* Summary */}
            <Summary subtotal={8100} vat={405} delay={380} />
            
            {/* Create button */}
            <button
              style={{
                width: '100%',
                marginTop: 24,
                padding: '18px 28px',
                backgroundColor: '#6366f1',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
                transform: `scale(${buttonPulse})`,
                boxShadow: `0 0 ${buttonGlow * 40}px rgba(16, 185, 129, ${buttonGlow})`,
                opacity: interpolate(frame - 460, [0, 15], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              Create Invoice →
            </button>
          </div>
        </div>
      </div>
      
      {/* Click effects */}
      <ClickEffect x={1480} y={280} startFrame={60} />
      <ClickEffect x={1480} y={340} startFrame={118} />
    </AbsoluteFill>
  );
};
