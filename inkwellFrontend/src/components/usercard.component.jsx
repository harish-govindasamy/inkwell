import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
    return (
        <Link to={`/user/${user._id}`} className="flex gap-4 items-center border-b border-grey pb-4 mb-4">
            <img src={user.personal_info.profile_img} className="w-12 h-12 rounded-full" />
            <div>
                <h3 className="text-xl font-medium">{user.personal_info.fullname}</h3>
                <p className="text-dark-grey">@{user.personal_info.username}</p>
            </div>
        </Link>
    );
};

export default UserCard;
