import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, Calendar, ClipboardCheck, Network, Car, ShieldCheck, Megaphone, BarChart3, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Family Members', path: '/members' },
        { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: ClipboardCheck, label: 'Registrations', path: '/registrations' },
        { icon: Network, label: 'Network', path: '/network' },
        { icon: Car, label: 'Garage', path: '/garage' },
        { icon: ShieldCheck, label: 'Approvals', path: '/approvals' },
        { icon: Megaphone, label: 'Marketing', path: '/marketing' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Receipt, label: 'Finance', path: '/orders' },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="logo" onClick={() => setCollapsed(!collapsed)}>
                <span>S</span>
            </div>

            <nav className="nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <item.icon />
                        <span className="nav-tooltip">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button className="sidebar-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
                <div className="avatar">
                    <img src="https://i.pravatar.cc/150?u=maurice" alt="Maurice" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
