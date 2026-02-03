import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions, subscriptionToMember } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft, Users, Car } from 'lucide-react';
import type { Member } from '@/types';

const Members = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const perPage = 12;

    const { data, isLoading } = useQuery({
        queryKey: ['members', page, search],
        queryFn: () => getSubscriptions({ page, per_page: perPage, search, status: 'active' }),
        select: (data) => ({
            ...data,
            data: data.data.map(subscriptionToMember),
        }),
    });

    const members = data?.data || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Community</p>
                    <h1>Club <span className="gold-text">Members</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : members.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <Users size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No members found</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '24px'
                        }}>
                            {members.map((member: Member, i: number) => (
                                <MemberCard key={member.id} member={member} delay={i} />
                            ))}
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

const MemberCard = ({ member, delay }: { member: Member; delay: number }) => (
    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={`glass member-card animate-fade delay-${Math.min(delay, 4)}`} style={{
            padding: '24px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="member-avatar" style={{ width: '56px', height: '56px', fontSize: '18px' }}>
                        {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{member.name}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.email}</p>
                        <div style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            background: 'rgba(251, 191, 36, 0.1)',
                            color: 'var(--gold-start)',
                            fontSize: '11px',
                            fontWeight: 700
                        }}>
                            {member.membershipType}
                        </div>
                    </div>
                </div>
                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            {member.vehicle && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                }}>
                    <Car size={14} />
                    {member.vehicle}
                </div>
            )}
        </div>
    </Link>
);

export default Members;
