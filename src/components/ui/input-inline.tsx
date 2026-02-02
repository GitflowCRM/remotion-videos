import React from 'react';

// SmallERP theme
const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  borderFocus: '#6366f1',
  text: '#f8fafc',
  placeholder: '#64748b',
  muted: '#94a3b8',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ 
  label, 
  error, 
  icon,
  style, 
  ...props 
}: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ 
          fontSize: 14, 
          fontWeight: 500, 
          color: theme.muted 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.muted,
            display: 'flex',
            alignItems: 'center',
          }}>
            {icon}
          </div>
        )}
        <input
          style={{
            width: '100%',
            height: 40,
            padding: icon ? '0 14px 0 40px' : '0 14px',
            backgroundColor: theme.bg,
            border: `1px solid ${error ? '#ef4444' : theme.border}`,
            borderRadius: 8,
            color: theme.text,
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            ...style,
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444' }}>
          {error}
        </span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 500, color: theme.muted }}>
          {label}
        </label>
      )}
      <textarea
        style={{
          width: '100%',
          minHeight: 100,
          padding: 14,
          backgroundColor: theme.bg,
          border: `1px solid ${error ? '#ef4444' : theme.border}`,
          borderRadius: 8,
          color: theme.text,
          fontSize: 14,
          outline: 'none',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
}

interface SelectProps {
  label?: string;
  value?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
}

export function Select({ label, value, options, placeholder, style }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 500, color: theme.muted }}>
          {label}
        </label>
      )}
      <div
        style={{
          height: 40,
          padding: '0 14px',
          backgroundColor: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          color: value ? theme.text : theme.placeholder,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          ...style,
        }}
      >
        <span>{value || placeholder || 'Select...'}</span>
        <span style={{ color: theme.muted }}>▼</span>
      </div>
    </div>
  );
}
