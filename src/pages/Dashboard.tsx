import { useQuery } from '@tanstack/react-query';
import { getStats, getSubscriptions, getOrders, getProducts, subscriptionToMember } from '@/lib/api';
import { Users, CreditCard, Calendar, TrendingUp, ChevronRight, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { DashboardStats, Member, Order, Product } from '@/types';

const Dashboard = () => {
    const { data: statsData, isLoading: statsLoading } = useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: getStats,
    });

    const { data: membersData, isLoading: membersLoading } = useQuery({
        queryKey: ['dashboard-members'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 5, status: 'active' }),
        select: (data) => ({
            ...data,
            data: data.data.map(subscriptionToMember),
        }),
    });

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['dashboard-orders'],
        queryFn: () => getOrders({ page: 1, per_page: 5 }),
    });

    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['dashboard-events'],
        queryFn: () => getProducts({ page: 1, per_page: 4 }),
    });

    const isLoading = statsLoading || membersLoading || ordersLoading || eventsLoading;
    const stats = statsData;
    const members = membersData?.data || [];
    const orders = ordersData?.data || [];
    const events = eventsData?.data || [];

    // Create activity feed from recent orders and members
    const activityFeed = [
        ...orders.slice(0, 3).map((o: Order) => ({
            type: 'order' as const,
            title: `New order #${o.id}`,
            detail: `€${o.total}`,
            time: o.date_created,
        })),
        ...members.slice(0, 2).map((m: Member) => ({
            type: 'member' as const,
            title: `${m.name} joined`,
            detail: m.membershipType,
            time: m.joinDate,
        })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Welcome back</p>
                    <h1>Club <span className="gold-text">Dashboard</span></h1>
                </div>
                <div className="header-right">
                    <Link to="/settings" className="btn btn-glass">Settings</Link>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="stats-grid animate-fade">
                            <div className="stat-card glass">
                                <div className="stat-icon"><Users size={20} /></div>
                                <div className="stat-value">{stats?.activeMembers || 0}</div>
                                <div className="stat-label">Active Members</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><CreditCard size={20} /></div>
                                <div className="stat-value">€{stats?.monthlyRevenue?.toLocaleString() || 0}</div>
                                <div className="stat-label">Monthly Revenue</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Calendar size={20} /></div>
                                <div className="stat-value">{stats?.upcomingEvents || 0}</div>
                                <div className="stat-label">Upcoming Events</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><TrendingUp size={20} /></div>
                                <div className="stat-value">{stats?.newMembersThisMonth || 0}</div>
                                <div className="stat-label">New This Month</div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '32px' }}>
                            {/* Left Column */}
                            <div style={{ display: 'grid', gap: '32px' }}>
                                {/* Upcoming Events */}
                                <div className="glass animate-fade delay-1" style={{ padding: '28px', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h3>Upcoming Events</h3>
                                        <Link to="/events" className="btn btn-glass" style={{ fontSize: '12px', padding: '8px 16px' }}>
                                            View All <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                        {events.map((event: Product, i: number) => (
                                            <div key={event.id} className={`glass animate-fade delay-${i + 1}`} style={{ padding: '20px', borderRadius: '16px' }}>
                                                <div style={{ marginBottom: '12px' }}>
                                                    <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{event.name}</h4>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                        {event.date_created ? format(new Date(event.date_created), 'MMM d, yyyy') : '-'}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                    <span style={{ color: 'var(--text-muted)' }}>{event.total_sales || 0} registered</span>
                                                    <span className="gold-text">€{event.price || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Members */}
                                <div className="glass animate-fade delay-2" style={{ padding: '28px', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h3>Recent Members</h3>
                                        <Link to="/members" className="btn btn-glass" style={{ fontSize: '12px', padding: '8px 16px' }}>
                                            View All <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {members.slice(0, 4).map((member: Member) => (
                                            <Link
                                                key={member.id}
                                                to={`/members/${member.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <div className="glass" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div className="member-avatar">
                                                            {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{member.name}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.membershipType}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        {member.vehicle && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                                                <Car size={14} />
                                                                {member.vehicle}
                                                            </div>
                                                        )}
                                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Activity Feed */}
                            <div className="glass animate-fade delay-3" style={{ padding: '28px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {activityFeed.map((activity, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.2)'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: activity.type === 'order'
                                                    ? 'rgba(34, 197, 94, 0.15)'
                                                    : 'rgba(251, 191, 36, 0.15)'
                                            }}>
                                                {activity.type === 'order' ? (
                                                    <CreditCard size={14} style={{ color: 'var(--green)' }} />
                                                ) : (
                                                    <Users size={14} style={{ color: 'var(--gold-start)' }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{activity.title}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{activity.detail}</div>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {format(new Date(activity.time), 'HH:mm')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;
