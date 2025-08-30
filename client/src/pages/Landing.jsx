import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import FadedFooterText from "../components/FadedFooterText";

import Tilt from 'react-parallax-tilt';
import Footer from '../components/Footer';
import { 
  Leaf, 
  Shield, 
  Zap, 
  Trophy, 
  QrCode, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };
  
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable ledger ensures transparent and tamper-proof hydrogen credit transactions.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "AI Fraud Detection",
      description: "Advanced ML algorithms detect and prevent fraudulent credit activities in real-time.",
      color: "purple"
    },
    {
      icon: QrCode,
      title: "QR Verification",
      description: "Instant credit verification through secure QR codes for seamless authentication.",
      color: "green"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Leaderboards and achievements encourage sustainable hydrogen production practices.",
      color: "orange"
    }
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Credits Issued" },
    { value: 500, suffix: "+", label: "Active Producers" },
    { value: 50, suffix: "+", label: "Certified Authorities" },
    { value: 99.9, suffix: "%", label: "Uptime" }
  ];

  // Floating background elements
  const FloatingElement = ({ delay, duration, x, y, size }) => (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-r from-green-400/10 to-emerald-400/10 ${size}`}
      style={{ left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );



  // Video Modal Component
  const VideoModal = () => (
    <AnimatePresence>
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">HydroLink Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Demo video coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">Experience the future of green hydrogen credits</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced Navigation Component
  const Navigation = () => (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-lg transform translate-y-0' 
          : 'bg-white/80 backdrop-blur-lg border-b border-green-100/50'
      } ${isDarkMode ? 'dark:bg-gray-900/95 dark:border-gray-700' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              HydroLink
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['features', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 capitalize font-medium"
              >
                {item}
              </button>
            ))}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link 
              to="/register" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-green-100"
          >
            <div className="px-4 py-6 space-y-4">
              {['features', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-gray-600 hover:text-green-600 transition-colors duration-200 capitalize font-medium py-2"
                >
                  {item}
                </button>
              ))}
              <Link 
                to="/register" 
                className="block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Navigation />
      <VideoModal />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 min-h-screen flex items-center">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50" />
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
          style={{ y: y1 }}
        />
        
        {/* Floating Elements */}
        <FloatingElement delay={0} duration={8} x="10%" y="20%" size="w-32 h-32" />
        <FloatingElement delay={2} duration={6} x="80%" y="10%" size="w-24 h-24" />
        <FloatingElement delay={4} duration={10} x="70%" y="70%" size="w-40 h-40" />
        <FloatingElement delay={1} duration={7} x="20%" y="80%" size="w-28 h-28" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Transparent, Trusted
                </motion.span>
                <br />
                Green Hydrogen Credits
              </motion.h1>
              
                             <motion.p 
                 className="text-xl text-gray-600 mb-8 leading-relaxed"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
               >
                 Revolutionizing sustainable energy markets through blockchain-powered 
                 green hydrogen credit verification, trading, and retirement platform.
               </motion.p>
               
               <motion.div 
                 className="flex flex-col sm:flex-row gap-4"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.6 }}
               >
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Link
                     to="/register"
                     className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl relative overflow-hidden"
                   >
                     <motion.div
                       className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                       initial={{ x: '-100%' }}
                       whileHover={{ x: '100%' }}
                       transition={{ duration: 0.6 }}
                     />
                     <span className="relative z-10">Get Started</span>
                     <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                   </Link>
                 </motion.div>
                 <motion.button 
                   onClick={() => setShowVideoModal(true)}
                   className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center group"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Play className="mr-2 w-5 h-5" />
                   Watch Demo
                 </motion.button>
               </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl transform opacity-20"
                  animate={{ rotate: [0, 6, -6, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-green-100 hover:shadow-3xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    borderImage: 'linear-gradient(135deg, #10b981, #059669) 1'
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-gray-900">
                          <CountUp
                            end={stat.value}
                            duration={2}
                            delay={0.5 + index * 0.2}
                            preserveValue
                            decimals={stat.suffix === '%' ? 1 : 0}
                          />
                          <span>{stat.suffix}</span>
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="mt-6 flex items-center justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <span className="text-sm text-gray-600">Verified & Secure Platform</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Background Wave */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-green-50/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful Features for a Sustainable Future
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our platform combines cutting-edge blockchain technology with AI-powered 
              verification to create the most trusted green hydrogen credit system.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                green: 'from-green-500 to-green-600',
                orange: 'from-orange-500 to-orange-600'
              };
              
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="group h-full"
                >
                  <Tilt
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    perspective={1000}
                    transitionSpeed={1000}
                    className="h-full"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                      {/* Gradient border effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[feature.color]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                      
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-r ${colorClasses[feature.color]} rounded-xl flex items-center justify-center mb-6 relative z-10`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 360,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed flex-grow relative z-10">{feature.description}</p>
                      
                      {/* Hover effect overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      />
                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
        {/* SVG Wave Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path 
              d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" 
              fill="url(#waveGradient)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
              viewport={{ once: true }}
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Building Trust in Green Energy Markets
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                HydroLink is revolutionizing the green hydrogen credit ecosystem by providing 
                a transparent, secure, and efficient platform for producers, authorities, and buyers.
              </motion.p>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {[
                  "Blockchain-based immutable credit tracking",
                  "AI-powered fraud detection and prevention", 
                  "Real-time verification and instant transfers"
                ].map((text, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <p className="text-gray-600">{text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
              style={{ y: y2 }}
            >
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {[
                    { 
                      icon: Users, 
                      color: "green", 
                      title: "500+ Producers", 
                      desc: "Active hydrogen producers worldwide",
                      bgGradient: "from-green-50 to-emerald-50",
                      iconBg: "from-green-500 to-emerald-600"
                    },
                    { 
                      icon: TrendingUp, 
                      color: "blue", 
                      title: "$2.5M+ Volume", 
                      desc: "Total credits traded on platform",
                      bgGradient: "from-blue-50 to-cyan-50",
                      iconBg: "from-blue-500 to-cyan-600"
                    },
                    { 
                      icon: Shield, 
                      color: "purple", 
                      title: "99.9% Secure", 
                      desc: "Blockchain-verified transactions",
                      bgGradient: "from-purple-50 to-violet-50",
                      iconBg: "from-purple-500 to-violet-600"
                    },
                    { 
                      icon: Zap, 
                      color: "orange", 
                      title: "Instant Verify", 
                      desc: "Real-time credit validation",
                      bgGradient: "from-orange-50 to-amber-50",
                      iconBg: "from-orange-500 to-amber-600"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.9 },
                        show: { opacity: 1, y: 0, scale: 1 }
                      }}
                      className={`bg-gradient-to-br ${item.bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 group hover:shadow-xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden h-full flex flex-col`}
                      whileHover={{ scale: 1.03, rotateY: 5 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Animated background glow */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${item.iconBg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                        initial={{ scale: 0, rotate: 180 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Icon with enhanced styling */}
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${item.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg relative z-10`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <item.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        {/* Pulsing ring effect */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${item.iconBg} rounded-xl opacity-30`}
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      <div className="relative z-10 flex-grow">
                        <motion.h3 
                          className="font-bold text-gray-900 mb-2 text-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.title}
                        </motion.h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                      </div>
                      
                      {/* Decorative corner element */}
                      <motion.div
                        className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${item.iconBg} opacity-10 rounded-bl-full`}
                        initial={{ scale: 0, rotate: 90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-transparent to-blue-50/30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our partners and users say about the future of green hydrogen credits.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                quote: "HydroLink has revolutionized how we track and trade our green hydrogen credits. The transparency is unmatched.",
                author: "Dr. Sarah Chen",
                role: "Chief Sustainability Officer",
                company: "GreenTech Industries",
                avatar: "👩‍💼"
              },
              {
                quote: "The AI-powered fraud detection gives us complete confidence in every transaction. This is the future of clean energy markets.",
                author: "Michael Rodriguez",
                role: "Director of Operations", 
                company: "CleanPower Corp",
                avatar: "👨‍💼"
              },
              {
                quote: "Real-time verification and instant transfers have streamlined our entire carbon offset program. Outstanding platform!",
                author: "Emma Thompson",
                role: "Environmental Manager",
                company: "EcoSolutions Ltd",
                avatar: "👩‍🔬"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 relative group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Quote decoration */}
                <div className="absolute top-4 left-4 text-6xl text-green-100 font-serif">"</div>
                
                <div className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    {testimonial.quote}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-green-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Platform Impact
            </h2>
            <p className="text-xl text-green-100">
              Real numbers, real impact on our sustainable future
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { value: 25000, suffix: "+", label: "Credits Issued", icon: "🏭" },
              { value: 850, suffix: "+", label: "Active Users", icon: "👥" },
              { value: 99.8, suffix: "%", label: "Accuracy Rate", icon: "🎯" },
              { value: 5.2, suffix: "M", label: "CO₂ Offset (tons)", icon: "🌱" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <CountUp
                    end={stat.value}
                    duration={3}
                    delay={0.5 + index * 0.2}
                    preserveValue
                    decimals={stat.suffix === '%' ? 1 : 0}
                  />
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-green-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Ready to Join the Green Revolution?
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-green-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Start trading verified green hydrogen credits today and contribute to a sustainable energy future.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 inline-flex items-center group font-semibold shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <span className="relative z-10">Get Started Now</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
      </section>
      
      <Footer />
      <FadedFooterText text="HydroLink" />

      
    </div>
  );
};

export default Landing;
