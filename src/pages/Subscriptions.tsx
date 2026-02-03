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
        queryFn: () => getSubscriptions({ page, per_page: 20, status: statusFilter }),
    });

    const subscriptions = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Membership</p>
                    <h1>Active <span className="gold-text">Subscriptions</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="glass"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
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
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        <div className="glass animate-fade" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <tr>
                                            <th style={thStyle}>ID</th>
                                            <th style={thStyle}>Member</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Next Payment</th>
                                            <th style={thStyle}>Start Date</th>
                                            <th style={thStyle}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptions.map((sub) => (
                                            <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={tdStyle}>#{sub.id}</td>
                                                <td style={tdStyle} className="font-semibold">
                                                    {sub.billing.first_name} {sub.billing.last_name}
                                                </td>
                                                <td style={tdStyle}>
                                                    <span className={`status-badge status-${sub.status}`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    {sub.next_payment_date ? format(new Date(sub.next_payment_date), 'MMM d, yyyy') : '-'}
                                                </td>
                                                <td style={tdStyle}>
                                                    {sub.start_date ? format(new Date(sub.start_date), 'MMM d, yyyy') : '-'}
                                                </td>
                                                <td style={tdStyle}>
                                                    <Link to={`/members/${sub.id}`}>
                                                        <ChevronRight size={16} className="text-gray-400 hover:text-white" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination" style={{ marginTop: '24px' }}>
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

const thStyle: React.CSSProperties = {
    padding: '16px 24px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '14px'
};

export default Subscriptions;