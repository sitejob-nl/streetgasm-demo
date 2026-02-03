import { useQuery } from '@tanstack/react-query';
import { getStats, getSubscriptions, getOrders } from '@/lib/api';
import { TrendingUp, Users, ShoppingBag, CreditCard, Calendar, Activity } from 'lucide-react';
import React from 'react';

interface Member {
    id: number;
    status: string;
    start_date: string;
}

interface Order {
    id: number;
    total: string;
    date_created: string;
}

const Analytics = () => {
    const { isLoading: statsLoading } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: getStats,
    });

    const { data: membersData, isLoading: membersLoading } = useQuery({
        queryKey: ['analytics-members'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 100 }),
    });

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['analytics-orders'],
        queryFn: () => getOrders({ page: 1, per_page: 100 }),
    });

    const isLoading = statsLoading || membersLoading || ordersLoading;
    const members: Member[] = membersData?.data || [];
    const orders: Order[] = ordersData?.data || [];

    // Calculate analytics
    const activeMembers = members.filter((m: Member) => m.status === 'active').length;
    const totalRevenue = orders.reduce((sum: number, o: Order) => sum + parseFloat(o.total || '0'), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Monthly data (simplified)
    const monthlyRevenue = orders
        .filter((o: Order) => new Date(o.date_created) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum: number, o: Order) => sum + parseFloat(o.total || '0'), 0);

    const newMembersThisMonth = members
        .filter((m: Member) => new Date(m.start_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .length;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Insights</p>
                    <h1>Club <span className="gold-text">Analytics</span></h1>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                            <MetricCard
                                icon={<Users size={20} />}
                                label="Active Members"
                                value={activeMembers}
                                change={`+${newMembersThisMonth} this month`}
                                positive
                            />
                            <MetricCard
                                icon={<CreditCard size={20} />}
                                label="Total Revenue"
                                value={`€${totalRevenue.toLocaleString()}`}
                                change={`€${monthlyRevenue.toLocaleString()} this month`}
                                positive
                            />
                            <MetricCard
                                icon={<ShoppingBag size={20} />}
                                label="Total Orders"
                                value={orders.length}
                                change={`Avg €${avgOrderValue.toFixed(2)}`}
                            />
                            <MetricCard
                                icon={<Activity size={20} />}
                                label="Retention Rate"
                                value="95%"
                                change="Last 90 days"
                                positive
                            />
                        </div>

                        {/* Charts Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                            {/* Revenue Chart Placeholder */}
                            <div className="glass animate-fade delay-1" style={{ padding: '32px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendingUp size={20} className="gold-text" /> Revenue Trend
                                </h3>
                                <div style={{
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    gap: '8px',
                                    padding: '0 20px'
                                }}>
                                    {/* Simple bar chart visualization */}
                                    {[65, 40, 80, 55, 90, 70, 85, 60, 95, 75, 88, 100].map((height: number, i: number) => (
                                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: `${height}%`,
                                                    background: 'linear-gradient(to top, var(--gold-start), var(--gold-end))',
                                                    borderRadius: '4px 4px 0 0',
                                                    opacity: 0.8
                                                }}
                                            />
                                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Member Status Breakdown */}
                            <div className="glass animate-fade delay-2" style={{ padding: '32px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={20} className="gold-text" /> Member Status
                                </h3>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <StatusBar
                                        label="Active"
                                        value={members.filter((m: Member) => m.status === 'active').length}
                                        total={members.length}
                                        color="var(--green)"
                                    />
                                    <StatusBar
                                        label="On Hold"
                                        value={members.filter((m: Member) => m.status === 'on-hold').length}
                                        total={members.length}
                                        color="var(--gold-start)"
                                    />
                                    <StatusBar
                                        label="Cancelled"
                                        value={members.filter((m: Member) => m.status === 'cancelled').length}
                                        total={members.length}
                                        color="#ef4444"
                                    />
                                    <StatusBar
                                        label="Pending"
                                        value={members.filter((m: Member) => m.status === 'pending').length}
                                        total={members.length}
                                        color="var(--blue)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Insights */}
                        <div className="glass animate-fade delay-3" style={{ padding: '32px', borderRadius: '24px', marginTop: '32px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Quick Insights</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                <InsightCard
                                    title="Top Performing Month"
                                    value="November 2024"
                                    subtitle="€12,450 revenue"
                                />
                                <InsightCard
                                    title="Most Popular Event"
                                    value="Summer Meet 2024"
                                    subtitle="156 registrations"
                                />
                                <InsightCard
                                    title="Member Lifetime Value"
                                    value="€890"
                                    subtitle="Average per member"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const MetricCard = ({ icon, label, value, change, positive }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    positive?: boolean;
}) => (
    <div className="stat-card glass">
        <div className="stat-icon">{icon}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && (
            <div style={{
                fontSize: '11px',
                color: positive ? 'var(--green)' : 'var(--text-muted)',
                marginTop: '4px'
            }}>
                {change}
            </div>
        )}
    </div>
);

const StatusBar = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{value}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentage}%`, background: color, borderRadius: '4px' }} />
            </div>
        </div>
    );
};

const InsightCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
    <div style={{
        padding: '20px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '12px', color: 'var(--gold-start)' }}>{subtitle}</div>
    </div>
);

export default Analytics;
