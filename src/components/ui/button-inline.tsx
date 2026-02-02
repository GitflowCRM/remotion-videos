import React from 'react';

// SmallERP theme
const theme = {
  primary: '#6366f1',
  primaryHover: '#5558e8',
  primaryForeground: '#ffffff',
  secondary: '#1e293b',
  secondaryHover: '#334155',
  secondaryForeground: '#f8fafc',
  destructive: '#ef4444',
  destructiveHover: '#dc2626',
  ghost: 'transparent',
  ghostHover: 'rgba(99, 102, 241, 0.1)',
  border: '#334155',
  text: '#f8fafc',
  muted: '#94a3b8',
};

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    backgroundColor: theme.primary,
    color: theme.primaryForeground,
    border: 'none',
  },
  secondary: {
    backgroundColor: theme.secondary,
    color: theme.secondaryForeground,
    border: 'none',
  },
  destructive: {
    backgroundColor: theme.destructive,
    color: '#ffffff',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: theme.text,
    border: `1px solid ${theme.border}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.text,
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  default: {
    height: 36,
    padding: '0 16px',
    fontSize: 14,
  },
  sm: {
    height: 32,
    padding: '0 12px',
    fontSize: 13,
  },
  lg: {
    height: 44,
    padding: '0 24px',
    fontSize: 15,
  },
  icon: {
    height: 36,
    width: 36,
    padding: 0,
  },
};

export function Button({
  variant = 'default',
  size = 'default',
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 8,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 150ms ease',
        fontFamily: 'inherit',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
