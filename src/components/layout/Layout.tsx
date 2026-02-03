import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="app">
            <div className="bg-layer">
                <div className="bg-image"></div>
                <div className="bg-gradient-1"></div>
                <div className="bg-gradient-2"></div>
            </div>

            <Sidebar />

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
