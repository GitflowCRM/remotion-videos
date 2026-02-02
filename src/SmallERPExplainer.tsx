import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
  staticFile,
} from 'remotion';

// Invoice creation flow screenshots
const invoiceFlow = [
  { image: 'screenshots/flows/invoice_01_list.jpg', label: 'Open Invoices' },
  { image: 'screenshots/flows/invoice_02_form.jpg', label: 'Click "New Invoice"' },
  { image: 'screenshots/flows/invoice_03_customer.jpg', label: 'Select Customer' },
  { image: 'screenshots/flows/invoice_04_customer_selected.jpg', label: 'Customer Selected' },
  { image: 'screenshots/flows/invoice_05_item_form.jpg', label: 'Add Line Item' },
  { image: 'screenshots/flows/invoice_06_filled.jpg', label: 'Review & Create' },
];

// Other screens
const otherScreens = [
  { image: 'screenshots/02_dashboard.jpg', title: 'Real-Time Dashboard', subtitle: 'Track your business at a glance' },
  { image: 'screenshots/04_inventory.jpg', title: 'Smart Inventory', subtitle: 'Never run out of stock' },
  { image: 'screenshots/05_projects.jpg', title: 'Project Management', subtitle: 'Track every deadline' },
  { image: 'screenshots/flows/copilot_01_open.jpg', title: 'AI-Powered Copilot', subtitle: 'Your intelligent assistant' },
];

// Browser mockup component
const BrowserMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        width: '94%',
        height: '88%',
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Browser header */}
      <div
        style={{
          height: 36,
          backgroundColor: '#16213e',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 6,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28c840' }} />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            backgroundColor: '#0f0f23',
            borderRadius: 5,
            padding: '4px 12px',
            color: '#6b7280',
            fontSize: 12,
            fontFamily: 'system-ui',
          }}
        >
          smallerp.ae/app
        </div>
      </div>
      {/* Browser content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>
  );
};

// Animated click indicator
const ClickIndicator: React.FC<{ x: number; y: number; visible: boolean }> = ({ x, y, visible }) => {
  const frame = useCurrentFrame();
  
  if (!visible) return null;
  
  const scale = interpolate(frame % 20, [0, 10, 20], [0.5, 1.2, 0.5]);
  const opacity = interpolate(frame % 20, [0, 5, 15, 20], [0, 1, 1, 0]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '3px solid #10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Flow step component with animated transition
const FlowStep: React.FC<{
  imageSrc: string;
  label: string;
  stepNumber: number;
  totalSteps: number;
}> = ({ imageSrc, label, stepNumber, totalSteps }) => {
  const frame = useCurrentFrame();
  
  // Slide in from right
  const slideX = interpolate(frame, [0, 12], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  
  // Progress bar
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Progress bar at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: '#1a1a3e',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#10b981',
            transition: 'width 0.3s',
          }}
        />
      </div>
      
      {/* Step indicator */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          {stepNumber}
        </div>
        <span
          style={{
            fontSize: 20,
            color: 'white',
            fontFamily: 'system-ui',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
      
      {/* Screenshot */}
      <div
        style={{
          transform: `translateX(${slideX}px)`,
          opacity,
          marginTop: 40,
        }}
      >
        <BrowserMockup>
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'top center',
              backgroundColor: '#0f172a',
            }}
          />
        </BrowserMockup>
      </div>
    </AbsoluteFill>
  );
};

// Feature screen component
const FeatureScreen: React.FC<{
  imageSrc: string;
  title: string;
  subtitle: string;
}> = ({ imageSrc, title, subtitle }) => {
  const frame = useCurrentFrame();
  
  const scale = interpolate(frame, [0, 60], [1, 1.03], {
    easing: Easing.inOut(Easing.cubic),
  });
  
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  
  const titleY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%)' }} />
      
      <BrowserMockup>
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'top center',
            transform: `scale(${scale})`,
            backgroundColor: '#0f172a',
          }}
        />
      </BrowserMockup>
      
      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: 'white',
            margin: 0,
            fontFamily: 'system-ui',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            transform: `translateY(${titleY}px)`,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 22,
            color: '#10b981',
            margin: '8px 0 0 0',
            fontFamily: 'system-ui',
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Intro scene
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const logoScale = interpolate(frame, [0, 25], [0.5, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });
  
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  
  const taglineOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0d3320 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          transform: `scale(${interpolate(frame, [0, 60], [0.8, 1.3])})`,
        }}
      />
      
      <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 70,
            height: 70,
            backgroundColor: '#10b981',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          SE
        </div>
        <span style={{ fontSize: 60, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>
          SmallERP
        </span>
      </div>
      
      <p style={{ fontSize: 28, color: '#9ca3af', marginTop: 20, fontFamily: 'system-ui', opacity: taglineOpacity }}>
        Business Management Made Simple
      </p>
      
      <div
        style={{
          marginTop: 30,
          padding: '10px 20px',
          backgroundColor: 'rgba(16,185,129,0.2)',
          borderRadius: 24,
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981',
          fontSize: 16,
          fontFamily: 'system-ui',
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        🇦🇪 Built for UAE Businesses
      </div>
    </AbsoluteFill>
  );
};

// Section title scene
const SectionTitle: React.FC<{ title: string; icon: string }> = ({ title, icon }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, 35, 45], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.2)) });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: 'white', margin: 0, fontFamily: 'system-ui' }}>
          {title}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

// Outro scene
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <h1 style={{ fontSize: 56, fontWeight: 700, color: 'white', margin: 0, fontFamily: 'system-ui', textAlign: 'center' }}>
        Start Your Free Trial
      </h1>
      <p style={{ fontSize: 28, color: '#10b981', marginTop: 16, fontFamily: 'system-ui' }}>
        smallerp.ae
      </p>
      <div
        style={{
          marginTop: 32,
          padding: '14px 40px',
          backgroundColor: '#10b981',
          borderRadius: 10,
          color: 'white',
          fontSize: 22,
          fontWeight: 600,
          fontFamily: 'system-ui',
        }}
      >
        Get Started →
      </div>
    </AbsoluteFill>
  );
};

// Main composition - 30 seconds total
export const SmallERPExplainer: React.FC = () => {
  let f = 0;
  const fps = 30;
  
  // Timings
  const introDuration = 75; // 2.5s
  const sectionTitleDuration = 50; // ~1.7s
  const flowStepDuration = 50; // ~1.7s per step
  const featureDuration = 75; // 2.5s per feature
  const outroDuration = 75; // 2.5s

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a1a' }}>
      {/* Intro */}
      <Sequence from={f} durationInFrames={introDuration}>
        <IntroScene />
      </Sequence>
      {(f += introDuration)}

      {/* Invoice Flow Section */}
      <Sequence from={f} durationInFrames={sectionTitleDuration}>
        <SectionTitle title="Create Invoices in Seconds" icon="📄" />
      </Sequence>
      {(f += sectionTitleDuration)}

      {/* Invoice flow steps */}
      {invoiceFlow.map((step, i) => {
        const from = f;
        f += flowStepDuration;
        return (
          <Sequence key={`flow-${i}`} from={from} durationInFrames={flowStepDuration}>
            <FlowStep
              imageSrc={step.image}
              label={step.label}
              stepNumber={i + 1}
              totalSteps={invoiceFlow.length}
            />
          </Sequence>
        );
      })}

      {/* Feature screens */}
      {otherScreens.map((screen, i) => {
        const from = f;
        f += featureDuration;
        return (
          <Sequence key={`feature-${i}`} from={from} durationInFrames={featureDuration}>
            <FeatureScreen
              imageSrc={screen.image}
              title={screen.title}
              subtitle={screen.subtitle}
            />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={f} durationInFrames={outroDuration}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
