import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, User, ChevronRight } from 'lucide-react';
import { getPendingApprovals, setMemberApprovalStatus, type MemberApproval } from '@/lib/supabase';

const Approvals = () => {
    const queryClient = useQueryClient();
    const [selectedMember, setSelectedMember] = useState<MemberApproval | null>(null);

    const { data: pendingApprovals = [], isLoading } = useQuery<MemberApproval[]>({
        queryKey: ['pending-approvals'],
        queryFn: getPendingApprovals,
    });

    const approveMutation = useMutation({
        mutationFn: ({ id, status, notes }: { id: number; status: 'pending' | 'approved' | 'rejected' | 'waitlist'; notes?: string }) =>
            setMemberApprovalStatus(id, status, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
            setSelectedMember(null);
        },
    });

    return (
        <>
            <header className="header">
                <div className="header-left animate-fade">
                    <p>Member Management</p>
                    <h1>Pending <span className="gold-text">Approvals</span></h1>
                </div>
                <div className="header-right">
                    <div className="btn btn-glass" style={{ cursor: 'default' }}>
                        <Clock size={16} style={{ marginRight: 8 }} />
                        {pendingApprovals.length} Pending
                    </div>
                </div>
            </header>
            <div className="content">
                {isLoading ? (
                    <div className="loader"><div className="loader-spinner"></div></div>
                ) : pendingApprovals.length === 0 ? (
                    <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
                        <CheckCircle2 size={48} style={{ color: 'var(--green)', marginBottom: '16px' }} />
                        <h3 style={{ marginBottom: '8px' }}>All Caught Up!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No pending member approvals at this time.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div className="glass animate-fade" style={{ padding: '24px', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Pending Queue</h3>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {pendingApprovals.map((approval) => (
                                    <div key={approval.id} onClick={() => setSelectedMember(approval)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: selectedMember?.id === approval.id ? 'rgba(251, 191, 36, 0.1)' : 'rgba(0,0,0,0.2)', border: selectedMember?.id === approval.id ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="member-avatar" style={{ width: '40px', height: '40px' }}><User size={18} /></div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>Member #{approval.woocommerce_customer_id}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(approval.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass animate-fade delay-1" style={{ padding: '24px', borderRadius: '24px' }}>
                            {selectedMember ? (
                                <>
                                    <h3 style={{ marginBottom: '24px' }}>Review Application</h3>
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Customer ID</div>
                                        <div style={{ fontSize: '20px', fontWeight: 700 }}>#{selectedMember.woocommerce_customer_id}</div>
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Applied</div>
                                        <div>{new Date(selectedMember.created_at).toLocaleString()}</div>
                                    </div>
                                    {selectedMember.notes && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Notes</div>
                                            <div>{selectedMember.notes}</div>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                        <button className="btn btn-gold" onClick={() => approveMutation.mutate({ id: selectedMember.woocommerce_customer_id, status: 'approved' })} disabled={approveMutation.isPending}>
                                            <CheckCircle2 size={16} style={{ marginRight: 8 }} /> Approve
                                        </button>
                                        <button className="btn btn-glass" onClick={() => approveMutation.mutate({ id: selectedMember.woocommerce_customer_id, status: 'waitlist' })} disabled={approveMutation.isPending}>
                                            <Clock size={16} style={{ marginRight: 8 }} /> Waitlist
                                        </button>
                                        <button className="btn btn-glass" style={{ color: '#ef4444' }} onClick={() => approveMutation.mutate({ id: selectedMember.woocommerce_customer_id, status: 'rejected' })} disabled={approveMutation.isPending}>
                                            <XCircle size={16} style={{ marginRight: 8 }} /> Reject
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <User size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                    <p>Select a member to review</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Approvals;
