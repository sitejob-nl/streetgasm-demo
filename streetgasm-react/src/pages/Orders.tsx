import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { ChevronRight, ShoppingBag, Package } from 'lucide-react';
import { format } from 'date-fns';

const Orders = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useOrders({ page, per_page: 20 });

    const orders = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const formatDate = (date: string) => {
        try {
            return format(new Date(date), 'MMM d, yyyy');
        } catch {
            return date;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'var(--green)';
            case 'processing': return 'var(--blue)';
            case 'pending': return 'var(--gold-start)';
            case 'on-hold': return '#f59e0b';
            case 'cancelled':
            case 'refunded':
            case 'failed': return '#ef4444';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Overview</p>
                    <h1>Ticket <span className="gold-text">Orders</span></h1>
                </div>
                <div className="header-right">
                    <div className="btn btn-glass" style={{ cursor: 'default' }}>
                        <ShoppingBag size={16} style={{ marginRight: 8 }} />
                        {data?.total || 0} Orders
                    </div>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : orders.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No orders found</p>
                    </div>
                ) : (
                    <>
                        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={thStyle}>Order</th>
                                        <th style={thStyle}>Customer</th>
                                        <th style={thStyle}>Product</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Total</th>
                                        <th style={thStyle}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr
                                            key={order.id}
                                            className={`animate-fade delay-${Math.min(i, 4)}`}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                        >
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 700, color: 'var(--gold-start)' }}>#{order.id}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{order.billing?.first_name} {order.billing?.last_name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.billing?.email}</div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Package size={14} style={{ color: 'var(--text-muted)' }} />
                                                    {order.line_items?.[0]?.name || 'Order'}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    background: `${getStatusColor(order.status)}20`,
                                                    color: getStatusColor(order.status),
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{formatDate(order.date_created)}</td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 700 }}>€{order.total}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ color: 'var(--gold-start)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    View <ChevronRight size={14} />
                                                </span>
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

export default Orders;
