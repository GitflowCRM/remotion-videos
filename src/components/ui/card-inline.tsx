import React from 'react';

// SmallERP theme colors (from actual app)
const theme = {
  card: '#1e293b',
  cardForeground: '#f8fafc',
  border: '#334155',
  muted: '#94a3b8',
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: theme.card,
        color: theme.cardForeground,
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        padding: '20px 24px 0 24px',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: theme.cardForeground,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardDescription({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        fontSize: 14,
        color: theme.muted,
        marginTop: 4,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        padding: 24,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
