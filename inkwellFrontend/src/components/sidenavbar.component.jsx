import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const SideNavbar = () => {
    const { userAuth: { username }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null });
    };

    return (
        <div className="min-w-[300px] max-md:hidden">
            <div className="sticky top-[100px]">
                <div className="bg-grey p-6 rounded-md mb-6">
                    <h2 className="text-xl font-gelasio mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <Link to="/editor" className="btn-dark w-full text-center block">
                            Write New Blog
                        </Link>
                        <Link to="/dashboard" className="btn-light w-full text-center block">
                            Dashboard
                        </Link>
                        <Link to="/notifications" className="btn-light w-full text-center block">
                            Notifications
                        </Link>
                    </div>
                </div>

                <div className="bg-grey p-6 rounded-md">
                    <h2 className="text-xl font-gelasio mb-4">Account</h2>
                    <div className="space-y-2">
                        <Link to={`/user/${username}`} className="block text-dark-grey hover:text-black">
                            Profile
                        </Link>
                        <Link to="/edit-profile" className="block text-dark-grey hover:text-black">
                            Edit Profile
                        </Link>
                        <Link to="/change-password" className="block text-dark-grey hover:text-black">
                            Change Password
                        </Link>
                        <button 
                            onClick={signOutUser}
                            className="block text-red-500 hover:text-red-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideNavbar;
