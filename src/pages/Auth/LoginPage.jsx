import React, { useState, useEffect } from "react";

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

const LoginPage = ({ onLoginSuccess }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Thêm state để lưu trữ giá trị từ input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Thiết lập interval để tự động chuyển slide sau mỗi 5 giây
        const slideInterval = setInterval(() => {
            setCurrentSlideIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
            );
        }, 5000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(slideInterval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlideIndex(index);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        // --- Logic đăng nhập giả lập ---
        const mockAdminEmail = "admin@example.com";
        const mockAdminPassword = "password123";
        const mockCustomerEmail = "customer@example.com";
        const mockCustomerPassword = "customer123";
        // Tài khoản nhân viên mới
        const mockStaffEmail = "staff@example.com";
        const mockStaffPassword = "staff123";

        setTimeout(() => {
            setIsLoggingIn(false);
            if (email === mockAdminEmail && password === mockAdminPassword) {
                alert("Đăng nhập với tài khoản Admin thành công!");
                if (onLoginSuccess) {
                    onLoginSuccess('admin');
                }
            } else if (email === mockCustomerEmail && password === mockCustomerPassword) {
                alert("Đăng nhập với tài khoản Customer thành công!");
                if (onLoginSuccess) {
                    onLoginSuccess('customer');
                }
            } else if (email === mockStaffEmail && password === mockStaffPassword) {
                alert("Đăng nhập với tài khoản Staff thành công!");
                if (onLoginSuccess) {
                    onLoginSuccess('staff');
                }
            } else {
                alert("Email hoặc mật khẩu không chính xác!");
            }
        }, 2000);
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
                        className="w-80 h-80 mb-4"
                    />
                    <h1 className="text-4xl font-extrabold text-gray-800">GaraX</h1>
                </div>


                {/* Tabs */}
                <div className="flex gap-8 mb-8 text-xl">
                    <button className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">
                        Log In
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">Sign Up</button>
                </div>

                {/* Form */}
                <form className="w-full max-w-md space-y-6" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-between text-base text-gray-500">
                        <a href="#" className="hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? "Đang đăng nhập..." : "Log In"}
                    </button>
                </form>

                {/* Social Login */}
                <div className="flex items-center my-8 w-full max-w-md">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-500 text-lg">or</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                <div className="flex gap-6 flex-wrap justify-center w-full max-w-md">
                    <button className="flex items-center gap-3 px-6 py-3 border rounded-lg text-lg hover:bg-gray-100">
                        <img
                            src="https://www.svgrepo.com/show/355037/google.svg"
                            alt="Google"
                            className="w-6 h-6"
                        />
                        Google
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 border rounded-lg text-lg hover:bg-gray-100">
                        <img
                            src="https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png"
                            alt="Facebook"
                            className="w-6 h-6"
                        />
                        Facebook
                    </button>
                </div>
            </div>

            {/* Right Panel - Auto Slide */}
            <div
                className="w-full md:w-1/2 h-full relative flex flex-col justify-center items-center text-white p-12 transition-all duration-1000 ease-in-out"
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

export default LoginPage;