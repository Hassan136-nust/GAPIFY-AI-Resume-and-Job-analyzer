import { useAuth } from "../features/auth/hooks/useAuth"
import { useNavigate } from "react-router"
import { FiLogOut, FiUser } from "react-icons/fi"
import "./navbar.scss"

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h2>Gapify AI</h2>
                </div>
                
                <div className="navbar-user">
                    <div className="user-info">
                        <FiUser />
                        <span>{user?.username || user?.email}</span>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
