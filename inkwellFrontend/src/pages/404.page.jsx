import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";

const PageNotFound = () => {
    return (
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-gelasio mb-4">404</h1>
                    <p className="text-xl text-dark-grey mb-8">Page not found</p>
                    <Link to="/" className="btn-dark">
                        Go Home
                    </Link>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default PageNotFound;
