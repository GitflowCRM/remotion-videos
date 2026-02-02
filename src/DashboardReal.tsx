import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import './styles/globals.css';
import { KpiCard } from './components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Package,
  TrendingUp,
} from 'lucide-react';

// Animated wrapper for staggered entrance
const AnimatedEntry: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - progress) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Main Dashboard using real SmallERP components
export const DashboardReal: React.FC = () => {
  const frame = useCurrentFrame();
  
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { 
    extrapolateRight: 'clamp' 
  });

  return (
    <AbsoluteFill className="bg-background font-sans p-10">
      {/* Sidebar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 bg-card flex flex-col items-center pt-6 gap-6"
        style={{ opacity: headerOpacity }}
      >
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
          SE
        </div>
        {['📊', '💳', '📦', '👥', '📁'].map((icon, i) => (
          <div
            key={i}
            className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${
              i === 0 ? 'bg-muted' : ''
            }`}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="ml-24">
        {/* Header */}
        <div className="mb-8" style={{ opacity: headerOpacity }}>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* KPI Cards - Using real SmallERP component */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <AnimatedEntry delay={30}>
            <KpiCard
              title="Total Revenue"
              value="AED 125,750"
              change="+12%"
              changeType="positive"
              icon={DollarSign}
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={45}>
            <KpiCard
              title="Invoices"
              value="48"
              change="+3"
              changeType="positive"
              icon={FileText}
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={60}>
            <KpiCard
              title="Customers"
              value="156"
              change="+8"
              changeType="positive"
              icon={Users}
            />
          </AnimatedEntry>
          
          <AnimatedEntry delay={75}>
            <KpiCard
              title="Products"
              value="324"
              change="0"
              changeType="neutral"
              icon={Package}
            />
          </AnimatedEntry>
        </div>

        {/* Charts row - Using real Card component */}
        <div className="grid grid-cols-3 gap-6">
          <AnimatedEntry delay={100}>
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                    <p className="text-2xl font-bold mt-2">AED 89,420</p>
                  </div>
                  <span className="text-success text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +12.5%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Chart placeholder */}
                <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  Revenue Chart
                </div>
              </CardContent>
            </Card>
          </AnimatedEntry>

          <AnimatedEntry delay={120}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Sales</CardTitle>
                <p className="text-2xl font-bold mt-2">23 orders</p>
              </CardHeader>
              <CardContent>
                {/* Mini chart placeholder */}
                <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  Bar Chart
                </div>
              </CardContent>
            </Card>
          </AnimatedEntry>
        </div>
      </div>
    </AbsoluteFill>
  );
};
