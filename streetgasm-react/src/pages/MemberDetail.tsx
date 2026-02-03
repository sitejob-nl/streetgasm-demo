import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/lib/api';
import { ArrowLeft, Calendar, CreditCard, Car, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import type { Subscription } from '@/types';

const MemberDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: member, isLoading, error } = useQuery<Subscription>({
        queryKey: ['subscription', id],
        queryFn: () => getSubscription(Number(id)),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <>
                <header className="header">
                    <div className="header-left animate-fade">
                        <p>Member Profile</p>
                        <h1>Loading...</h1>
                    </div>
                </header>
                <div className="content">
                    <div className="loader">
                        <div className="loader-spinner"></div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !member) {
        return (
            <>
                <header className="header">
                    <div className="header-left animate-fade">
                        <p>Member Profile</p>
                        <h1>Not Found</h1>
                    </div>
                </header>
                <div className="content">
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Member not found</p>
                        <Link to="/members" className="btn btn-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
                            Back to Members
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const formatDate = (date: string | undefined): string => {
        if (!date) return '-';
        try {
            return format(new Date(date), 'MMM d, yyyy');
        } catch {
            return date;
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <Link to="/members" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-start)', marginBottom: '8px', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Back to Members
                    </Link>
                    <h1>{member.billing?.first_name} <span className="gold-text">{member.billing?.last_name}</span></h1>
                </div>
            </header>

            <div className="content">
                <div className="split-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Member Info */}
                    <div className="animate-fade delay-1">
                        <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                                <div className="member-avatar" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                                    {(member.billing?.first_name?.[0] || '') + (member.billing?.last_name?.[0] || '')}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>
                                        {member.billing?.first_name} {member.billing?.last_name}
                                    </h2>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '100px',
                                        background: member.status === 'active'
                                            ? 'rgba(34, 197, 94, 0.1)'
                                            : 'rgba(251, 191, 36, 0.1)',
                                        color: member.status === 'active' ? 'var(--green)' : 'var(--gold-start)',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {member.status === 'active' ? 'Gold Member' : member.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '16px' }}>
                                <InfoRow icon={<Mail size={16} />} label="Email" value={member.billing?.email || '-'} />
                                <InfoRow icon={<Phone size={16} />} label="Phone" value={member.billing?.phone || '-'} />
                                <InfoRow
                                    icon={<MapPin size={16} />}
                                    label="Location"
                                    value={`${member.billing?.city || ''}, ${member.billing?.country || ''}`.replace(/^, |, $/g, '') || '-'}
                                />
                                <InfoRow
                                    icon={<Calendar size={16} />}
                                    label="Member Since"
                                    value={formatDate(member.start_date)}
                                />
                                <InfoRow
                                    icon={<CreditCard size={16} />}
                                    label="Next Payment"
                                    value={formatDate(member.next_payment_date)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="animate-fade delay-2">
                        <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Car size={20} className="gold-text" /> Vehicle
                            </h3>

                            {member.auto?.foto && (
                                <div style={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    marginBottom: '24px',
                                    background: 'rgba(0,0,0,0.3)'
                                }}>
                                    <img
                                        src={member.auto.foto}
                                        alt={`${member.auto.merk} ${member.auto.model}`}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <StatBox label="Brand" value={member.auto?.merk || 'Unknown'} />
                                <StatBox label="Model" value={member.auto?.model || '-'} />
                                <StatBox label="Year" value={member.auto?.bouwjaar || '-'} />
                                <StatBox label="Power" value={member.auto?.vermogen ? `${member.auto.vermogen} hp` : '-'} />
                            </div>

                            {member.auto?.merk && (
                                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)' }}>
                                    <CheckCircle2 size={16} /> Vehicle Verified
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Helper components
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--gold-start)' }}>{icon}</span>
        <span style={{ color: 'var(--text-muted)', minWidth: '100px' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
);

const StatBox = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>{value}</div>
    </div>
);

export default MemberDetail;
