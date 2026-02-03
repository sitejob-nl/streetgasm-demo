import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Search, Filter, ShoppingBag, DollarSign, Package, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types';

const Orders = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useOrders({
        page,
        per_page: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined
    });

    const orders: Order[] = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'completed': return '#22c55e';
            case 'processing': return '#3b82f6';
            case 'pending': return '#eab308';
            case 'cancelled': case 'refunded': case 'failed': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} />;
            case 'processing': return <Package size={14} />;
            case 'pending': return <Clock size={14} />;
            default: return <XCircle size={14} />;
        }
    };

    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total || '0'), 0);

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
                    <p>Order Management</p>
                    <h1><span className="gold-text">Orders</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="btn btn-glass"
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </header>

            <div className="content">
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><ShoppingBag /></div>
                        <div className="stat-value">{total}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><DollarSign /></div>
                        <div className="stat-value">€{totalRevenue.toFixed(2)}</div>
                        <div className="stat-label">Revenue (This Page)</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><CheckCircle2 /></div>
                        <div className="stat-value">{orders.filter((o: Order) => o.status === 'completed').length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="table-container glass" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Order</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Customer</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Items</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Total</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: Order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: '#d4af37' }}>#{order.id}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #d4af37, #a68b2a)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '12px', fontWeight: 700
                                            }}>
                                                {(order.billing.first_name?.[0] || '') + (order.billing.last_name?.[0] || '')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{order.billing.first_name} {order.billing.last_name}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{order.billing.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {order.line_items?.map((item, idx: number) => item.name).join(', ') || 'No items'}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                                        €{order.total}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.25rem 0.75rem', borderRadius: '999px',
                                            background: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status),
                                            fontSize: '12px', fontWeight: 500
                                        }}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {format(new Date(order.date_created), 'MMM dd, yyyy')}
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

export default Orders;
