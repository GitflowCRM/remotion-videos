import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  StatusBadge,
  Sidebar,
  SidebarLogo,
  SidebarNav,
} from './components';

const theme = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

// Animated entry
const AnimatedEntry: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>
      {children}
    </div>
  );
};

// Product row
const ProductRow: React.FC<{
  name: string;
  sku: string;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  delay: number;
}> = ({ name, sku, stock, status, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const statusColors = {
    'in-stock': { bg: 'rgba(16, 185, 129, 0.15)', color: theme.success, label: 'In Stock' },
    'low-stock': { bg: 'rgba(245, 158, 11, 0.15)', color: theme.warning, label: 'Low Stock' },
    'out-of-stock': { bg: 'rgba(239, 68, 68, 0.15)', color: theme.danger, label: 'Out of Stock' },
  };

  const s = statusColors[status];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 16,
        padding: '16px 0',
        borderBottom: `1px solid ${theme.border}`,
        opacity,
        transform: `translateX(${(1 - progress) * 30}px)`,
      }}
    >
      <div>
        <div style={{ color: theme.text, fontSize: 15, fontWeight: 500 }}>{name}</div>
        <div style={{ color: theme.dim, fontSize: 13 }}>{sku}</div>
      </div>
      <div style={{ color: theme.text, fontSize: 15, display: 'flex', alignItems: 'center' }}>{stock}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ padding: '4px 12px', borderRadius: 9999, backgroundColor: s.bg, color: s.color, fontSize: 12, fontWeight: 500 }}>
          {s.label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    </div>
  );
};

// Low stock alert
const LowStockAlert: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const pulse = frame > delay + 30 ? 1 + Math.sin((frame - delay - 30) / 10) * 0.02 : 1;

  return (
    <Card style={{ opacity, transform: `scale(${pulse})`, borderColor: theme.warning, borderWidth: 2 }}>
      <CardContent style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 28 }}>⚠️</div>
          <div>
            <div style={{ color: theme.warning, fontSize: 14, fontWeight: 600 }}>Low Stock Alert</div>
            <div style={{ color: theme.muted, fontSize: 13 }}>3 products need reordering</div>
          </div>
          <Button size="sm" style={{ marginLeft: 'auto' }}>View All</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const InventoryFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  const navItems = [
    { icon: '📊', label: 'Dashboard', active: false },
    { icon: '📄', label: 'Invoices', active: false },
    { icon: '📦', label: 'Inventory', active: true },
    { icon: '👥', label: 'Customers', active: false },
    { icon: '💰', label: 'Expenses', active: false },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar style={{ opacity: headerOpacity }}>
        <SidebarLogo />
        <SidebarNav items={navItems} />
      </Sidebar>
      
      <div style={{ marginLeft: 240, padding: 36 }}>
        <div style={{ marginBottom: 28, opacity: headerOpacity }}>
          <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>Inventory</h1>
          <p style={{ color: theme.dim, fontSize: 15, margin: '10px 0 0 0' }}>Track products and stock levels</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
          <AnimatedEntry delay={30}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>Total Products</div>
                <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>324</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
          <AnimatedEntry delay={45}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>In Stock</div>
                <div style={{ color: theme.success, fontSize: 28, fontWeight: 700 }}>286</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
          <AnimatedEntry delay={60}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>Low Stock</div>
                <div style={{ color: theme.warning, fontSize: 28, fontWeight: 700 }}>31</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
          <AnimatedEntry delay={75}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>Out of Stock</div>
                <div style={{ color: theme.danger, fontSize: 28, fontWeight: 700 }}>7</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
        </div>

        {/* Alert */}
        <div style={{ marginBottom: 28 }}>
          <LowStockAlert delay={100} />
        </div>

        {/* Product list */}
        <AnimatedEntry delay={130}>
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle>Products</CardTitle>
                <Button size="sm">+ Add Product</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{
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
              }}>
                <div>Product</div>
                <div>Stock</div>
                <div>Status</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              
              <ProductRow name="Wireless Keyboard" sku="SKU-001" stock={45} status="in-stock" delay={180} />
              <ProductRow name="USB-C Hub" sku="SKU-023" stock={8} status="low-stock" delay={210} />
              <ProductRow name="Monitor Stand" sku="SKU-045" stock={0} status="out-of-stock" delay={240} />
              <ProductRow name="Laptop Sleeve" sku="SKU-067" stock={124} status="in-stock" delay={270} />
              <ProductRow name="Webcam HD" sku="SKU-089" stock={5} status="low-stock" delay={300} />
            </CardContent>
          </Card>
        </AnimatedEntry>
      </div>
    </AbsoluteFill>
  );
};
