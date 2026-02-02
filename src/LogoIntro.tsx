import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale animation with spring bounce
  const logoScale = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  // Logo fade in
  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Subtle glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.6]
  );

  // Background gradient rotation
  const gradientRotation = interpolate(frame, [0, 150], [0, 360]);

  // Fade out at the end
  const fadeOut = interpolate(frame, [120, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Particles/sparkles animation
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const delay = i * 2;
    const particleProgress = interpolate(
      frame - delay,
      [20, 80],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const radius = interpolate(particleProgress, [0, 1], [100, 400]);
    const particleOpacity = interpolate(
      particleProgress,
      [0, 0.3, 0.7, 1],
      [0, 1, 1, 0]
    );
    const x = Math.cos(angle + frame * 0.02) * radius;
    const y = Math.sin(angle + frame * 0.02) * radius;
    const size = interpolate(particleProgress, [0, 0.5, 1], [2, 6, 2]);

    return { x, y, opacity: particleOpacity, size };
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
      }}
    >
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              #1a365d 0%,
              #0f172a 50%,
              #020617 100%
            )
          `,
        }}
      />

      {/* Subtle animated gradient overlay */}
      <AbsoluteFill
        style={{
          background: `
            conic-gradient(
              from ${gradientRotation}deg at 50% 50%,
              transparent 0%,
              rgba(59, 130, 246, 0.1) 25%,
              transparent 50%,
              rgba(37, 99, 235, 0.1) 75%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Particles */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {particles.map((particle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              opacity: particle.opacity * fadeOut,
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6',
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Logo container */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${30 * glowIntensity}px rgba(59, 130, 246, ${glowIntensity}))`,
          }}
        >
          <Img
            src={staticFile('small-erp-logo.png')}
            style={{
              width: 500,
              height: 'auto',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
