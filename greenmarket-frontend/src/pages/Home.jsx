import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Recycle, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import AuthPopup from '../components/AuthPopup';
import AuthNotification from '../components/AuthNotification';
import AuthContext from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Show notification after 1 second, then auth popup after countdown
  useEffect(() => {
    if (!isAuthenticated) {
      const notificationTimer = setTimeout(() => {
        setShowNotification(true);
      }, 1000); // Show notification after 1 second

      return () => clearTimeout(notificationTimer);
    }
  }, [isAuthenticated]);

  const handleCloseAuthPopup = () => {
    setShowAuthPopup(false);
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  const handleShowAuthFromNotification = () => {
    setShowNotification(false);
    setShowAuthPopup(true);
  };

  const features = [
    {
      icon: <Leaf size={48} color="var(--accent-green)" />,
      title: "100% Sustainable",
      description: "Every product are donations from students and our community"
    },
    {
      icon: <Users size={48} color="var(--accent-green)" />,
      title: "Community Driven",
      description: "Supporting students and community"
    },
    {
      icon: <Recycle size={48} color="var(--accent-green)" />,
      title: "Zero Waste",
      description: "Promoting circular economy with reusable products"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Eco Enthusiast",
      content: "GreenMarket has transformed how I shop. I love supporting local farmers while reducing my carbon footprint!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Organic Farmer",
      content: "As a seller, I've found an amazing community here. My organic vegetables reach customers who truly value sustainability.",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "Sustainable Living Advocate",
      content: "The quality of products and the mission behind GreenMarket makes every purchase feel meaningful.",
      rating: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-green), var(--light-green))',
        color: 'white',
        padding: '4rem 0'
      }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.5rem' }}>
                Welcome to the Future of 
                <span style={{ color: 'var(--accent-green)' }}> Sustainable </span>
                Shopping
              </h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Join our community marketplace where every purchase supports 
                environmental sustainability and local businesses. Shop with purpose, 
                live with impact.
              </p>
              <div className="flex gap-3">
                <Link to="/marketplace" className="btn btn-accent">
                  <ShoppingBag size={20} />
                  Start Shopping
                </Link>
                <Link to="/register" className="btn" style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white'
                }}>
                  Join Community
                </Link>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '8rem' }}>
              🌱
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Why Choose GreenMarket?</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              We're more than just a marketplace - we're a movement towards sustainable living
            </p>
          </div>
          
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div style={{ marginBottom: '1.5rem' }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p style={{ color: 'var(--text-light)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-4 text-center">
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                500+
              </div>
              <p style={{ color: 'var(--text-light)' }}>Eco Products</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                100+
              </div>
              <p style={{ color: 'var(--text-light)' }}>Local Sellers</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                1,000+
              </div>
              <p style={{ color: 'var(--text-light)' }}>Happy Customers</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                50%
              </div>
              <p style={{ color: 'var(--text-light)' }}>Carbon Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>How GreenMarket Works</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              Simple, sustainable, and community-focused
            </p>
          </div>

          <div className="grid grid-3">
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <h3>Browse & Discover</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Explore our curated collection of sustainable products from local sellers
              </p>
            </div>

            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <h3>Shop with Purpose</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Every purchase supports environmental sustainability and local communities
              </p>
            </div>

            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                3
              </div>
              <h3>Make an Impact</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Join a community that's actively working towards a more sustainable future
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2>What Our Community Says</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              Real stories from real people making a difference
            </p>
          </div>

          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--accent-green)" color="var(--accent-green)" />
                  ))}
                </div>
                <p style={{ 
                  fontStyle: 'italic', 
                  marginBottom: '1rem',
                  color: 'var(--text-light)'
                }}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--dark-green)' }}>
                    {testimonial.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--dark-green), var(--primary-green))',
        color: 'white',
        padding: '3rem 0'
      }}>
        <div className="container text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join thousands of people who are choosing sustainability without compromising on quality
          </p>
          <div className="flex-center gap-3">
            <Link to="/marketplace" className="btn btn-accent">
              Start Looking Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn" style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white'
            }}>
              Become a Donator
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Notification - Shows after 1 second with countdown */}
      {showNotification && (
        <AuthNotification
          onDismiss={handleDismissNotification}
          onShowAuth={handleShowAuthFromNotification}
        />
      )}

      {/* Auth Popup - Shows after notification countdown or can be triggered manually */}
      <AuthPopup 
        isOpen={showAuthPopup} 
        onClose={handleCloseAuthPopup} 
      />
    </div>
  );
}

export default Home;