import { useContext, useRef, useState } from "react";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";

const ChangePassword = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const changePasswordForm = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword.length) {
            return toast.error("Enter your current password");
        }

        if (!newPassword.length) {
            return toast.error("Enter a new password");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }

        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!passwordRegex.test(newPassword)) {
            return toast.error("Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter");
        }

        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        })
        .then(p => p.json())
        .then(data => {
            if (data.status === "Password changed") {
                toast.success("Password changed successfully");
                changePasswordForm.current.reset();
            } else {
                toast.error(data.error || "Error changing password");
            }
            setLoading(false);
        })
        .catch(err => {
            toast.error("Error changing password");
            setLoading(false);
        });
    };

    return (
        <AnimationWrapper>
            <Toaster />
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[650px] w-full">
                    <h1 className="text-4xl font-gelasio mb-8">Change Password</h1>

                    <form ref={changePasswordForm} onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="text-lg font-medium">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter your current password"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-lg font-medium">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter your new password"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="text-lg font-medium">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Confirm your new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-dark w-full"
                        >
                            {loading ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default ChangePassword;
