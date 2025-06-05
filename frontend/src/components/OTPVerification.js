import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CircularProgress } from "@mui/material";
import { FaArrowLeft } from 'react-icons/fa';

const OTPVerification = ({ email, onVerificationComplete }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Start countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/verify-otp', {
                email,
                otp: otp.join('')
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data?.success) {
                onVerificationComplete();
            } else {
                throw new Error(response.data?.message || 'Verification failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/send-otp', 
                { email },
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            if (response.data?.success) {
                setTimeLeft(600); // Reset timer to 10 minutes
                setCanResend(false);
                toast.success('New OTP sent successfully!');
            } else {
                throw new Error(response.data?.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to resend OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Title Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        HashWeb
                    </h1>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        Enter Verification Code
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit code to <span className="font-medium">{email}</span>
                    </p>
                </div>

                {/* Back to Email Input Link */}
                <div className="flex justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                        <FaArrowLeft className="mr-2" />
                        Change Email
                    </button>
                </div>

                {/* OTP Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    name={`otp-${index}`}
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    disabled={isSubmitting}
                                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Time remaining: {formatTime(timeLeft)}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || otp.join('').length !== 6}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Verify Email"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={!canResend || isSubmitting}
                            className="w-full text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>

                {/* Terms and Privacy */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default OTPVerification;
