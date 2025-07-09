import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { clearUser } from "../reducers/userReducer";
import '../css/layout.scss'; // Ensure this path is correct

const Layout = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    useEffect(() => {
        if (!user && location.pathname !== '/' && location.pathname !== '/about' && location.pathname !== '/login') {
            navigate('/login');
        }
    }, [user, location, navigate]);

    return (
        <div className="main-container">
            <nav className="navbar navbar-expand-lg navbar-dark animated-navbar"> {/* Removed fixed-top */}
                <div className="container">
                    <Link className="navbar-brand animate__animated animate__fadeInLeft" to="/">Spot-Savers</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to='/'>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to='/about'>About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/parking' ? 'active' : ''}`} to='/parking'>Parking</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/space' ? 'active' : ''}`} to='/space'>Spaces</Link>
                            </li>
                            {user?.type !== "seeker" &&
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/parkingForm' ? 'active' : ''}`} to='/parkingForm'>Create Parking</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/spaceForm' ? 'active' : ''}`} to='/spaceForm'>Create Space</Link>
                                    </li>
                                </>
                            }
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`} to='/booking'>Bookings</Link>
                            </li>
                            {user?.type === "admin" &&
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`} to='/users'>Users</Link>
                                    </li>
                                </>
                            }
                            {user ?
                                <>
                                    <li className="nav-item ms-lg-2">
                                        <Link className="nav-link profile-avatar-link" to='/profile'>
                                            <div className="user-avatar">{user?.name && user.name.charAt(0).toUpperCase()}</div>
                                        </Link>
                                    </li>
                                    <li className="nav-item ms-lg-2">
                                        <button className="btn btn-primary logout-btn" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                                :
                                <li className="nav-item ms-lg-2">
                                    <Link className="btn btn-primary login-btn" to='/login'>Login</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>

            <main> {/* Removed paddingTop style */}
                <Outlet />
            </main>

            <footer className="footer-section">
                <div className="container footer-content">
                    <div className="footer-brand">
                        <h2>Spot-Savers</h2>
                        <p>Your ultimate destination to find or list parking spots efficiently.</p>
                    </div>

                    <div className="footer-contact">
                        <h3>Contact Us</h3>
                        <p>Email: <a href="mailto:support@Spot-Savers.com">support@Spot-Savers.com</a></p>
                        <p>Phone: <a href="tel:+441234567890">+44-12345-67890</a></p>
                    </div>

                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/parking">Parking</Link></li>
                            <li><Link to="/booking">Bookings</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Spot-Savers. All rights reserved.</p>
                    <p className="development-status">This website is still under development.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;