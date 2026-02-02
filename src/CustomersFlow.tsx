import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Avatar,
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
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
};

const AnimatedEntry: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>{children}</div>;
};

// Customer card
const CustomerCard: React.FC<{
  name: string;
  email: string;
  orders: number;
  spent: number;
  status: 'active' | 'inactive';
  delay: number;
}> = ({ name, email, orders, spent, status, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Card style={{ opacity, transform: `translateX(${(1 - progress) * 30}px)` }}>
      <CardContent style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={name} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: theme.text, fontSize: 16, fontWeight: 600 }}>{name}</span>
              <span style={{
                padding: '2px 8px',
                borderRadius: 9999,
                backgroundColor: status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                color: status === 'active' ? theme.success : theme.dim,
                fontSize: 11,
                fontWeight: 500,
              }}>
                {status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ color: theme.muted, fontSize: 14, marginTop: 4 }}>{email}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: theme.text, fontSize: 18, fontWeight: 700 }}>AED {spent.toLocaleString()}</div>
            <div style={{ color: theme.dim, fontSize: 13 }}>{orders} orders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Customer detail panel
const CustomerDetail: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Card style={{ opacity }}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name="Acme Corporation" size="xl" />
          <div>
            <CardTitle>Acme Corporation</CardTitle>
            <div style={{ color: theme.muted, fontSize: 14, marginTop: 4 }}>contact@acme.ae</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          <div>
            <div style={{ color: theme.dim, fontSize: 12, marginBottom: 4 }}>Total Spent</div>
            <div style={{ color: theme.text, fontSize: 24, fontWeight: 700 }}>AED 45,200</div>
          </div>
          <div>
            <div style={{ color: theme.dim, fontSize: 12, marginBottom: 4 }}>Orders</div>
            <div style={{ color: theme.text, fontSize: 24, fontWeight: 700 }}>23</div>
          </div>
          <div>
            <div style={{ color: theme.dim, fontSize: 12, marginBottom: 4 }}>Outstanding</div>
            <div style={{ color: theme.warning, fontSize: 24, fontWeight: 700 }}>AED 12,500</div>
          </div>
        </div>
        
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 20 }}>
          <div style={{ color: theme.muted, fontSize: 13, marginBottom: 12 }}>Recent Activity</div>
          {['Invoice #048 - AED 5,000 - Paid', 'Invoice #047 - AED 12,500 - Pending', 'Invoice #042 - AED 8,200 - Paid'].map((item, i) => (
            <div key={i} style={{ color: theme.text, fontSize: 14, padding: '8px 0', borderBottom: `1px solid ${theme.border}` }}>
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomersFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  const navItems = [
    { icon: '📊', label: 'Dashboard', active: false },
    { icon: '📄', label: 'Invoices', active: false },
    { icon: '📦', label: 'Inventory', active: false },
    { icon: '👥', label: 'Customers', active: true },
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>Customers</h1>
              <p style={{ color: theme.dim, fontSize: 15, margin: '10px 0 0 0' }}>Manage your customer relationships</p>
            </div>
            <AnimatedEntry delay={40}>
              <Button>+ Add Customer</Button>
            </AnimatedEntry>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {/* Customer list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CustomerCard name="Acme Corporation" email="contact@acme.ae" orders={23} spent={45200} status="active" delay={60} />
            <CustomerCard name="Tech Solutions LLC" email="info@techsol.ae" orders={15} spent={28750} status="active" delay={90} />
            <CustomerCard name="Global Trade Co" email="sales@globaltrade.ae" orders={8} spent={15400} status="active" delay={120} />
            <CustomerCard name="StartUp Hub" email="hello@startuphub.ae" orders={3} spent={4200} status="inactive" delay={150} />
          </div>
          
          {/* Detail panel */}
          <CustomerDetail delay={200} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
