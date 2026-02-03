import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { Search, Filter, Users, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Member } from '@/types';

const Members = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useMembers({
        page,
        per_page: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm
    });

    const members: Member[] = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle2 size={14} className="text-green-500" />;
            case 'on-hold': return <Clock size={14} className="text-yellow-500" />;
            case 'cancelled': return <XCircle size={14} className="text-red-500" />;
            default: return <Clock size={14} className="text-slate-500" />;
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
                    <p>Member Management</p>
                    <h1><span className="gold-text">Members</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="btn btn-glass"
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            <div className="content">
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '2rem' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><Users /></div>
                        <div className="stat-value">{total}</div>
                        <div className="stat-label">Total Members</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon-box"><CheckCircle2 /></div>
                        <div className="stat-value">{members.filter((m: Member) => m.status === 'active').length}</div>
                        <div className="stat-label">Active This Page</div>
                    </div>
                </div>

                <div className="members-grid">
                    {members.map((member: Member) => (
                        <Link to={`/members/${member.id}`} key={member.id} className="member-card glass" style={{ textDecoration: 'none' }}>
                            <div className="member-header">
                                <div className="member-info">
                                    <div className="member-avatar">
                                        {(member.first_name?.[0] || '') + (member.last_name?.[0] || '')}
                                    </div>
                                    <div>
                                        <div className="member-name">{member.first_name} {member.last_name}</div>
                                        <div className="member-role">{member.email}</div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400" />
                            </div>

                            <div className="member-car">
                                <img
                                    src={member.auto?.foto || 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670'}
                                    className="member-car-img"
                                    alt="Member car"
                                />
                                <div className="member-car-name">
                                    {member.auto?.merk || 'No car'} {member.auto?.model || ''}
                                </div>
                            </div>

                            <div className="member-footer">
                                <div className="member-footer-item">
                                    {getStatusIcon(member.status)}
                                    {member.status}
                                </div>
                                <div className="status-dot" style={{
                                    background: member.status === 'active' ? '#22c55e' :
                                              member.status === 'on-hold' ? '#eab308' : '#ef4444'
                                }}></div>
                            </div>
                        </Link>
                    ))}
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

export default Members;
