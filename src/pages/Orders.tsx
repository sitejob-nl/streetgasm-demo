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
            return '-';
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Financials</p>
                    <h1>Recent <span className="gold-text">Orders</span></h1>
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
                                            <th style={thStyle}>Order</th>
                                            <th style={thStyle}>Customer</th>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Total</th>
                                            <th style={thStyle}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <ShoppingBag size={16} style={{ color: 'var(--gold-start)' }} />
                                                        #{order.id}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: 600 }}>{order.billing?.first_name} {order.billing?.last_name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.billing?.email}</div>
                                                </td>
                                                <td style={tdStyle}>{formatDate(order.date_created)}</td>
                                                <td style={tdStyle}>
                                                    <span className={`status-badge status-${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>€{order.total}</td>
                                                <td style={tdStyle}>
                                                    <ChevronRight size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
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

                        {orders.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                <Package size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                <p>No orders found</p>
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

export default Orders;