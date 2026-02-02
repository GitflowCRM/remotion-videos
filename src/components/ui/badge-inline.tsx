import React from 'react';

// SmallERP theme
const theme = {
  primary: '#6366f1',
  primaryForeground: '#ffffff',
  secondary: '#1e293b',
  secondaryForeground: '#f8fafc',
  destructive: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  muted: '#64748b',
  border: '#334155',
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: theme.destructive,
    border: 'none',
  },
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: theme.success,
    border: 'none',
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: theme.warning,
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: theme.muted,
    border: `1px solid ${theme.border}`,
  },
};

export function Badge({ variant = 'default', children, style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// Status badge with predefined colors
type StatusType = 'paid' | 'pending' | 'overdue' | 'draft' | 'active' | 'inactive';

const statusConfig: Record<StatusType, { bg: string; color: string; label: string }> = {
  paid: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Paid' },
  pending: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Pending' },
  overdue: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Overdue' },
  draft: { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', label: 'Draft' },
  active: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Active' },
  inactive: { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', label: 'Inactive' },
};

export function StatusBadge({ status, label }: { status: StatusType; label?: string }) {
  const config = statusConfig[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {label || config.label}
    </span>
  );
}
