import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Ticket,
  Globe,
  BarChart3,
  Mail,
  Car
} from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/registrations', icon: Ticket, label: 'Registrations' },
  { to: '/network', icon: Globe, label: 'Network' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/approvals', icon: UserCheck, label: 'Approvals' },
  { to: '/marketing', icon: Mail, label: 'Marketing' },
  { to: '/garage', icon: Car, label: 'Garage' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="logo">STREETGASM</span>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="nav-link" end={to === '/'}>
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
