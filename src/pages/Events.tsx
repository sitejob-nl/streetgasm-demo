import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Search, ChevronRight, ChevronLeft, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Product } from '@/types';

const Events = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const perPage = 12;

    const { data, isLoading } = useQuery({
        queryKey: ['events', page, search],
        queryFn: () => getProducts({ page, per_page: perPage, search }),
    });

    const events = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Schedule</p>
                    <h1>Club <span className="gold-text">Events</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : events.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <Calendar size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No events found</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {events.map((event: Product, i: number) => (
                                <EventCard key={event.id} event={event} delay={i} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '16px',
                                marginTop: '32px'
                            }}>
                                <button
                                    className="btn btn-glass"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-glass"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const EventCard = ({ event, delay }: { event: Product; delay: number }) => (
    <div className={`glass animate-fade delay-${Math.min(delay, 4)}`} style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s'
    }}>
        {/* Event Image */}
        <div style={{
            height: '180px',
            background: event.images?.[0]?.src
                ? `url(${event.images[0].src}) center/cover`
                : 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(0,0,0,0.3))',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px'
        }}>
            <div style={{
                padding: '6px 12px',
                borderRadius: '100px',
                background: event.stock_status === 'instock' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700
            }}>
                {event.stock_status === 'instock' ? 'Open' : 'Sold Out'}
            </div>
        </div>

        {/* Event Info */}
        <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{event.name}</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {event.date_created ? format(new Date(event.date_created), 'MMM d, yyyy') : '-'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    {event.attributes?.find((a: { name: string }) => a.name === 'Locatie')?.options?.[0] || 'TBD'}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }} className="gold-text">€{event.price || 0}</div>
                </div>
                <button className="btn btn-gold" style={{ padding: '10px 20px', fontSize: '12px' }}>
                    View <ChevronRight size={14} />
                </button>
            </div>
        </div>
    </div>
);

export default Events;
