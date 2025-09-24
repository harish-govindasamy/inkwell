import { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const Tools = () => {
    const { userAuth: { access_token } } = useContext(UserContext);

    if (!access_token) {
        return null;
    }

    return (
        <div className="bg-grey p-6 rounded-md mb-6">
            <h2 className="text-xl font-gelasio mb-4">Tools</h2>
            <div className="space-y-2">
                <Link to="/editor" className="block text-dark-grey hover:text-black">
                    <i className="fi fi-rr-file-edit mr-2"></i>
                    Write Blog
                </Link>
                <Link to="/manage-blogs" className="block text-dark-grey hover:text-black">
                    <i className="fi fi-rr-document mr-2"></i>
                    Manage Blogs
                </Link>
                <Link to="/notifications" className="block text-dark-grey hover:text-black">
                    <i className="fi fi-rr-bell mr-2"></i>
                    Notifications
                </Link>
                <Link to="/dashboard" className="block text-dark-grey hover:text-black">
                    <i className="fi fi-rr-dashboard mr-2"></i>
                    Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Tools;
