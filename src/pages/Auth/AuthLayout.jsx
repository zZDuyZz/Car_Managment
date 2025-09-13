// src/pages/Auth/AuthLayout.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Dữ liệu cho các slide
const slides = [
    {
        image:
            "https://cdn3.foap.com/mission_example_photos/8f908573-d292-470d-b0cb-6faa8ec291f9/w1920.jpg?1522921501",
        title: "Quản lý gara ô tô dễ dàng",
        description: "Tất cả dữ liệu của bạn ở một nơi duy nhất.",
    },
    {
        image:
            "https://www.swadeology.com/wp-content/uploads/2014/07/DreamGarage.jpg",
        title: "Theo dõi tiến độ sửa chữa",
        description: "Cập nhật trạng thái xe theo thời gian thực.",
    },
    {
        image:
            "https://th.bing.com/th/id/R.def5fb8b3b42eadb478893af3b35d9b0?rik=atM84UkN1xxq2w&riu=http%3a%2f%2fspeedhunters-wp-production.s3.amazonaws.com%2fwp-content%2fuploads%2f2016%2f01%2f13122650%2fZ-Car-Garage-59-copy.jpg&ehk=uNknmSezM37pYFrhSYTZEFDix2IlMx9cfqI4WkII%2ba4%3d&risl=&pid=ImgRaw&r=0",
        title: "Tiếp cận khách hàng tiềm năng",
        description: "Công cụ tiếp thị mạnh mẽ, giúp bạn mở rộng kinh doanh.",
    },
];

const AuthLayout = ({ children, isLogin }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlideIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
            );
        }, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlideIndex(index);
    };

    const currentSlide = slides[currentSlideIndex];

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Panel - Form */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 md:px-20 py-10 md:py-0">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="https://www.freepnglogos.com/uploads/race-car-logo-symbol-speed-png-23.png"
                        alt="GaraX Logo"
                        className="w-120 h-80 mb-5"
                    />
                    <h1 className="text-6xl font-extrabold text-gray-800">AutoGenius</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 text-xl">
                    <Link to="/" className={`font-semibold pb-1 ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                        Log In
                    </Link>
                    <Link to="/signup" className={`font-semibold pb-1 ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                        Sign Up
                    </Link>
                </div>

                {/* Nội dung riêng của từng trang (login hoặc signup) */}
                {children}
            </div>

            {/* Right Panel - Auto Slide */}
            <div
                className="hidden md:flex w-full md:w-1/2 h-full relative flex-col justify-center items-center text-white p-12 transition-all duration-1000 ease-in-out"
                style={{
                    backgroundImage: `url('${currentSlide.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center max-w-lg">
                    <h2 className="text-3xl font-bold mb-3">{currentSlide.title}</h2>
                    <p className="text-xl text-gray-100">{currentSlide.description}</p>
                </div>

                {/* Các chấm tròn điều hướng */}
                <div className="absolute bottom-5 flex space-x-2">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                                index === currentSlideIndex ? "bg-blue-600" : "bg-gray-400"
                            }`}
                            onClick={() => handleDotClick(index)}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;