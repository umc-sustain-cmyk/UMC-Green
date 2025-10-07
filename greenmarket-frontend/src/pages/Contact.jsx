import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submitted:', formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={24} color="var(--primary-green)" />,
      title: 'Email Us',
      content: 'hello@greenmarket.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone size={24} color="var(--primary-green)" />,
      title: 'Call Us',
      content: '(555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: <MapPin size={24} color="var(--primary-green)" />,
      title: 'Visit Us',
      content: '123 Green Street, Eco City, EC 12345',
      description: 'Our headquarters'
    },
    {
      icon: <Clock size={24} color="var(--primary-green)" />,
      title: 'Response Time',
      content: '24 hours',
      description: 'Average response time'
    }
  ];

  const faqs = [
    {
      question: 'How do I become a seller on GreenMarket?',
      answer: 'Simply create an account and select "Seller" as your account type during registration. Once approved, you can start listing your sustainable products immediately.'
    },
    {
      question: 'What makes a product eligible for GreenMarket?',
      answer: 'Products must meet our sustainability criteria: locally sourced, organic, minimal packaging, fair trade, or contribute to environmental conservation.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! Our customer support team is available Monday-Friday, 9AM-6PM EST. You can reach us via email, phone, or through this contact form.'
    },
    {
      question: 'How do shipping and delivery work?',
      answer: 'We partner with local delivery services and encourage sellers to offer local pickup options to minimize environmental impact.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-green), var(--light-green))',
        color: 'white',
        padding: '3rem 0'
      }}>
        <div className="container text-center">
          <MessageSquare size={48} color="var(--accent-green)" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Have questions, feedback, or want to partner with us? 
            We'd love to hear from you!
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="grid grid-2" style={{ alignItems: 'flex-start' }}>
          {/* Contact Form */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>Send us a Message</h2>
            
            {success && (
              <div className="alert alert-success">
                <strong>Thank you!</strong> Your message has been sent successfully. 
                We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">General Inquiry</option>
                  <option value="seller">Becoming a Seller</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Business Partnership</option>
                  <option value="press">Press & Media</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="Brief description of your inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us more about your inquiry, feedback, or how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  {formData.message.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Contact Information</h2>
            
            <div className="flex-column gap-3 mb-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="card">
                  <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '0.25rem' }}>
                      {info.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{info.title}</h4>
                      <p style={{ 
                        fontWeight: '500', 
                        color: 'var(--primary-green)', 
                        margin: '0 0 0.25rem 0' 
                      }}>
                        {info.content}
                      </p>
                      <p style={{ 
                        color: 'var(--text-light)', 
                        fontSize: '0.9rem', 
                        margin: 0 
                      }}>
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="card">
              <h4 style={{ marginBottom: '1rem' }}>Office Hours</h4>
              <div className="flex-column gap-1">
                <div className="flex-between">
                  <span>Monday - Friday</span>
                  <span style={{ fontWeight: '500' }}>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex-between">
                  <span>Saturday</span>
                  <span style={{ fontWeight: '500' }}>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex-between">
                  <span>Sunday</span>
                  <span style={{ fontWeight: '500' }}>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '4rem' }}>
          <div className="text-center mb-4">
            <h2>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-2">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h4 style={{ 
                  color: 'var(--primary-green)', 
                  marginBottom: '1rem' 
                }}>
                  {faq.question}
                </h4>
                <p style={{ 
                  color: 'var(--text-light)', 
                  lineHeight: '1.6', 
                  margin: 0 
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <p style={{ color: 'var(--text-light)' }}>
              Can't find what you're looking for?{' '}
              <a href="#contact-form" style={{ color: 'var(--primary-green)' }}>
                Send us a message
              </a>{' '}
              and we'll help you out!
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Other Ways to Connect
          </h2>
          
          <div className="grid grid-3">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h4>Help Center</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                Browse our comprehensive help articles and tutorials
              </p>
              <button className="btn btn-secondary">
                Visit Help Center
              </button>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h4>Community Forum</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                Connect with other users and share sustainability tips
              </p>
              <button className="btn btn-secondary">
                Join Forum
              </button>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h4>Newsletter</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                Stay updated with sustainability news and platform updates
              </p>
              <button className="btn btn-primary">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;