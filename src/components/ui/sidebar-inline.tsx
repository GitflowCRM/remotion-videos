import React from 'react';

// SmallERP theme
const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

interface SidebarProps {
  collapsed?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Sidebar({ collapsed = false, children, style }: SidebarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 80 : 240,
        backgroundColor: theme.card,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SidebarLogoProps {
  collapsed?: boolean;
  text?: string;
}

export function SidebarLogo({ collapsed = false, text = 'SE' }: SidebarLogoProps) {
  return (
    <div
      style={{
        padding: collapsed ? '24px 0' : '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          backgroundColor: theme.primary,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {text}
      </div>
      {!collapsed && (
        <span style={{ color: theme.text, fontWeight: 600, fontSize: 16 }}>
          SmallERP
        </span>
      )}
    </div>
  );
}

interface NavItem {
  icon: string | React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
}

interface SidebarNavProps {
  items: NavItem[];
  collapsed?: boolean;
}

export function SidebarNav({ items, collapsed = false }: SidebarNavProps) {
  return (
    <nav style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            padding: collapsed ? '12px 0' : '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            borderRadius: 8,
            backgroundColor: item.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: item.active ? theme.primary : theme.muted,
            cursor: 'pointer',
            borderLeft: collapsed 
              ? 'none' 
              : item.active 
                ? `3px solid ${theme.primary}` 
                : '3px solid transparent',
            marginLeft: collapsed ? 0 : -8,
            paddingLeft: collapsed ? 0 : 12,
          }}
        >
          <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 9999,
                    backgroundColor: theme.primary,
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
}

interface SidebarSectionProps {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({ title, collapsed = false, children }: SidebarSectionProps) {
  return (
    <div style={{ marginTop: 16 }}>
      {title && !collapsed && (
        <div
          style={{
            padding: '8px 20px',
            fontSize: 11,
            fontWeight: 600,
            color: theme.dim,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
