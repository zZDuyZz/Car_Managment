// src/components/Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css'; // Import file CSS riêng cho component

const Footer = () => {
    return (
        <footer className="footer-wave">
            <div className="wave-container">
                <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="parallax">
                        <use href="#gentle-wave" x="48" y="0" />
                        <use href="#gentle-wave" x="48" y="3" />
                        <use href="#gentle-wave" x="48" y="5" />
                        <use href="#gentle-wave" x="48" y="7" />
                    </g>
                </svg>
            </div>
            <div className="footer-content">
                <p>&copy; 2025 Your Company. All Rights Reserved.</p>
                <div className="social-icons">
                    <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
                    <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
                    <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;