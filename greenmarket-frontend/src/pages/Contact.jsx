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
      content: 'greenmarket@crk.umn.edu',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone size={24} color="var(--primary-green)" />,
      title: 'Call Us',
      content: 'UMN Crookston Campus',
      description: 'Visit us on campus'
    },
    {
      icon: <MapPin size={24} color="var(--primary-green)" />,
      title: 'Visit Us',
      content: '2900 University Ave, Crookston, MN',
      description: 'Our campus location'
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
      question: 'How do I donate an item on GreenMarket?',
      answer: 'Create an account, log in, and click "Donate Item". Fill in the item details (name, description, category, condition), upload a photo if you have one, and post. Your donation is immediately visible to the campus community.'
    },
    {
      question: 'How do I reserve an item I want?',
      answer: 'Browse the Donations page, find an item you need, and click "Reserve". The donor will see your reservation and contact you to arrange a convenient pickup time and location.'
    },
    {
      question: 'How do I contact a donor to pick up an item?',
      answer: 'Once an item is reserved for you, the donor will reach out using the contact information in your profile. You can also message them directly through the platform to coordinate pickup details.'
    },
    {
      question: 'Can I post any item I want?',
      answer: 'You can donate most items in good condition—textbooks, furniture, clothing, electronics, sports equipment, and more. Items should be usable and safe. Please be honest about the condition and any defects.'
    },
    {
      question: 'Is there a charge to use GreenMarket?',
      answer: 'No! GreenMarket is completely free. There are no fees for donating or receiving items. It\'s a service for our UMN Crookston community to reduce waste and support each other.'
    },
    {
      question: 'What if I have a question about an item?',
      answer: 'Contact the donor directly once you reserve the item. They\'ll answer any questions about the item\'s condition, specifications, or pickup arrangements.'
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
            Have questions about donating or receiving items? Contact us anytime. 
            We're here to help our campus community thrive!
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
                  <option value="general">General Question</option>
                  <option value="donate">How to Donate Items</option>
                  <option value="receive">How to Receive Items</option>
                  <option value="support">Technical Support</option>
                  <option value="issue">Report an Issue</option>
                  <option value="feedback">Feedback & Suggestions</option>
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