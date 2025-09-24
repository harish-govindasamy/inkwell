import AnimationWrapper from "../common/page-animation";

const About = () => {
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10 mt-12">
                <div className="max-w-[900px] w-full">
                    <h1 className="text-4xl font-gelasio mb-8">About Inkwell</h1>
                    
                    <div className="prose max-w-none">
                        <p className="text-xl leading-8 mb-6">
                            Inkwell is a modern, full-featured blogging platform built with the MERN stack. 
                            It provides writers with a powerful, intuitive interface to create, publish, and 
                            manage their content.
                        </p>

                        <h2 className="text-2xl font-gelasio mb-4">Features</h2>
                        <ul className="list-disc list-inside space-y-2 mb-6">
                            <li>Rich text editor with EditorJS</li>
                            <li>Real-time collaboration and comments</li>
                            <li>User authentication with Google OAuth</li>
                            <li>Image upload with Cloudflare R2</li>
                            <li>Search and discovery</li>
                            <li>Notification system</li>
                            <li>Responsive design</li>
                            <li>Blog management dashboard</li>
                        </ul>

                        <h2 className="text-2xl font-gelasio mb-4">Technology Stack</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Frontend</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>React 18</li>
                                    <li>Vite</li>
                                    <li>Tailwind CSS</li>
                                    <li>Framer Motion</li>
                                    <li>EditorJS</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Backend</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Node.js</li>
                                    <li>Express.js</li>
                                    <li>MongoDB</li>
                                    <li>Mongoose</li>
                                    <li>JWT Authentication</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-2xl font-gelasio mb-4">Getting Started</h2>
                        <p className="text-lg leading-8 mb-6">
                            To get started with Inkwell, simply sign up for an account, create your profile, 
                            and start writing your first blog post. The platform is designed to be intuitive 
                            and user-friendly, so you can focus on what matters most - your content.
                        </p>

                        <div className="bg-grey p-6 rounded-md">
                            <h3 className="text-lg font-medium mb-2">Need Help?</h3>
                            <p className="text-dark-grey">
                                If you have any questions or need assistance, please don't hesitate to reach out. 
                                We're here to help you make the most of your blogging experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default About;
