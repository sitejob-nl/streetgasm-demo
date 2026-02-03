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

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Overview</p>
                    <h1>Family <span className="gold-text">Members</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {/* Stats Row */}
                <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Users size={20} /></div>
                        <div className="stat-value">{membersData?.total || 0}</div>
                        <div className="stat-label">Active Members</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><CheckCircle2 size={20} /></div>
                        <div className="stat-value">98%</div>
                        <div className="stat-label">Retention Rate</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        <div className="glass animate-fade delay-1" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <tr>
                                            <th style={thStyle}>Member</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Since</th>
                                            <th style={thStyle}>Car</th>
                                            <th style={thStyle}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member, i) => (
                                            <MemberCard key={member.id} member={member} index={i} onClick={() => navigate(`/members/${member.id}`)} />
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
                    </>
                )}
            </div>
        </>
    );
};

const MemberCard = ({ member, index, onClick }: { member: Member; index: number; onClick: () => void }) => (
    <tr
        onClick={onClick}
        style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'background 0.2s',
            cursor: 'pointer'
        }}
        className="hover:bg-white/5"
    >
        <td style={tdStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="member-avatar" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                    {(member.billing?.first_name?.[0] || '') + (member.billing?.last_name?.[0] || '')}
                </div>
                <div>
                    <div style={{ fontWeight: 600 }}>{member.billing?.first_name} {member.billing?.last_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.billing?.email}</div>
                </div>
            </div>
        </td>
        <td style={tdStyle}>
            <span className={`status-badge status-${member.status}`}>
                {member.status}
            </span>
        </td>
        <td style={tdStyle}>
            {member.start_date ? new Date(member.start_date).toLocaleDateString() : '-'}
        </td>
        <td style={tdStyle}>
            {member.auto?.merk ? `${member.auto.merk} ${member.auto.model}` : '-'}
        </td>
        <td style={tdStyle}>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </td>
    </tr>
);

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

export default Members;