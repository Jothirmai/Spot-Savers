import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { clearUser } from "../reducers/userReducer";
import '../css/layout.scss';

const Layout = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    useEffect(() => {
        if (!user && !['/', '/about', '/login'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [user, location, navigate]);

    return (
        <div className="main-container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Spot-Savers</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
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

                            {user && (
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/parking' ? 'active' : ''}`} to='/parking'>Parking</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/space' ? 'active' : ''}`} to='/space'>Spaces</Link>
                                    </li>

                                    {user?.type !== "seeker" && (
                                        <>
                                            <li className="nav-item">
                                                <Link className={`nav-link ${location.pathname === '/parkingForm' ? 'active' : ''}`} to='/parkingForm'>Create Parking</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className={`nav-link ${location.pathname === '/spaceForm' ? 'active' : ''}`} to='/spaceForm'>Create Space</Link>
                                            </li>
                                        </>
                                    )}

                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`} to='/booking'>Bookings</Link>
                                    </li>

                                    {user?.type === "admin" && (
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`} to='/users'>Users</Link>
                                        </li>
                                    )}

                                    <li className="nav-item ms-lg-2">
                                        <Link className="nav-link profile-avatar-link" to='/profile'>
                                            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                                        </Link>
                                    </li>
                                    <li className="nav-item ms-lg-2">
                                        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}

                            {!user && (
                                <li className="nav-item ms-lg-2">
                                    <Link className="btn btn-sm btn-outline-light" to='/login'>Login</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="footer-section bg-dark text-light mt-5 pt-4 pb-2">
                <div className="container d-flex flex-column flex-md-row justify-content-between text-center text-md-start gap-4 mb-3">
                    <div>
                        <h5>Spot-Savers</h5>
                        <p className="small mb-1">Find or list parking spots with ease.</p>
                    </div>

                    <div>
                        <h6>Contact Us</h6>
                        <p className="mb-1">📧 <a href="mailto:support@spot-savers.com" className="text-light text-decoration-none">support@spot-savers.com</a></p>
                        <p>📞 <a href="tel:+441234567890" className="text-light text-decoration-none">+44-12345-67890</a></p>
                    </div>
                </div>

                <div className="text-center border-top pt-2 small">
                    <p className="mb-0">&copy; {new Date().getFullYear()} Spot-Savers. All rights reserved.</p>
                    <p className="mb-0">🚧 This website is still under development.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
