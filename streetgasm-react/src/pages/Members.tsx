import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { Search, ChevronRight, CheckCircle2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Member } from '@/types';

const Members = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const { data: membersData, isLoading } = useMembers({ page, per_page: 20, search, status: 'active' });
    const navigate = useNavigate();

    const members = membersData?.data || [];
    const totalPages = membersData?.totalPages || 1;

    // Debounced search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (isLoading && page === 1) {
        return (
            <>
                <header className="header">
                    <div className="header-left animate-fade">
                        <p>Overview</p>
                        <h1>Family <span className="gold-text">Members</span></h1>
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

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Overview</p>
                    <h1>Family <span className="gold-text">Members</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                <div className="members-header">
                    <h2 className="section-title">All <span>Members</span></h2>
                    <div className="members-actions">
                        <span className="btn btn-glass" style={{ cursor: 'default' }}>
                            <Users size={16} style={{ marginRight: 8 }} />
                            {membersData?.total || 0} Total
                        </span>
                        <button className="btn btn-gold">Add New Member</button>
                    </div>
                </div>

                {members.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No members found</p>
                    </div>
                ) : (
                    <>
                        <div className="members-grid">
                            {members.map((member, index) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    delay={index}
                                    onClick={() => navigate(`/members/${member.id}`)}
                                />
                            ))}
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

// Member Card Component
const MemberCard = ({ member, delay, onClick }: { member: Member; delay: number; onClick: () => void }) => {
    return (
        <div
            className={`member-card glass animate-fade delay-${Math.min(delay, 4)}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="member-header">
                <div className="member-info">
                    <div className="member-avatar">
                        {(member.first_name?.[0] || '') + (member.last_name?.[0] || '')}
                    </div>
                    <div>
                        <div className="member-name">{member.first_name} {member.last_name}</div>
                        <div className="member-role">{member.status === 'active' ? 'Gold Member' : 'Member'}</div>
                    </div>
                </div>
                <div className="member-more">
                    <ChevronRight size={16} />
                </div>
            </div>

            <div className="member-car">
                <img
                    src={member.auto?.foto || 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop'}
                    className="member-car-img"
                    alt={`${member.auto?.merk} ${member.auto?.model}`}
                />
                <div className="member-car-name">
                    {member.auto?.merk || 'Unknown'} {member.auto?.model || ''}
                </div>
            </div>

            <div className="member-footer">
                <div className="member-footer-item">
                    <CheckCircle2 size={12} /> Verified
                </div>
                <div className="status-dot"></div>
            </div>
        </div>
    );
};

export default Members;