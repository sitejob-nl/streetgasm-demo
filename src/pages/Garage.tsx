import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api';
import { subscriptionToMember } from '@/lib/utils';
import { Car, Search, Zap, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Garage = () => {
    const [search, setSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['garage-vehicles'],
        queryFn: () => getSubscriptions({ page: 1, per_page: 100, status: 'active' }),
    });

    const members = (data?.data || []).map(subscriptionToMember);
    const vehicles = members.filter(m => m.carBrand);

    // Get unique brands
    const brands = [...new Set(vehicles.map(m => m.carBrand).filter(Boolean))];

    // Calculate stats
    const totalPower = vehicles.reduce((sum, v) => sum + (v.carPower || 0), 0);
    const avgPower = vehicles.length > 0 ? Math.round(totalPower / vehicles.length) : 0;

    // Filter vehicles
    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.carBrand?.toLowerCase().includes(search.toLowerCase()) ||
            v.carModel?.toLowerCase().includes(search.toLowerCase());
        const matchesBrand = !brandFilter || v.carBrand === brandFilter;
        return matchesSearch && matchesBrand;
    });

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Vehicle Collection</p>
                    <h1>Club <span className="gold-text">Garage</span></h1>
                </div>
                <div className="header-right">
                    <select
                        className="btn btn-glass"
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        style={{ minWidth: '150px' }}
                    >
                        <option value="">All Brands</option>
                        {brands.sort().map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <div className="search-box glass">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
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
                        {/* Stats */}
                        <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Car size={20} /></div>
                                <div className="stat-value">{vehicles.length}</div>
                                <div className="stat-label">Total Vehicles</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Award size={20} /></div>
                                <div className="stat-value">{brands.length}</div>
                                <div className="stat-label">Brands</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Zap size={20} /></div>
                                <div className="stat-value">{totalPower.toLocaleString()}</div>
                                <div className="stat-label">Total HP</div>
                            </div>
                            <div className="stat-card glass">
                                <div className="stat-icon"><Users size={20} /></div>
                                <div className="stat-value">{avgPower}</div>
                                <div className="stat-label">Avg HP</div>
                            </div>
                        </div>

                        {/* Vehicle Grid */}
                        <div className="member-grid">
                            {filteredVehicles.map((vehicle, i) => (
                                <Link
                                    to={`/members/${vehicle.id}`}
                                    key={vehicle.id}
                                    className={`glass member-card animate-fade delay-${Math.min(i % 5, 4)}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                                                {vehicle.carBrand}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                                {vehicle.carModel || 'Model N/A'}
                                            </div>
                                        </div>
                                        {vehicle.carPower && (
                                            <div style={{
                                                padding: '6px 12px',
                                                background: 'linear-gradient(135deg, var(--gold-start), var(--gold-end))',
                                                borderRadius: '100px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#000'
                                            }}>
                                                {vehicle.carPower} HP
                                            </div>
                                        )}
                                    </div>

                                    <div style={{
                                        padding: '12px',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '12px',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Year</span>
                                            <span>{vehicle.carYear || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <Users size={14} />
                                        {vehicle.name}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredVehicles.length === 0 && (
                            <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                                <Car size={48} style={{ color: 'var(--gold-start)', marginBottom: '16px', opacity: 0.5 }} />
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>No vehicles found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Garage;
