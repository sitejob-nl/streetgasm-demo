import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { Search, Filter, Users, CreditCard, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Subscription } from '@/types';

interface SubscriptionResponse {
    data: Subscription[];
    total: number;
    totalPages: number;
    page: number;
}

const Subscriptions = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<SubscriptionResponse>({
        queryKey: ['subscriptions', { page, statusFilter }],
        queryFn: () => getSubscriptions({
            page,
            per_page: 20,
            status: statusFilter !== 'all' ? statusFilter : undefined
        })
    });

    const subscriptions: Subscription[] = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'active': return '#22c55e';
            case 'on-hold': return '#eab308';
            case 'pending': return '#3b82f6';
            case 'cancelled': case 'expired': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle2 size={14} />;
            case 'on-hold': case 'pending': return <Clock size={14} />;
            default: return <XCircle size={14} />;
        }
    };

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
                    <p>Subscription Management</p>
                    <h1><span className="gold-text">Subscriptions</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="btn btn-glass"
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            <div className="content">
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><Users /></div>
                        <div className="stat-value">{total}</div>
                        <div className="stat-label">Total Subscriptions</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><CheckCircle2 /></div>
                        <div className="stat-value">{subscriptions.filter((s: Subscription) => s.status === 'active').length}</div>
                        <div className="stat-label">Active (This Page)</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><CreditCard /></div>
                        <div className="stat-value">{subscriptions.filter((s: Subscription) => s.status === 'on-hold').length}</div>
                        <div className="stat-label">On Hold (This Page)</div>
                    </div>
                </div>

                <div className="table-container glass" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Member</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Plan</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Start Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Next Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub: Subscription) => (
                                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: '#d4af37' }}>#{sub.id}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #d4af37, #a68b2a)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '12px', fontWeight: 700
                                            }}>
                                                {(sub.billing?.first_name?.[0] || '') + (sub.billing?.last_name?.[0] || '')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{sub.billing?.first_name} {sub.billing?.last_name}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{sub.billing?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {sub.line_items?.[0]?.name || 'Gold Membership'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.25rem 0.75rem', borderRadius: '999px',
                                            background: `${getStatusColor(sub.status)}20`,
                                            color: getStatusColor(sub.status),
                                            fontSize: '12px', fontWeight: 500
                                        }}>
                                            {getStatusIcon(sub.status)}
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {sub.start_date ? format(new Date(sub.start_date), 'MMM dd, yyyy') : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {sub.next_payment_date ? format(new Date(sub.next_payment_date), 'MMM dd, yyyy') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default Subscriptions;
