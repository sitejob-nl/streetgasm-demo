import { useState, useEffect } from 'react';
import { Settings2, Palette, Bell, CheckCircle2, XCircle, Wifi } from 'lucide-react';
import { usePreferences } from '@/store/usePreferences';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const preferences = usePreferences();
    const { setTheme, setAccentColor, setCompanyName, setDashboardTitle } = preferences;
    const [apiStatus, setApiStatus] = useState<{ woo: boolean; supabase: boolean }>({ woo: false, supabase: false });
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkApiStatus();
    }, []);

    const checkApiStatus = async () => {
        setChecking(true);
        try {
            const res = await fetch('/api/stats');
            setApiStatus(prev => ({ ...prev, woo: res.ok }));
        } catch {
            setApiStatus(prev => ({ ...prev, woo: false }));
        }
        try {
            const res = await fetch('/api/config');
            setApiStatus(prev => ({ ...prev, supabase: res.ok }));
        } catch {
            setApiStatus(prev => ({ ...prev, supabase: false }));
        }
        setChecking(false);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Settings2 size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'api', label: 'API Status', icon: <Wifi size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Configuration</p>
                    <h1>Dashboard <span className="gold-text">Settings</span></h1>
                </div>
            </header>

            <div className="content">
                {/* Tab Navigation */}
                <div className="glass" style={{ display: 'flex', borderRadius: '16px', padding: '8px', marginBottom: '32px', gap: '8px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={activeTab === tab.id ? 'btn btn-gold' : 'btn btn-glass'}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="glass animate-fade" style={{ padding: '32px', borderRadius: '24px' }}>
                    {activeTab === 'general' && (
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <h3 style={{ marginBottom: '8px' }}>General Settings</h3>
                            <FormField
                                label="Company Name"
                                value={preferences.companyName}
                                onChange={(v) => setCompanyName(v)}
                            />
                            <FormField
                                label="Dashboard Title"
                                value={preferences.dashboardTitle}
                                onChange={(v) => setDashboardTitle(v)}
                            />
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <h3 style={{ marginBottom: '8px' }}>Appearance</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                                    Theme
                                </label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className={`btn ${preferences.theme === 'dark' ? 'btn-gold' : 'btn-glass'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        Dark Mode
                                    </button>
                                    <button
                                        className={`btn ${preferences.theme === 'light' ? 'btn-gold' : 'btn-glass'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        Light Mode
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                                    Accent Color
                                </label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['#fbbf24', '#3b82f6', '#22c55e', '#f43f5e', '#8b5cf6'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setAccentColor(color)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: color,
                                                border: preferences.accentColor === color ? '3px solid #fff' : '3px solid transparent',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <h3 style={{ marginBottom: '8px' }}>API Connections</h3>
                            {checking ? (
                                <div className="loader"><div className="loader-spinner"></div></div>
                            ) : (
                                <>
                                    <StatusCard
                                        label="WooCommerce API"
                                        connected={apiStatus.woo}
                                        description="Product, order and subscription data"
                                    />
                                    <StatusCard
                                        label="Supabase"
                                        connected={apiStatus.supabase}
                                        description="User preferences and activity logging"
                                    />
                                </>
                            )}
                            <button className="btn btn-glass" onClick={checkApiStatus} style={{ width: 'fit-content' }}>
                                Refresh Status
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <h3 style={{ marginBottom: '8px' }}>Notification Preferences</h3>
                            <ToggleOption label="New Member Notifications" defaultChecked />
                            <ToggleOption label="Order Notifications" defaultChecked />
                            <ToggleOption label="Event Reminders" defaultChecked />
                            <ToggleOption label="System Updates" defaultChecked={false} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Helper components
const FormField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            {label}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                maxWidth: '400px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px',
            }}
        />
    </div>
);

const StatusCard = ({ label, connected, description }: { label: string; connected: boolean; description: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.05)',
    }}>
        <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{description}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: connected ? 'var(--green)' : '#ef4444' }}>
            {connected ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {connected ? 'Connected' : 'Disconnected'}
        </div>
    </div>
);

const ToggleOption = ({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)',
        }}>
            <span>{label}</span>
            <button
                onClick={() => setChecked(!checked)}
                style={{
                    width: '48px',
                    height: '24px',
                    borderRadius: '12px',
                    background: checked ? 'var(--gold-start)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                }}
            >
                <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '26px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                }} />
            </button>
        </div>
    );
};

export default Settings;
