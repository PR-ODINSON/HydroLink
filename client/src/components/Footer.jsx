import React from 'react';
import { Leaf, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-100 overflow-hidden">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                HydroLink
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Revolutionizing green hydrogen credit trading through blockchain technology, 
              AI-powered fraud detection, and transparent verification systems.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Producer Portal</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Credit Explorer</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-green-200 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 HydroLink. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Faded Enlarged Text - Spanning full width */}
      
    </footer>
  );
};

export default Footer;
