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
        if (!user && location.pathname !== '/' && location.pathname !== '/about' && location.pathname !== '/login') {
            navigate('/login');
        }
    }, [user, location, navigate]);

    return (
        <div className="main-container">
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

            <footer className="footer-section bg-dark text-light py-3 mt-5">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center small">
                    <p className="mb-1">© {new Date().getFullYear()} Spot-Savers</p>
                    <p className="mb-0">Still under development</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
