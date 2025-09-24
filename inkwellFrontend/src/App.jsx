import { Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import Home from "./pages/home.page";
import BlogPage from "./pages/blog.page";
import SearchPage from "./pages/search.page";
import ProfilePage from "./pages/profile.page";
import Dashboard from "./pages/dashboard.page";
import EditProfile from "./pages/edit-profile.page";
import ChangePassword from "./pages/change-password.page";
import ManageBlogs from "./pages/manage-blogs.page";
import Notifications from "./pages/notifications.page";
import PageNotFound from "./pages/404.page";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});
    useEffect(() => {
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

    }, []);


    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/editor" element={<Editor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/manage-blogs" element={<ManageBlogs />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/" element={<Navbar />} >
                    <Route index element={<Home />} />
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="user/:user_id" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App;