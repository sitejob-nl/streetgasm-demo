import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Calendar, Users, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';

const Registrations = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['events-registrations'],
        queryFn: () => getProducts({ page: 1, per_page: 50 }),
    });

    const events = data?.data || [];
    const filteredEvents = events.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Event Management</p>
                    <h1>Event <span className="gold-text">Registrations</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : filteredEvents.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <Calendar size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No events found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {filteredEvents.map((event, i) => (
                            <div
                                key={event.id}
                                className={`glass animate-fade delay-${Math.min(i, 4)}`}
                                style={{ padding: '24px', borderRadius: '24px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ marginBottom: '12px' }}>{event.name}</h3>
                                        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={14} />
                                                {event.date_created ? format(new Date(event.date_created), 'MMM d, yyyy') : '-'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} />
                                                {event.attributes?.find((a: { name: string }) => a.name === 'Locatie')?.options?.[0] || 'TBD'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Users size={14} />
                                                {event.total_sales || 0} registrations
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '8px 16px',
                                        borderRadius: '100px',
                                        background: event.stock_status === 'instock' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: event.stock_status === 'instock' ? 'var(--green)' : '#ef4444',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    }}>
                                        {event.stock_status === 'instock' ? 'Open' : 'Closed'}
                                    </div>
                                </div>

                                {/* Registration Stats */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '16px',
                                    marginTop: '24px',
                                    paddingTop: '24px',
                                    borderTop: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <StatItem label="Total Spots" value={event.stock_quantity || '∞'} />
                                    <StatItem label="Registered" value={event.total_sales || 0} />
                                    <StatItem label="Available" value={event.stock_quantity ? event.stock_quantity - (event.total_sales || 0) : '∞'} />
                                    <StatItem label="Revenue" value={`€${(event.total_sales || 0) * parseFloat(event.price || '0')}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>{value}</div>
    </div>
);

export default Registrations;
