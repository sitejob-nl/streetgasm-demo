import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Calendar, Plus } from 'lucide-react';

const Events = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useEvents({ page, per_page: 12 });

    const events = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Overview</p>
                    <h1>Upcoming <span className="gold-text">Experiences</span></h1>
                </div>
                <div className="header-right">
                    <button className="btn btn-gold">
                        <Plus size={16} style={{ marginRight: 8 }} /> Add Event
                    </button>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : events.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No events found</p>
                    </div>
                ) : (
                    <>
                        <div className="events-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {events.map((event, i) => (
                                <div
                                    key={event.id}
                                    className={`event-card animate-fade delay-${Math.min(i, 4)}`}
                                >
                                    <img
                                        src={event.images?.[0]?.src || 'https://streetgasm.com/wp-content/themes/streetgasm/assets/images/placeholder.jpg'}
                                        alt={event.name}
                                    />
                                    <div className="event-status glass">
                                        {event.stock_status === 'instock' ? 'Available' : 'Sold Out'}
                                    </div>
                                    <div className="event-content">
                                        <div className="event-date">
                                            <Calendar size={14} />
                                            {event.categories?.[0]?.name || 'Event'}
                                        </div>
                                        <h3 className="event-title">{event.name}</h3>
                                        <div className="event-loc">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {event.price ? `€${event.price}` : 'Price TBA'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                                <button
                                    className="btn btn-glass"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-glass"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Events;