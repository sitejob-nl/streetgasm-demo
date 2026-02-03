import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api';
import { Search, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types';

type StatusFilter = 'all' | 'completed' | 'processing' | 'pending' | 'cancelled';

const Orders = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const perPage = 15;

    const { data, isLoading } = useQuery({
        queryKey: ['orders', page, search, statusFilter],
        queryFn: () => getOrders({
            page,
            per_page: perPage,
            search,
            status: statusFilter === 'all' ? undefined : statusFilter
        }),
    });

    const orders = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const statusColors: Record<string, { bg: string; color: string }> = {
        completed: { bg: 'rgba(34, 197, 94, 0.1)', color: 'var(--green)' },
        processing: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue)' },
        pending: { bg: 'rgba(251, 191, 36, 0.1)', color: 'var(--gold-start)' },
        cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Sales</p>
                    <h1>Club <span className="gold-text">Orders</span></h1>
                </div>
                <div className="header-right" style={{ display: 'flex', gap: '12px' }}>
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select
                        className="glass"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '100px',
                            background: 'var(--glass-bg)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : orders.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <ShoppingBag size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No orders found</p>
                    </div>
                ) : (
                    <>
                        <div className="glass animate-fade" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={thStyle}>Order</th>
                                        <th style={thStyle}>Customer</th>
                                        <th style={thStyle}>Items</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Total</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order: Order) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 700 }}>#{order.id}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>
                                                        {order.billing?.first_name} {order.billing?.last_name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                        {order.billing?.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ color: 'var(--text-muted)' }}>
                                                    {order.line_items?.length || 0} item(s)
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'capitalize',
                                                    ...statusColors[order.status] || statusColors.pending
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 600 }}>€{order.total}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                {order.date_created ? format(new Date(order.date_created), 'MMM d, yyyy') : '-'}
                                            </td>
                                            <td style={tdStyle}>
                                                <button className="btn btn-glass" style={{ padding: '6px 12px' }}>
                                                    <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

export default Orders;
