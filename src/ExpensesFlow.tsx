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

const AnimatedEntry: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${(1 - progress) * 30}px)` }}>{children}</div>;
};

// Category colors
const categories: Record<string, { color: string; icon: string }> = {
  'Office Supplies': { color: '#6366f1', icon: '📎' },
  'Software': { color: '#8b5cf6', icon: '💻' },
  'Travel': { color: '#06b6d4', icon: '✈️' },
  'Utilities': { color: '#f59e0b', icon: '⚡' },
  'Marketing': { color: '#ec4899', icon: '📣' },
};

// Expense row
const ExpenseRow: React.FC<{
  description: string;
  category: string;
  amount: number;
  date: string;
  hasReceipt: boolean;
  delay: number;
}> = ({ description, category, amount, date, hasReceipt, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cat = categories[category] || { color: theme.dim, icon: '📄' };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
        gap: 16,
        padding: '16px 0',
        borderBottom: `1px solid ${theme.border}`,
        opacity,
        transform: `translateX(${(1 - progress) * 30}px)`,
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ color: theme.text, fontSize: 15, fontWeight: 500 }}>{description}</div>
        <div style={{ color: theme.dim, fontSize: 13 }}>{date}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{cat.icon}</span>
        <span style={{ color: cat.color, fontSize: 14 }}>{category}</span>
      </div>
      <div style={{ color: theme.text, fontSize: 15, fontWeight: 600 }}>AED {amount.toLocaleString()}</div>
      <div>
        {hasReceipt ? (
          <span style={{ color: theme.success, fontSize: 13 }}>✓ Receipt</span>
        ) : (
          <span style={{ color: theme.warning, fontSize: 13 }}>No receipt</span>
        )}
      </div>
      <Button variant="ghost" size="sm">View</Button>
    </div>
  );
};

// Expense chart (bar chart by category)
const ExpenseChart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const data = [
    { category: 'Software', amount: 8500 },
    { category: 'Office Supplies', amount: 3200 },
    { category: 'Travel', amount: 5800 },
    { category: 'Marketing', amount: 4100 },
    { category: 'Utilities', amount: 2400 },
  ];
  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.map((item, i) => {
            const barDelay = delay + i * 15;
            const progress = interpolate(frame - barDelay, [0, 30], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            const cat = categories[item.category] || { color: theme.dim, icon: '📄' };
            const width = (item.amount / maxAmount) * 100 * progress;

            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: theme.muted, fontSize: 13 }}>{cat.icon} {item.category}</span>
                  <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>AED {Math.floor(item.amount * progress).toLocaleString()}</span>
                </div>
                <div style={{ height: 8, backgroundColor: theme.border, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${width}%`, backgroundColor: cat.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const ExpensesFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  const navItems = [
    { icon: '📊', label: 'Dashboard', active: false },
    { icon: '📄', label: 'Invoices', active: false },
    { icon: '📦', label: 'Inventory', active: false },
    { icon: '👥', label: 'Customers', active: false },
    { icon: '💰', label: 'Expenses', active: true },
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
              <h1 style={{ color: theme.text, fontSize: 32, fontWeight: 700, margin: 0 }}>Expenses</h1>
              <p style={{ color: theme.dim, fontSize: 15, margin: '10px 0 0 0' }}>Track and categorize business expenses</p>
            </div>
            <AnimatedEntry delay={40}>
              <Button>+ Add Expense</Button>
            </AnimatedEntry>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
          <AnimatedEntry delay={50}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>This Month</div>
                <div style={{ color: theme.text, fontSize: 28, fontWeight: 700 }}>AED 24,000</div>
                <div style={{ color: theme.danger, fontSize: 13, marginTop: 4 }}>↑ 12% vs last month</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
          <AnimatedEntry delay={70}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>Pending Review</div>
                <div style={{ color: theme.warning, fontSize: 28, fontWeight: 700 }}>8</div>
                <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>Need receipts</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
          <AnimatedEntry delay={90}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <div style={{ color: theme.dim, fontSize: 13, marginBottom: 8 }}>VAT Recoverable</div>
                <div style={{ color: theme.success, fontSize: 28, fontWeight: 700 }}>AED 1,200</div>
                <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>5% of expenses</div>
              </CardContent>
            </Card>
          </AnimatedEntry>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
          {/* Expense list */}
          <AnimatedEntry delay={110}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                  gap: 16,
                  padding: '10px 0',
                  borderBottom: `2px solid ${theme.border}`,
                  color: theme.dim,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}>
                  <div>Description</div>
                  <div>Category</div>
                  <div>Amount</div>
                  <div>Receipt</div>
                  <div></div>
                </div>
                
                <ExpenseRow description="Adobe Creative Cloud" category="Software" amount={450} date="Jan 28, 2024" hasReceipt={true} delay={160} />
                <ExpenseRow description="Office Printer Paper" category="Office Supplies" amount={85} date="Jan 27, 2024" hasReceipt={true} delay={190} />
                <ExpenseRow description="Dubai Airport Parking" category="Travel" amount={120} date="Jan 26, 2024" hasReceipt={false} delay={220} />
                <ExpenseRow description="Google Workspace" category="Software" amount={280} date="Jan 25, 2024" hasReceipt={true} delay={250} />
              </CardContent>
            </Card>
          </AnimatedEntry>

          {/* Chart */}
          <AnimatedEntry delay={130}>
            <ExpenseChart delay={180} />
          </AnimatedEntry>
        </div>
      </div>
    </AbsoluteFill>
  );
};
