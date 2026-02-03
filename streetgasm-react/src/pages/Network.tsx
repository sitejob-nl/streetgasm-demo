import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { Users, MapPin, Search, Globe, Car } from 'lucide-react';

interface Member {
    id: number;
    status: string;
    billing?: {
        first_name?: string;
        last_name?: string;
        city?: string;
        country?: string;
    };
    auto?: {
        merk?: string;
    };
}

const Network = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['network-members'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 100, status: 'active' }),
    });

    const members: Member[] = data?.data || [];

    // Group members by country/city
    const locationGroups = members.reduce((acc: Record<string, Member[]>, member: Member) => {
        const country = member.billing?.country || 'Unknown';
        if (!acc[country]) acc[country] = [];
        acc[country].push(member);
        return acc;
    }, {});

    const filteredMembers = search
        ? members.filter((m: Member) =>
            `${m.billing?.first_name} ${m.billing?.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            m.billing?.city?.toLowerCase().includes(search.toLowerCase())
        )
        : members;

    // Stats
    const totalMembers = members.length;
    const countries = Object.keys(locationGroups).length;
    const cities = [...new Set(members.map((m: Member) => m.billing?.city).filter(Boolean))].length;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Community</p>
                    <h1>Member <span className="gold-text">Network</span></h1>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search members or cities..."
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {/* Stats Grid */}
                <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Users size={20} /></div>
                        <div className="stat-value">{totalMembers}</div>
                        <div className="stat-label">Active Members</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Globe size={20} /></div>
                        <div className="stat-value">{countries}</div>
                        <div className="stat-label">Countries</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><MapPin size={20} /></div>
                        <div className="stat-value">{cities}</div>
                        <div className="stat-label">Cities</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Car size={20} /></div>
                        <div className="stat-value">{members.filter((m: Member) => m.auto?.merk).length}</div>
                        <div className="stat-label">Verified Vehicles</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                        {/* Country List */}
                        <div className="glass animate-fade delay-1" style={{ padding: '24px', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '24px' }}>By Country</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {Object.entries(locationGroups)
                                    .sort(([, a], [, b]) => (b as Member[]).length - (a as Member[]).length)
                                    .map(([country, countryMembers]) => (
                                        <div
                                            key={country}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}
                                        >
                                            <span>{country || 'Unknown'}</span>
                                            <span style={{
                                                background: 'var(--gold-start)',
                                                color: '#000',
                                                padding: '2px 10px',
                                                borderRadius: '100px',
                                                fontSize: '12px',
                                                fontWeight: 700
                                            }}>
                                                {(countryMembers as Member[]).length}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Member Grid */}
                        <div className="glass animate-fade delay-2" style={{ padding: '24px', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '24px' }}>
                                {search ? `Results (${filteredMembers.length})` : 'All Members'}
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '12px',
                                maxHeight: '500px',
                                overflowY: 'auto'
                            }}>
                                {filteredMembers.slice(0, 50).map((member: Member) => (
                                    <div
                                        key={member.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <div className="member-avatar" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                                            {(member.billing?.first_name?.[0] || '') + (member.billing?.last_name?.[0] || '')}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {member.billing?.first_name} {member.billing?.last_name}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {member.billing?.city || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {filteredMembers.length > 50 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '16px', fontSize: '13px' }}>
                                    Showing 50 of {filteredMembers.length} members
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Network;
