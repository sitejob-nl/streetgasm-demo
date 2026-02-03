import { useState } from 'react';
import { Mail, Users, Calendar, FileText, Send, Clock } from 'lucide-react';

const Marketing = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const templates = [
        { id: 'welcome', name: 'Welcome Email', icon: <Users size={20} />, description: 'New member onboarding' },
        { id: 'event', name: 'Event Announcement', icon: <Calendar size={20} />, description: 'Upcoming event promotion' },
        { id: 'newsletter', name: 'Newsletter', icon: <FileText size={20} />, description: 'Monthly club update' },
        { id: 'renewal', name: 'Renewal Reminder', icon: <Clock size={20} />, description: 'Subscription renewal' },
    ];

    const recentCampaigns = [
        { name: 'Winter Meet Announcement', sent: '2024-01-15', recipients: 245, openRate: 68 },
        { name: 'January Newsletter', sent: '2024-01-01', recipients: 312, openRate: 54 },
        { name: 'New Year Wishes', sent: '2023-12-31', recipients: 298, openRate: 72 },
    ];

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Member Communication</p>
                    <h1>Email <span className="gold-text">Marketing</span></h1>
                </div>
            </header>

            <div className="content">
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
                    {/* Templates Sidebar */}
                    <div className="glass animate-fade" style={{ padding: '24px', borderRadius: '24px', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px' }}>Templates</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {templates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: selectedTemplate === template.id
                                            ? 'rgba(251, 191, 36, 0.1)'
                                            : 'rgba(0,0,0,0.2)',
                                        border: selectedTemplate === template.id
                                            ? '1px solid rgba(251, 191, 36, 0.3)'
                                            : '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: '#fff',
                                        width: '100%',
                                    }}
                                >
                                    <div style={{ color: 'var(--gold-start)' }}>{template.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{template.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{template.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Email Composer */}
                    <div className="glass animate-fade delay-1" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={20} className="gold-text" /> Compose Email
                        </h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Subject Line
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
                                    fontSize: '14px',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Email Body
                            </label>
                            <textarea
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your email content..."
                                rows={10}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-gold">
                                <Send size={16} style={{ marginRight: 8 }} /> Send Campaign
                            </button>
                            <button className="btn btn-glass">Save Draft</button>
                            <button className="btn btn-glass">Preview</button>
                        </div>
                    </div>
                </div>

                {/* Recent Campaigns */}
                <div className="glass animate-fade delay-2" style={{ padding: '24px', borderRadius: '24px', marginTop: '32px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Recent Campaigns</h3>
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Sent</th>
                                <th>Recipients</th>
                                <th>Open Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCampaigns.map((campaign, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{campaign.name}</td>
                                    <td>{campaign.sent}</td>
                                    <td>{campaign.recipients}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '100px',
                                            background: campaign.openRate > 60 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                            color: campaign.openRate > 60 ? 'var(--green)' : 'var(--gold-start)',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            {campaign.openRate}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Marketing;
