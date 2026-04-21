import { FiUser } from "react-icons/fi"
import "./developerButton.scss"

const DeveloperButton = () => {
    return (
        <a 
            href="https://hassan-jamal-portfolio.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="developer-button"
        >
            <FiUser />
            <span>About Developer</span>
        </a>
    );
};

export default DeveloperButton;
