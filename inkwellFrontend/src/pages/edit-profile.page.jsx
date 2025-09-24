import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Toaster, toast } from "react-hot-toast";
import { uploadImage } from "../common/cloudflare";

const EditProfile = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const editProfileForm = useRef();
    const profileImgRef = useRef();

    const getUser = () => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/get-user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then(p => p.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
            }
        })
        .catch(err => {
            toast.error("Error occurred while fetching user data");
        });
    };

    const handleImageUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading image...");
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        profileImgRef.current.src = url;
                        toast.dismiss(loadingToast);
                        toast.success("Image uploaded successfully");
                    }
                })
                .catch((error) => {
                    toast.dismiss(loadingToast);
                    toast.error("Error uploading image");
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let form = new FormData(editProfileForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { username, bio, youtube, instagram, facebook, twitter, github, website } = formData;

        if (username.length < 3) {
            return toast.error("Username should be at least 3 letters long");
        }

        if (bio.length > 200) {
            return toast.error("Bio should not be more than 200 characters");
        }

        let social_links = {
            youtube,
            instagram,
            facebook,
            twitter,
            github,
            website
        };

        fetch(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({
                username,
                bio,
                social_links
            })
        })
        .then(p => p.json())
        .then(data => {
            if (data.username) {
                toast.success("Profile updated successfully");
                setLoading(false);
            }
        })
        .catch(err => {
            toast.error("Error updating profile");
            setLoading(false);
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AnimationWrapper>
            <Toaster />
            {user === null ? (
                <Loader />
            ) : (
                <section className="h-cover flex justify-center gap-10 mt-12">
                    <div className="max-w-[650px] w-full">
                        <h1 className="text-4xl font-gelasio mb-8">Edit Profile</h1>

                        <form ref={editProfileForm} onSubmit={handleSubmit}>
                            <div className="flex gap-4 items-center mb-8">
                                <div className="w-20 h-20 rounded-full overflow-hidden">
                                    <img
                                        ref={profileImgRef}
                                        src={user.personal_info.profile_img}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        id="profileImg"
                                        accept=".png, .jpg, .jpeg"
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="profileImg" className="btn-light cursor-pointer">
                                        Change Image
                                    </label>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-lg font-medium">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        defaultValue={user.personal_info.username}
                                        className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="text-lg font-medium">Bio</label>
                                    <textarea
                                        name="bio"
                                        defaultValue={user.personal_info.bio}
                                        maxLength="200"
                                        className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-20 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-gelasio mb-4">Social Links</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-lg font-medium">YouTube</label>
                                        <input
                                            type="url"
                                            name="youtube"
                                            defaultValue={user.social_links?.youtube || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-lg font-medium">Instagram</label>
                                        <input
                                            type="url"
                                            name="instagram"
                                            defaultValue={user.social_links?.instagram || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-lg font-medium">Facebook</label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            defaultValue={user.social_links?.facebook || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-lg font-medium">Twitter</label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            defaultValue={user.social_links?.twitter || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-lg font-medium">GitHub</label>
                                        <input
                                            type="url"
                                            name="github"
                                            defaultValue={user.social_links?.github || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-lg font-medium">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            defaultValue={user.social_links?.website || ""}
                                            className="w-full bg-grey p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-dark w-full"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default EditProfile;
