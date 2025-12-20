import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <section className="flex-grow flex items-center justify-center p-4 bg-white min-h-[70vh] rounded-3xl overflow-hidden my-8 mx-4 md:mx-auto max-w-6xl">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center">
                    <div
                        className="w-full max-w-2xl h-[400px] bg-center bg-no-repeat bg-contain flex items-center justify-center"
                        style={{
                            backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                        }}
                    >
                        <h1 className="text-8xl font-bold text-gray-800">404</h1>
                    </div>

                    <div className="-mt-12 z-10">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Look like you're lost
                        </h3>

                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            the page you are looking for is not available!
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/"
                                className="px-8 py-3 bg-[#39ac31] text-white font-bold rounded-lg transition-colors hover:bg-[#2d8a27] inline-block shadow-lg"
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
