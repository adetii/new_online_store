import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">ShopName</h3>
            <p className="mb-4 text-gray-300">
              Your one-stop shop for all your shopping needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaTiktok size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-300 hover:text-white">Return Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
          <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
          <p className="mb-2 text-gray-300">
            123 Shopping Street, Accra, Ghana
          </p>
          <p className="mb-2 text-gray-300">
            Email:{' '}
            <a href="mailto:info@shopname.com" className="hover:underline">
              info@shopname
            </a>
          </p>
          <p className="mb-2 text-gray-300">
            Phone:{' '}
            <a href="tel:+233267161718" className="hover:underline">
            +233 26 716 1718
            </a>
          </p>
          <p className="text-gray-300">
            Hours: Mon-Fri 9am-5pm
          </p>
        </div>
        
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-400">
            &copy; {currentYear} ShopName. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;