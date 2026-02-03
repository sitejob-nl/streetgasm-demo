import { useState } from 'react';
import { Mail, Send, Users, MessageSquare, Bell, Megaphone, Calendar, CheckCircle2 } from 'lucide-react';

const Marketing = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const templates = [
        { id: 'welcome', name: 'Welcome Email', icon: <Users size={20} />, description: 'New member onboarding' },
        { id: 'event', name: 'Event Announcement', icon: <Calendar size={20} />, description: 'Upcoming events' },
        { id: 'newsletter', name: 'Newsletter', icon: <Mail size={20} />, description: 'Monthly updates' },
        { id: 'promo', name: 'Promotion', icon: <Megaphone size={20} />, description: 'Special offers' },
    ];

    const recentCampaigns = [
        { name: 'Winter Meet 2024 Invite', sent: '1,234', opened: '67%', clicked: '23%', date: 'Dec 15, 2024' },
        { name: 'Black Friday Merch Sale', sent: '1,189', opened: '72%', clicked: '31%', date: 'Nov 24, 2024' },
        { name: 'November Newsletter', sent: '1,156', opened: '58%', clicked: '12%', date: 'Nov 1, 2024' },
    ];

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Engagement</p>
                    <h1>Member <span className="gold-text">Marketing</span></h1>
                </div>
            </header>

            <div className="content">
                {/* Stats */}
                <div className="stats-grid animate-fade" style={{ marginBottom: '32px' }}>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Mail size={20} /></div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Campaigns Sent</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Users size={20} /></div>
                        <div className="stat-value">1,234</div>
                        <div className="stat-label">Total Subscribers</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><MessageSquare size={20} /></div>
                        <div className="stat-value">64%</div>
                        <div className="stat-label">Avg Open Rate</div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon"><Bell size={20} /></div>
                        <div className="stat-value">892</div>
                        <div className="stat-label">Push Subscribers</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                    {/* Template Selector */}
                    <div className="glass animate-fade delay-1" style={{ padding: '24px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Email Templates</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: selectedTemplate === template.id
                                            ? 'rgba(251, 191, 36, 0.1)'
                                            : 'rgba(0,0,0,0.2)',
                                        border: selectedTemplate === template.id
                                            ? '1px solid rgba(251, 191, 36, 0.3)'
                                            : '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ color: 'var(--gold-start)' }}>{template.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{template.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{template.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Composer */}
                    <div className="glass animate-fade delay-2" style={{ padding: '24px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Compose Email</h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Enter email subject..."
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Message
                            </label>
                            <textarea
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your message..."
                                rows={8}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-gold">
                                <Send size={16} style={{ marginRight: 8 }} />
                                Send Campaign
                            </button>
                            <button className="btn btn-glass">
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Campaigns */}
                <div className="glass animate-fade delay-3" style={{ padding: '24px', borderRadius: '24px', marginTop: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Recent Campaigns</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={thStyle}>Campaign</th>
                                <th style={thStyle}>Sent</th>
                                <th style={thStyle}>Opened</th>
                                <th style={thStyle}>Clicked</th>
                                <th style={thStyle}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCampaigns.map((campaign, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
                                            {campaign.name}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{campaign.sent}</td>
                                    <td style={tdStyle}>{campaign.opened}</td>
                                    <td style={tdStyle}>{campaign.clicked}</td>
                                    <td style={tdStyle}>{campaign.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const thStyle: React.CSSProperties = {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 20px',
    fontSize: '14px'
};

export default Marketing;
