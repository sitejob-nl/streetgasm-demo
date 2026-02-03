import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/lib/api';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Car, CreditCard, User } from 'lucide-react';
import { format } from 'date-fns';

const MemberDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data: subscription, isLoading } = useQuery({
        queryKey: ['subscription', id],
        queryFn: () => getSubscription(Number(id)),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="content">
                <div className="loader"><div className="loader-spinner"></div></div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="content">
                <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                    <User size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Member not found</p>
                    <Link to="/members" className="btn btn-glass" style={{ marginTop: '16px' }}>
                        <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Members
                    </Link>
                </div>
            </div>
        );
    }

    const billing = subscription.billing;
    const auto = subscription.auto;
    const memberName = `${billing?.first_name || ''} ${billing?.last_name || ''}`.trim() || 'Unknown';

    const statusColors: Record<string, { bg: string; color: string }> = {
        active: { bg: 'rgba(34, 197, 94, 0.1)', color: 'var(--green)' },
        'on-hold': { bg: 'rgba(251, 191, 36, 0.1)', color: 'var(--gold-start)' },
        cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
        pending: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue)' },
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <Link to="/members" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Back to Members
                    </Link>
                    <h1>{memberName}</h1>
                </div>
                <div className="header-right">
                    <span style={{
                        padding: '8px 20px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        ...statusColors[subscription.status] || statusColors.pending
                    }}>
                        {subscription.status}
                    </span>
                </div>
            </header>

            <div className="content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* Contact Info */}
                    <div className="glass animate-fade" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} className="gold-text" /> Contact Information
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <InfoRow icon={<Mail size={16} />} label="Email" value={billing?.email || '-'} />
                            <InfoRow icon={<Phone size={16} />} label="Phone" value={billing?.phone || '-'} />
                            <InfoRow
                                icon={<MapPin size={16} />}
                                label="Address"
                                value={billing?.address_1
                                    ? `${billing.address_1}, ${billing.city || ''} ${billing.postcode || ''}`
                                    : '-'
                                }
                            />
                        </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="glass animate-fade delay-1" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={20} className="gold-text" /> Subscription Details
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <InfoRow
                                icon={<Calendar size={16} />}
                                label="Member Since"
                                value={subscription.start_date ? format(new Date(subscription.start_date), 'MMMM d, yyyy') : '-'}
                            />
                            <InfoRow
                                icon={<CreditCard size={16} />}
                                label="Membership"
                                value={subscription.line_items?.[0]?.name || 'Standard'}
                            />
                            <InfoRow
                                icon={<Calendar size={16} />}
                                label="Next Payment"
                                value={subscription.next_payment_date ? format(new Date(subscription.next_payment_date), 'MMMM d, yyyy') : '-'}
                            />
                            <InfoRow
                                icon={<CreditCard size={16} />}
                                label="Amount"
                                value={`€${subscription.total || 0}`}
                            />
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    {auto?.merk && (
                        <div className="glass animate-fade delay-2" style={{ padding: '32px', borderRadius: '24px', gridColumn: 'span 2' }}>
                            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Car size={20} className="gold-text" /> Vehicle Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div>
                                    {auto.foto ? (
                                        <img
                                            src={auto.foto}
                                            alt={`${auto.merk} ${auto.model}`}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '16px'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '200px',
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(0,0,0,0.3))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Car size={48} style={{ color: 'var(--gold-start)', opacity: 0.3 }} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Make & Model</div>
                                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{auto.merk} {auto.model}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        <VehicleStat label="Year" value={auto.bouwjaar || '-'} />
                                        <VehicleStat label="Power" value={auto.vermogen ? `${auto.vermogen} hp` : '-'} />
                                        <VehicleStat label="Status" value="Verified" highlight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ color: 'var(--gold-start)', marginTop: '2px' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '14px' }}>{value}</div>
        </div>
    </div>
);

const VehicleStat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div style={{
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.2)',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: highlight ? 'var(--green)' : 'inherit' }}>{value}</div>
    </div>
);

export default MemberDetail;
