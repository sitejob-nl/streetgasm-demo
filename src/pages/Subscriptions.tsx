import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Subscriptions = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data, isLoading } = useQuery({
        queryKey: ['subscriptions', page, statusFilter],
        queryFn: () => getSubscriptions({ page, per_page: 20, status: statusFilter || undefined }),
    });

    const subscriptions = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const formatDate = (date: string | undefined) => {
        if (!date) return '-';
        try {
            return format(new Date(date), 'MMM d, yyyy');
        } catch {
            return date;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'var(--green)';
            case 'on-hold': return 'var(--gold-start)';
            case 'cancelled': return '#ef4444';
            case 'pending': return 'var(--blue)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Overview</p>
                    <h1>Gold <span className="gold-text">Subscriptions</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="glass"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '100px',
                            background: 'var(--glass-bg)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : subscriptions.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No subscriptions found</p>
                    </div>
                ) : (
                    <>
                        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={thStyle}>Member</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Start Date</th>
                                        <th style={thStyle}>Next Payment</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub, i) => (
                                        <tr
                                            key={sub.id}
                                            className={`animate-fade delay-${Math.min(i, 4)}`}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                        >
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="member-avatar" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                                                        {(sub.billing?.first_name?.[0] || '') + (sub.billing?.last_name?.[0] || '')}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{sub.billing?.first_name} {sub.billing?.last_name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.billing?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    background: `${getStatusColor(sub.status)}20`,
                                                    color: getStatusColor(sub.status),
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{formatDate(sub.start_date)}</td>
                                            <td style={tdStyle}>{formatDate(sub.next_payment_date)}</td>
                                            <td style={tdStyle}>€{sub.total}</td>
                                            <td style={tdStyle}>
                                                <Link
                                                    to={`/members/${sub.id}`}
                                                    style={{ color: 'var(--gold-start)', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    View <ChevronRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

const thStyle: React.CSSProperties = {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 20px',
    fontSize: '14px'
};

export default Subscriptions;
