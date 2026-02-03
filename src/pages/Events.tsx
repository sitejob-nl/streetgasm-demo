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
                    <h1>Upcoming <span className="gold-text">Events</span></h1>
                </div>
                <div className="header-right">
                    <button className="btn btn-gold">
                        <Plus size={16} style={{ marginRight: 8 }} />
                        New Event
                    </button>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        <div className="members-grid">
                            {events.map((event, i) => (
                                <div
                                    key={event.id}
                                    className={`member-card glass animate-fade delay-${Math.min(i, 4)}`}
                                >
                                    <div className="member-info">
                                        <div className="member-avatar" style={{ fontSize: '24px' }}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div className="member-name">{event.name}</div>
                                            <div className="member-email" dangerouslySetInnerHTML={{
                                                __html: event.short_description || event.description || ''
                                            }} />
                                        </div>
                                    </div>
                                    <div className="member-meta">
                                        <div className="meta-item">
                                            <div className="meta-label">Date</div>
                                            <div className="meta-value">
                                                {event.date_created ? new Date(event.date_created).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                        <div className="meta-item">
                                            <div className="meta-label">Status</div>
                                            <div className="meta-value" style={{
                                                color: event.stock_status === 'instock' ? 'var(--green)' : 'var(--red)'
                                            }}>
                                                {event.stock_status === 'instock' ? 'Open' : 'Closed'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="member-actions">
                                        <button className="btn btn-glass" style={{ width: '100%' }}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-glass"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-glass"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
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