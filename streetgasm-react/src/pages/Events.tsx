import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Calendar, MapPin, Users, ChevronRight, Search, Filter, Clock } from 'lucide-react';
import type { Event } from '@/types';

const Events = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useEvents({ page, per_page: 12, search: searchTerm });

    const events: Event[] = data?.data || [];
    const totalPages = data?.totalPages || 1;

    if (isLoading) {
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
                    <p>Event Management</p>
                    <h1>Upcoming <span className="gold-text">Experiences</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-glass"><Filter /> Filters</button>
                </div>
            </header>

            <div className="content">
                <div className="events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {events.map((event: Event) => (
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
                                    <Calendar size={14} />
                                    {event.categories?.[0]?.name || 'Event'}
                                </div>
                                <h3 className="event-title">{event.name}</h3>
                                <div className="event-loc">
                                    <MapPin size={14} />
                                    {event.short_description || 'Location TBA'}
                                </div>
                                <div className="event-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                        <Users size={14} />
                                        <span>{event.total_sales || 0} registered</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d4af37' }}>
                                        <Clock size={14} />
                                        <span>€{event.price || 'TBA'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                        <button
                            className="btn btn-glass"
                            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="btn btn-glass"
                            onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Events;
