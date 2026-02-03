import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { subscriptionToMember } from '@/lib/utils';
import { Globe, Users, MapPin, Search, Car } from 'lucide-react';

const Network = () => {
    const [search, setSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['network-members'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 100, status: 'active' }),
    });

    const members = (data?.data || []).map(subscriptionToMember);

    // Group by country
    const countryStats = members.reduce((acc, m) => {
        const country = m.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Group by city
    const cityStats = members.reduce((acc, m) => {
        const city = m.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get unique brands
    const brands = [...new Set(members.map(m => m.carBrand).filter(Boolean))];

    // Filter members
    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.city?.toLowerCase().includes(search.toLowerCase());
        const matchesBrand = !brandFilter || m.carBrand === brandFilter;
        return matchesSearch && matchesBrand;
    });

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Member Distribution</p>
                    <h1>Global <span className="gold-text">Network</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="btn btn-glass"
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        style={{ minWidth: '150px' }}
                    >
                        <option value="">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Users size={20} /></div>
                                <div className="stat-value">{members.length}</div>
                                <div className="stat-label">Total Members</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Globe size={20} /></div>
                                <div className="stat-value">{Object.keys(countryStats).length}</div>
                                <div className="stat-label">Countries</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><MapPin size={20} /></div>
                                <div className="stat-value">{Object.keys(cityStats).length}</div>
                                <div className="stat-label">Cities</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Car size={20} /></div>
                                <div className="stat-value">{brands.length}</div>
                                <div className="stat-label">Car Brands</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {/* Country Distribution */}
                            <div className="glass animate-fade delay-1" style={{ padding: '24px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Globe size={20} className="gold-text" /> By Country
                                </h3>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {Object.entries(countryStats)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 10)
                                        .map(([country, count]) => (
                                            <LocationBar key={country} label={country} count={count} total={members.length} />
                                        ))}
                                </div>
                            </div>

                            {/* City Distribution */}
                            <div className="glass animate-fade delay-2" style={{ padding: '24px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={20} className="gold-text" /> Top Cities
                                </h3>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {Object.entries(cityStats)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 10)
                                        .map(([city, count]) => (
                                            <LocationBar key={city} label={city} count={count} total={members.length} />
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Member List */}
                        {search && (
                            <div className="glass animate-fade" style={{ padding: '24px', borderRadius: '24px', marginTop: '32px' }}>
                                <h3 style={{ marginBottom: '16px' }}>Search Results ({filteredMembers.length})</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                                    {filteredMembers.slice(0, 20).map(member => (
                                        <div key={member.id} style={{
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>{member.name}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{member.city}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const LocationBar = ({ label, count, total }: { label: string; count: number; total: number }) => {
    const percentage = (count / total) * 100;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px' }}>{label}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{count}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, var(--gold-start), var(--gold-end))',
                    borderRadius: '3px'
                }} />
            </div>
        </div>
    );
};

export default Network;
