import Navbar from "./Navbar";
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();
    const showNavbar = location.pathname !== '/mail' && location.pathname!=='/newform' && location.pathname!=='/successpage';
    return (
        <>
            {showNavbar && <Navbar />}
            <main style={{
                backgroundImage: `url('https://img.freepik.com/free-vector/winter-light-blue-gradient-vector-background_53876-126054.jpg?auto=format&fit=crop&w=315&h=220')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh' // Ensure it covers the viewport height
            }}>
                {children}</main>
        </>
    );
}

export default Layout;
