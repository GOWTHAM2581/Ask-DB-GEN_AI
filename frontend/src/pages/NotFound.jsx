import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <section className="flex-grow flex items-center justify-center p-8 bg-white min-h-[85vh] rounded-3xl overflow-hidden my-4 mx-4 md:mx-6 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)]">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    {/* 404 Text - Now Above the graphic */}
                    <h1 className="text-8xl md:text-[120px] font-bold text-gray-800 mb-2 tracking-tighter">404</h1>

                    <div
                        className="w-full max-w-4xl h-[300px] md:h-[450px] bg-center bg-no-repeat bg-contain"
                        style={{
                            backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                        }}
                    >
                    </div>

                    <div className="z-10 mt-6 md:mt-10">
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            Look like you're lost
                        </h3>

                        <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
                            the page you are looking for is not available!
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/"
                                className="px-10 py-4 bg-[#39ac31] text-white font-bold text-lg rounded-xl transition-all hover:bg-[#2d8a27] inline-block shadow-2xl hover:shadow-[#39ac31]/40"
                            >
                                Go to Home
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css?family=Arvo');
                .container { font-family: 'Arvo', serif; }
            ` }} />
        </section>
    );
};

export default NotFound;
