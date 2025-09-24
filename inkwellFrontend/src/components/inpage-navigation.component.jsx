import { useState, useEffect } from "react";

const InPageNavigation = ({ routes, defaultHidden = [] }) => {
    const [inPageRoute, setInPageRoute] = useState(routes[0].name);

    const changePageState = (btnName) => {
        setInPageRoute(btnName);
    };

    return (
        <>
            <div className="relative min-w-max md:hidden">
                <button 
                    className="p-4 flex items-center gap-3 relative"
                    onClick={() => setInPageRoute(prev => prev === "hidden" ? routes[0].name : "hidden")}
                >
                    <p className="font-bold text-lg capitalize">{inPageRoute}</p>
                    <i className={`fi ${inPageRoute === "hidden" ? "fi-rr-angle-small-down" : "fi-rr-angle-small-up"}`}></i>
                </button>

                <div className={`absolute top-[100%] left-0 w-full`}>
                    {inPageRoute === "hidden" ? (
                        <div className="bg-white border border-grey">
                            {routes.map((route, i) => (
                                <button
                                    key={i}
                                    className={`p-4 w-full text-left capitalize ${defaultHidden.includes(route.name) ? "hidden" : ""}`}
                                    onClick={() => changePageState(route.name)}
                                >
                                    {route.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <div className="hidden md:flex items-center justify-around max-md:hidden">
                {routes.map((route, i) => (
                    <button
                        key={i}
                        className={`p-4 capitalize ${defaultHidden.includes(route.name) ? "hidden" : ""} ${inPageRoute === route.name ? "btn-dark" : "btn-light"}`}
                        onClick={() => changePageState(route.name)}
                    >
                        {route.name}
                    </button>
                ))}
            </div>
        </>
    );
};

export default InPageNavigation;
