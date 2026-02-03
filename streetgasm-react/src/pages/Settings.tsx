import { useState } from 'react';
import { Settings2, Palette, Building2, Globe, Bell, Database, CheckCircle2 } from 'lucide-react';
import { usePreferences } from '@/store/usePreferences';

const Settings = () => {
    const preferences = usePreferences();
    const { setTheme, setAccentColor, setCompanyName, setDashboardTitle } = preferences;

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const accentColors = [
        { name: 'Gold', value: '#fbbf24' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Rose', value: '#f43f5e' },
    ];

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Configuration</p>
                    <h1>Dashboard <span className="gold-text">Settings</span></h1>
                </div>
                <div className="header-right">
                    <button className="btn btn-gold" onClick={handleSave}>
                        {saved ? (
                            <><CheckCircle2 size={16} style={{ marginRight: 8 }} /> Saved!</>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </header>

            <div className="content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* General Settings */}
                    <div className="glass animate-fade" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={20} className="gold-text" /> General
                        </h3>

                        <SettingRow label="Company Name">
                            <input
                                type="text"
                                value={preferences.companyName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                                style={inputStyle}
                            />
                        </SettingRow>

                        <SettingRow label="Dashboard Title">
                            <input
                                type="text"
                                value={preferences.dashboardTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDashboardTitle(e.target.value)}
                                style={inputStyle}
                            />
                        </SettingRow>
                    </div>

                    {/* Appearance */}
                    <div className="glass animate-fade delay-1" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Palette size={20} className="gold-text" /> Appearance
                        </h3>

                        <SettingRow label="Theme">
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {(['dark', 'light'] as const).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => setTheme(theme)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            background: preferences.theme === theme
                                                ? 'rgba(251, 191, 36, 0.2)'
                                                : 'rgba(0,0,0,0.2)',
                                            border: preferences.theme === theme
                                                ? '1px solid rgba(251, 191, 36, 0.3)'
                                                : '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </SettingRow>

                        <SettingRow label="Accent Color">
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {accentColors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setAccentColor(color.value)}
                                        title={color.name}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: color.value,
                                            border: preferences.accentColor === color.value
                                                ? '3px solid #fff'
                                                : '3px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </div>
                        </SettingRow>
                    </div>

                    {/* API Status */}
                    <div className="glass animate-fade delay-2" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Database size={20} className="gold-text" /> API Status
                        </h3>

                        <StatusItem
                            label="WooCommerce API"
                            status="connected"
                            icon={<Globe size={16} />}
                        />
                        <StatusItem
                            label="Supabase Connection"
                            status="connected"
                            icon={<Database size={16} />}
                        />
                        <StatusItem
                            label="Webhook Endpoint"
                            status="connected"
                            icon={<Settings2 size={16} />}
                        />
                    </div>

                    {/* Notifications */}
                    <div className="glass animate-fade delay-3" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bell size={20} className="gold-text" /> Notifications
                        </h3>

                        <ToggleRow label="Email notifications" defaultChecked />
                        <ToggleRow label="New member alerts" defaultChecked />
                        <ToggleRow label="Order notifications" defaultChecked />
                        <ToggleRow label="Weekly digest" defaultChecked={false} />
                    </div>
                </div>
            </div>
        </>
    );
};

const SettingRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{
            display: 'block',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {label}
        </label>
        {children}
    </div>
);

const StatusItem = ({ label, status, icon }: { label: string; status: 'connected' | 'error'; icon: React.ReactNode }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        marginBottom: '12px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
            <span>{label}</span>
        </div>
        <span style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '100px',
            background: status === 'connected' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status === 'connected' ? 'var(--green)' : '#ef4444'
        }}>
            {status === 'connected' ? 'Connected' : 'Error'}
        </span>
    </div>
);

const ToggleRow = ({ label, defaultChecked }: { label: string; defaultChecked: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            marginBottom: '12px'
        }}>
            <span>{label}</span>
            <button
                onClick={() => setChecked(!checked)}
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '100px',
                    background: checked ? 'var(--gold-start)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                }}
            >
                <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'all 0.2s'
                }} />
            </button>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '14px'
};

export default Settings;
