import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { Car, Search, ChevronRight, Gauge, CheckCircle2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Member {
    id: number;
    billing?: {
        first_name?: string;
        last_name?: string;
    };
    auto?: {
        merk?: string;
        model?: string;
        bouwjaar?: string;
        vermogen?: string;
        foto?: string;
    };
}

const Garage = () => {
    const [search, setSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['garage-vehicles'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 100, status: 'active' }),
    });

    const members: Member[] = data?.data || [];

    // Get unique brands
    const brands = [...new Set(members.map((m: Member) => m.auto?.merk).filter(Boolean))].sort() as string[];

    // Filter members with vehicles
    const vehicleMembers = members.filter((m: Member) => m.auto?.merk);

    const filteredVehicles = vehicleMembers.filter((member: Member) => {
        const matchesSearch = search === '' ||
            `${member.auto?.merk} ${member.auto?.model}`.toLowerCase().includes(search.toLowerCase()) ||
            `${member.billing?.first_name} ${member.billing?.last_name}`.toLowerCase().includes(search.toLowerCase());
        const matchesBrand = brandFilter === '' || member.auto?.merk === brandFilter;
        return matchesSearch && matchesBrand;
    });

    // Stats
    const totalVehicles = vehicleMembers.length;
    const totalPower = vehicleMembers.reduce((sum: number, m: Member) => sum + (Number(m.auto?.vermogen) || 0), 0);
    const avgPower = totalVehicles > 0 ? Math.round(totalPower / totalVehicles) : 0;

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Vehicle Database</p>
                    <h1>Member <span className="gold-text">Garage</span></h1>
                </div>
                <div className="header-right" style={{ display: 'flex', gap: '12px' }}>
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="glass"
                        value={brandFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '100px',
                            background: 'var(--glass-bg)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand: string) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="content">
                {/* Stats */}
                <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Car size={20} /></div>
                        <div className="stat-value">{totalVehicles}</div>
                        <div className="stat-label">Registered Vehicles</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Filter size={20} /></div>
                        <div className="stat-value">{brands.length}</div>
                        <div className="stat-label">Unique Brands</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Gauge size={20} /></div>
                        <div className="stat-value">{avgPower} hp</div>
                        <div className="stat-label">Avg Power</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><CheckCircle2 size={20} /></div>
                        <div className="stat-value">{vehicleMembers.filter((m: Member) => m.auto?.foto).length}</div>
                        <div className="stat-label">With Photos</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <Car size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No vehicles found</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {filteredVehicles.map((member: Member, i: number) => (
                            <Link
                                key={member.id}
                                to={`/members/${member.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div
                                    className={`glass animate-fade delay-${Math.min(i, 4)}`}
                                    style={{
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {/* Vehicle Image */}
                                    <div style={{
                                        height: '180px',
                                        background: member.auto?.foto
                                            ? `url(${member.auto.foto}) center/cover`
                                            : 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(0,0,0,0.3))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {!member.auto?.foto && (
                                            <Car size={48} style={{ color: 'var(--gold-start)', opacity: 0.3 }} />
                                        )}
                                    </div>

                                    {/* Vehicle Info */}
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div>
                                                <h3 style={{ marginBottom: '4px' }}>
                                                    {member.auto?.merk} {member.auto?.model}
                                                </h3>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    Owner: {member.billing?.first_name} {member.billing?.last_name}
                                                </span>
                                            </div>
                                            <ChevronRight size={20} style={{ color: 'var(--gold-start)' }} />
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '12px',
                                            paddingTop: '16px',
                                            borderTop: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Year</div>
                                                <div style={{ fontWeight: 600 }}>{member.auto?.bouwjaar || '-'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power</div>
                                                <div style={{ fontWeight: 600 }}>{member.auto?.vermogen ? `${member.auto.vermogen} hp` : '-'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                                                <div style={{ fontWeight: 600, color: 'var(--green)' }}>Verified</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Garage;
