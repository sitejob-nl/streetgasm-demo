import { useStats } from '@/hooks/useStats';
import { useMembers } from '@/hooks/useMembers';
import { useEvents } from '@/hooks/useEvents';
import { useOrders } from '@/hooks/useOrders';
import { Search, Bell, Users, Activity, Calendar, ShoppingBag, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
    const { data: statsData, isLoading: statsLoading } = useStats();
    const { data: membersData, isLoading: membersLoading } = useMembers();
    const { data: eventsData } = useEvents();
    const { data: ordersData } = useOrders();

    // Extract arrays from paginated responses
    const stats = statsData;
    const members = membersData?.data || [];
    const events = eventsData?.data || [];
    const orders = ordersData?.data || [];

    const activeMembers = members.filter(m => m.status === 'active');
    const recentMembers = activeMembers.slice(0, 3);
    const recentEvents = events.slice(0, 3);

    // Combine orders and new members for activity feed
    const activityFeed = [
        ...orders.map(o => ({
            type: 'order',
            id: o.id,
            date: new Date(o.date_created),
            title: `Ticket Purchase: ${o.line_items?.[0]?.name || 'Order'}`,
            user: `${o.billing.first_name} ${o.billing.last_name}`,
            initials: (o.billing.first_name?.[0] || '') + (o.billing.last_name?.[0] || '')
        })),
        ...members.map(s => ({
            type: 'subscription',
            id: s.id,
            date: new Date(s.start_date),
            title: 'New Gold Member Joined',
            user: `${s.first_name} ${s.last_name}`,
            initials: (s.first_name?.[0] || '') + (s.last_name?.[0] || '')
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);


    if (statsLoading || membersLoading) {
        return (
            <div className="loader">
                <div className="loader-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Admin Portal</p>
                    <h1>Welcome back, <span className="gold-text">Maurice</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search the club..." />
                    </div>
                    <div className="notif-btn">
                        <Bell />
                        <div className="notif-dot"></div>
                    </div>
                </div>
            </header>

            <div className="content">
                <div className="stats-grid">
                    {/* Total Members */}
                    <div className="stat-card glass animate-fade delay-1">
                        <div className="stat-icon-bg"><Users /></div>
                        <div className="stat-icon-box"><Users /></div>
                        <div className="stat-value" id="stat-members">{stats?.subscriptions?.total || 0}</div>
                        <div className="stat-label">Total Members</div>
                        <span className="stat-sub">{stats?.customers || 0} customers</span>
                    </div>

                    {/* Active Members */}
                    <div className="stat-card glass animate-fade delay-2">
                        <div className="stat-icon-bg"><Activity /></div>
                        <div className="stat-icon-box"><Activity /></div>
                        <div className="stat-value" id="stat-active">{stats?.subscriptions?.byStatus?.active || 0}</div>
                        <div className="stat-label">Active Members</div>
                        <span className="stat-sub">{stats?.subscriptions?.byStatus?.['on-hold'] || 0} on-hold</span>
                    </div>

                    {/* Events */}
                    <div className="stat-card glass animate-fade delay-3">
                        <div className="stat-icon-bg"><Calendar /></div>
                        <div className="stat-icon-box"><Calendar /></div>
                        <div className="stat-value" id="stat-events">{stats?.products || 0}</div>
                        <div className="stat-label">Upcoming Events</div>
                        <span className="stat-sub">Next: Arabian Miles</span>
                    </div>

                    {/* Orders */}
                    <div className="stat-card glass animate-fade delay-4">
                        <div className="stat-icon-bg"><ShoppingBag /></div>
                        <div className="stat-icon-box"><ShoppingBag /></div>
                        <div className="stat-value" id="stat-orders">{stats?.orders || 0}</div>
                        <div className="stat-label">Total Orders</div>
                        <span className="stat-sub">+24% vs 2025</span>
                    </div>
                </div>

                <div className="split-grid">
                    {/* Events Preview */}
                    <div className="animate-fade delay-2">
                        <div className="section-header">
                            <h2 className="section-title">Upcoming <span>Experiences</span></h2>
                            <div className="section-link">View Calendar <ChevronRight /></div>
                        </div>

                        <div className="events-grid">
                            {recentEvents.map(event => (
                                <div key={event.id} className="event-card">
                                    <img
                                        src={event.images?.[0]?.src || 'https://streetgasm.com/wp-content/themes/streetgasm/assets/images/placeholder.jpg'}
                                        alt={event.name}
                                    />
                                    <div className="event-status glass">
                                        {event.stock_status === 'instock' ? 'Available' : 'Sold Out'}
                                    </div>
                                    <div className="event-content">
                                        <div className="event-date">
                                            <Calendar />
                                            {event.categories?.[0]?.name || 'Event'}
                                        </div>
                                        <h3 className="event-title">{event.name}</h3>
                                        <div className="event-loc">
                                            <div className="flex items-center gap-2">
                                                {event.price ? `€${event.price}` : 'Price TBA'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="animate-fade delay-3">
                        <div className="section-header">
                            <h2 className="section-title">Recent <span>Updates</span></h2>
                        </div>
                        <div className="activity-feed glass">
                            {activityFeed.map((item, i) => (
                                <div key={`${item.type}-${item.id}`} className="activity-item">
                                    <div className="activity-line">
                                        <div className={`activity-dot ${i === 0 ? '' : i % 2 === 0 ? 'blue' : 'gray'}`}></div>
                                        <div className={`activity-connector ${i === 0 ? '' : i % 2 === 0 ? 'blue' : 'gray'}`}></div>
                                    </div>
                                    <div className="activity-content">
                                        <p><strong>{item.title}</strong> by {item.user}</p>
                                        <div className="activity-meta">
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #334155, #1e293b)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '10px', fontWeight: 700, color: '#fff'
                                            }}>
                                                {item.initials}
                                            </div>
                                            <span className="activity-time">• {formatDistanceToNow(item.date)} ago</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Members Grid */}
                <div className="animate-fade delay-3">
                    <div className="members-header">
                        <h2 className="section-title">The <span className="gold-text">Garage</span></h2>
                        <div className="members-actions">
                            <button className="btn btn-glass">View All</button>
                            <button className="btn btn-gold">Add Car</button>
                        </div>
                    </div>

                    <div className="members-grid">
                        {recentMembers.map(member => (
                            <div key={member.id} className="member-card glass">
                                <div className="member-header">
                                    <div className="member-info">
                                        <div className="member-avatar">
                                            {(member.first_name?.[0] || '') + (member.last_name?.[0] || '')}
                                        </div>
                                        <div>
                                            <div className="member-name">{member.first_name} {member.last_name}</div>
                                            <div className="member-role">{member.status === 'active' ? 'Gold Member' : 'Member'}</div>
                                        </div>
                                    </div>
                                    <div className="member-more">
                                        <ChevronRight />
                                    </div>
                                </div>

                                <div className="member-car">
                                    <img
                                        src={member.auto?.foto || 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop'}
                                        className="member-car-img"
                                        alt={`${member.auto?.merk} ${member.auto?.model}`}
                                    />
                                    <div className="member-car-name">
                                        {member.auto?.merk || 'Unknown'} {member.auto?.model || ''}
                                    </div>
                                </div>

                                <div className="member-footer">
                                    <div className="member-footer-item">
                                        <CheckCircle2 size={12} /> Verified
                                    </div>
                                    <div className="status-dot"></div>
                                </div>
                            </div>
                        ))}

                        <div className="add-card glass">
                            <div className="add-icon">
                                <span><Plus /></span>
                            </div>
                            <div className="add-text">Add New Entry</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
