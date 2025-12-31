import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn) {
            navigate('/connect');
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "glass-panel rounded-3xl shadow-2xl border border-white/10",
                            headerTitle: "text-2xl font-bold text-white",
                            headerSubtitle: "text-zinc-400 text-sm",
                            socialButtonsBlockButton: "bg-black/20 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 rounded-xl",
                            socialButtonsBlockButtonText: "text-white font-medium",
                            formButtonPrimary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 transition-all",
                            formFieldInput: "bg-black/20 border border-white/10 text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all duration-300 rounded-xl",
                            formFieldLabel: "text-zinc-400 font-medium text-xs",
                            footerActionLink: "text-violet-400 hover:text-violet-300 font-medium",
                            footerActionText: "text-zinc-500",
                            identityPreviewText: "text-white",
                            identityPreviewEditButton: "text-violet-400 hover:text-violet-300",
                            formHeaderTitle: "text-white",
                            formHeaderSubtitle: "text-zinc-400",
                            dividerLine: "bg-white/10",
                            dividerText: "text-zinc-500",
                            formFieldInputShowPasswordButton: "text-zinc-400 hover:text-white",
                            otpCodeFieldInput: "bg-black/20 border border-white/10 text-white",
                            formResendCodeLink: "text-violet-400 hover:text-violet-300",
                            footer: "hidden",
                        },
                        layout: {
                            socialButtonsPlacement: "top",
                            socialButtonsVariant: "blockButton",
                        }
                    }}
                    routing="path"
                    path="/login"
                    signUpUrl="/login"
                />
            </motion.div>
        </div>
    );
};

export default Login;
