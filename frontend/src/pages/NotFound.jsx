import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="notfound-card shadow-2xl relative overflow-hidden">
                {/* Stars Background (Contained in card) */}
                <div className="container container-star">
                    {[...Array(20)].map((_, i) => (
                        <div key={`star1-${i}`} className="star-1"></div>
                    ))}
                    {[...Array(20)].map((_, i) => (
                        <div key={`star2-${i}`} className="star-2"></div>
                    ))}
                </div>

                {/* Animated content */}
                <div className="card-content-wrapper relative z-10">
                    <div className="title-section">
                        <div className="number">4</div>
                        <div className="moon">
                            <div className="face">
                                <div className="mouth"></div>
                                <div className="eyes">
                                    <div className="eye-left"></div>
                                    <div className="eye-right"></div>
                                </div>
                            </div>
                        </div>
                        <div className="number">4</div>
                    </div>

                    <div className="info-section">
                        <h3 className="subtitle">Oops. You took a wrong turn.</h3>
                        <button className="back-btn" onClick={handleGoBack}>
                            Go Back Home
                        </button>
                    </div>
                </div>

                {/* Birds (Contained in card) */}
                <div className="birds-layer">
                    {[...Array(3)].map((_, i) => (
                        <div key={`bird-${i}`} className="bird bird-anim">
                            <div className="bird-container">
                                <div className="wing wing-left"><div className="wing-left-top"></div></div>
                                <div className="wing wing-right"><div className="wing-right-top"></div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFound;
